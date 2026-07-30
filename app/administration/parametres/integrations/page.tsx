import type { Metadata } from "next";
import { IntegrationSettings } from "@/features/back-office";
import { getIntegrationStatuses } from "@/platform/integrations/status";

export const metadata: Metadata = { title: "Intégrations | Beaux Rivages", robots: { index: false, follow: false } };
export default function IntegrationsPage() { return <IntegrationSettings statuses={getIntegrationStatuses()} />; }
