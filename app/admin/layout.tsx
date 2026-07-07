import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin-auth";
import { AdminResponsiveShell } from "@/components/admin-responsive-shell";

const sidebarItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Home Content", href: "/admin/home" },
  { label: "About", href: "/admin/about" },
  { label: "Join", href: "/admin/join" },
  { label: "Contact", href: "/admin/contact" },
  { label: "Engage", href: "/admin/engage" },
  { label: "Notifications", href: "/admin/notifications" },
  { label: "Programs", href: "/admin/programs" },
  { label: "News & Events", href: "/admin/news-events" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Store", href: "/admin/store" },
  { label: "Footer", href: "/admin/footer" }
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const session = verifyAdminSession(token);

  if (!session) {
    redirect("/admin-login");
  }

  return (
    <AdminResponsiveShell items={sidebarItems}>{children}</AdminResponsiveShell>
  );
}
