import type { Metadata } from "next";
import { OperationsTasks } from "@/features/back-office";

export const metadata: Metadata = { title: "Tâches et checklists | Beaux Rivages", robots: { index: false, follow: false } };
export default function TasksPage() { return <OperationsTasks />; }
