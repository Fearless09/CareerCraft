import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Metadata } from "next";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Admin Dashboard - CareerCraft",
  description: "Manage your CareerCraft website",
};

export default function AdminServerLayout({ children }: AdminLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
}
