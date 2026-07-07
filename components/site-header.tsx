"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useHomeContent } from "@/components/home-content-provider";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "News & Events", href: "/news-events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Store", href: "/store" },
  { label: "Join", href: "/join-register" },
  { label: "Contact Us", href: "/contact" },
  { label: "Engage", href: "/engage" }
];

export function SiteHeader() {
  const { content } = useHomeContent();
  const footer = content.footerContent;
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/15 text-sm font-black text-white">
            {footer.badgeImage ? (
              <img src={footer.badgeImage} alt={footer.brandName} className="h-full w-full object-cover" />
            ) : (
              <span>KA</span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">{footer.brandName}</h1>
          </div>
        </div>
        <nav className="hidden gap-6 text-sm text-zinc-300 lg:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/store"
            className="hidden rounded-full border border-red-500/40 bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400 sm:inline-flex"
          >
            Shop Now
          </Link>
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {menuOpen ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen ? (
        <div className="absolute right-4 top-full z-50 mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-[1.5rem] border border-white/10 bg-black/90 p-4 shadow-2xl backdrop-blur lg:hidden">
          <nav className="flex max-h-[65vh] flex-col gap-2 overflow-y-auto text-sm text-zinc-200">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="rounded-2xl px-4 py-3 transition hover:bg-white/5 hover:text-white">
                {item.label}
              </Link>
            ))}
            <Link
              href="/store"
              className="mt-1 inline-flex w-full justify-center rounded-full border border-red-500/40 bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400 sm:hidden"
            >
              Shop Now
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
