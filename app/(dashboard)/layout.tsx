import type { ReactNode } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";

type DashboardGroupLayoutProps = {
  children: ReactNode;
};

export default function DashboardGroupLayout({
  children,
}: DashboardGroupLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}