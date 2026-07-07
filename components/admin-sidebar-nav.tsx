"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarItem = {
  label: string;
  href: string;
};

export function AdminSidebarNav({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="mt-8 space-y-2 overflow-y-auto pr-2 text-sm text-zinc-300 [scrollbar-color:rgba(255,255,255,0.25)_transparent] [scrollbar-width:thin]">
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`block rounded-2xl px-4 py-3 transition ${
              active
                ? "bg-red-500/15 text-white ring-1 ring-red-400/40"
                : "hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
