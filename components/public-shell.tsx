import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#050505] text-white">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}

