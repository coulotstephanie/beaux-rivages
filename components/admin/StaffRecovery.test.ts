// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({
  generateLink: vi.fn(),
  roles: vi.fn(),
  send: vi.fn(),
  verifyOtp: vi.fn(),
  updateUser: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("@/platform/database/client", () => ({
  isDatabaseConfigured: () => true,
  getDatabaseClient: () => ({
    auth: { admin: { generateLink: mocks.generateLink } },
    from: () => ({ select: () => ({ eq: mocks.roles }) }),
  }),
}));
vi.mock("@/platform/auth/provider", () => ({
  isStaffAuthConfigured: () => true,
  getStaffAuthClient: () => ({
    auth: { verifyOtp: mocks.verifyOtp, updateUser: mocks.updateUser, signOut: mocks.signOut },
  }),
}));
vi.mock("@/platform/email/contracts", () => ({
  ConfigurableEmailProvider: class {
    send = mocks.send;
  },
}));
import { POST, PUT } from "@/app/api/auth/staff/recovery/route";
let ip = 0;
function request(body: object, method = "POST", origin = "https://www.beaux-rivages.com") {
  return new NextRequest("https://www.beaux-rivages.com/api/auth/staff/recovery", {
    method,
    headers: {
      origin,
      host: "www.beaux-rivages.com",
      "content-type": "application/json",
      "x-forwarded-for": `192.0.2.${++ip}`,
    },
    body: JSON.stringify(body),
  });
}
const token = "a".repeat(64);
beforeEach(() => {
  vi.resetAllMocks();
  mocks.generateLink.mockResolvedValue({
    data: {
      user: { id: "staff", email: "staff@example.com" },
      properties: { hashed_token: token, action_link: "http://localhost:3000/broken" },
    },
    error: null,
  });
  mocks.roles.mockResolvedValue({ data: [{ role: "admin" }], error: null });
  mocks.send.mockResolvedValue({ messageId: "id", status: "queued" });
  mocks.verifyOtp.mockResolvedValue({ data: { session: {} }, error: null });
  mocks.updateUser.mockResolvedValue({ error: null });
});
describe("staff password recovery", () => {
  it("sends a canonical link with recovery material only in its fragment", async () => {
    const response = await POST(request({ email: "staff@example.com" }));
    expect(response.status).toBe(200);
    const mail = mocks.send.mock.calls[0][0];
    expect(mail.to).toBe("staff@example.com");
    expect(mail.html).toContain(
      `https://www.beaux-rivages.com/administration/reinitialiser#token_hash=${token}`,
    );
    expect(mail.html).not.toContain("localhost");
    expect(JSON.stringify(await response.json())).not.toContain(token);
  });
  it("does not send recovery mail to a non-staff account", async () => {
    mocks.roles.mockResolvedValue({ data: [{ role: "customer" }], error: null });
    expect((await POST(request({ email: "staff@example.com" }))).status).toBe(200);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it("keeps an unknown account response neutral", async () => {
    mocks.generateLink.mockResolvedValue({ data: null, error: { code: "user_not_found" } });
    expect((await POST(request({ email: "missing@example.com" }))).status).toBe(200);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it("does not claim successful delivery when the provider fails", async () => {
    mocks.send.mockRejectedValue(new Error("delivery failed"));
    expect((await POST(request({ email: "staff@example.com" }))).status).toBe(503);
  });
  it("rejects foreign origins before generating any link", async () => {
    expect(
      (await POST(request({ email: "staff@example.com" }, "POST", "https://other.example"))).status,
    ).toBe(403);
    expect(mocks.generateLink).not.toHaveBeenCalled();
  });
  it("verifies the recovery type before updating the password", async () => {
    expect(
      (await PUT(request({ tokenHash: token, password: "new-test-password" }, "PUT"))).status,
    ).toBe(200);
    expect(mocks.verifyOtp).toHaveBeenCalledWith({ token_hash: token, type: "recovery" });
    expect(mocks.updateUser).toHaveBeenCalledWith({ password: "new-test-password" });
    expect(mocks.signOut).toHaveBeenCalled();
  });
  it("never updates a password with an expired or reused token", async () => {
    mocks.verifyOtp.mockResolvedValue({ data: { session: null }, error: { message: "expired" } });
    expect(
      (await PUT(request({ tokenHash: token, password: "new-test-password" }, "PUT"))).status,
    ).toBe(401);
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });
});
