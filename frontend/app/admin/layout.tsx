"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AdminShell from "./components/layout/AdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [authorized, setAuthorized] =
    useState(false);

  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem(
        "adminLoggedIn"
      );

    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return null;
  }

  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}