"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin-login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="block w-full rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-left text-sm text-red-200 transition hover:bg-red-500/20"
    >
      Logout
    </button>
  );
}
