import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("public CMS and property content use a bounded shared cache", () => {
  for (const path of ["platform/cms/public.ts", "platform/property-editor/public.ts"]) {
    const source = read(path);
    assert.match(source, /unstable_cache as cache/);
    assert.match(source, /revalidate: 300/);
    assert.doesNotMatch(source, /unstable_noStore|noStore\(\)/);
  }
});

test("publishing content invalidates the matching public cache", () => {
  assert.match(
    read("app/api/admin/property-editor/[slug]/route.ts"),
    /revalidateTag\(PUBLISHED_PROPERTY_CACHE_TAG\)/,
  );
  const cmsRoute = read("app/api/admin/cms/pages/route.ts");
  assert.match(cmsRoute, /revalidateTag\(PUBLISHED_CMS_CACHE_TAG\)/);
  assert.equal(
    cmsRoute.match(/revalidateTag\(PUBLISHED_CMS_CACHE_TAG\)/g)?.length,
    2,
    "CMS save and restore must both invalidate the public cache",
  );
});
