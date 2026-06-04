"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ConfirmModal from "../modals/ConfirmModal";

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({
  children,
}: AdminShellProps) {
  const router = useRouter();

  const [darkMode, setDarkMode] =
    useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] =
    useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(
        "forecast-dark-mode"
      );

    if (savedTheme) {
      setDarkMode(
        JSON.parse(savedTheme)
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "forecast-dark-mode",
      JSON.stringify(darkMode)
    );
  }, [darkMode]);

  const bg = darkMode
    ? "#0F172A"
    : "#F6F4FA";

  const mainTxt = darkMode
    ? "#F1F5F9"
    : "#1E293B";

  const handleLogout = () => {
    localStorage.removeItem(
      "adminLoggedIn"
    );

    setShowLogoutConfirm(false);

    router.push("/login");
  };

  return (
    <>
      <ConfirmModal
        isOpen={showLogoutConfirm}
        darkMode={darkMode}
        title="Logging Out?"
        message="You'll be signed out of your admin session."
        confirmText="Yes, Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() =>
          setShowLogoutConfirm(false)
        }
      />

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          background: bg,
          color: mainTxt,
        }}
      >
        <Sidebar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          activeMenu=""
          setActiveMenu={() => {}}
          onLogout={() =>
            setShowLogoutConfirm(true)
          }
        />

        <main
          style={{
            flex: 1,
            padding: "2rem",
            overflowY: "auto",
          }}
        >
          <Topbar
            darkMode={darkMode}
          />

          {children}
        </main>
      </div>
    </>
  );
}