import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function AuthenticatedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
