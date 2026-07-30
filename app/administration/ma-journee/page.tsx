import type { Metadata } from "next";
import { MyDay } from "@/features/back-office";

export const metadata: Metadata = { title: "Ma journée | Beaux Rivages", robots: { index: false, follow: false } };
export default function MyDayPage() { return <MyDay />; }
