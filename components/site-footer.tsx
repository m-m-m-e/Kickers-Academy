"use client";

import Link from "next/link";
import { useHomeContent } from "@/components/home-content-provider";

function FooterIcon({ icon }: { icon: string }) {
  const base = "h-4 w-4";

  switch (icon) {
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={base} fill="currentColor" aria-hidden="true">
          <path d="M16.5 3c.4 2.8 2.1 4.5 4.5 4.7V11c-1.7.1-3.4-.4-4.8-1.3v5.6c0 3.4-2.7 6.2-6.1 6.2-3.4 0-6.1-2.8-6.1-6.2 0-3.4 2.7-6.2 6.1-6.2.4 0 .8 0 1.2.1v3.7c-.4-.1-.8-.2-1.2-.2-1.3 0-2.4 1.1-2.4 2.5s1.1 2.5 2.4 2.5c1.4 0 2.6-1.2 2.6-2.8V3h3.8z" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={base} fill="currentColor" aria-hidden="true">
          <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.6 1.7-1.6h1.5V4.6c-.3 0-1.4-.1-2.7-.1-2.6 0-4.4 1.6-4.4 4.6v1.8H7v3.1h2.6v8h3.9z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={base} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={base} fill="currentColor" aria-hidden="true">
          <path d="M21.8 8.2c0-1.6-1.2-2.8-2.8-2.8H5c-1.6 0-2.8 1.2-2.8 2.8v7.6c0 1.6 1.2 2.8 2.8 2.8h14c1.6 0 2.8-1.2 2.8-2.8V8.2zM10 15.1V8.9l5.5 3.1L10 15.1z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className={base} fill="currentColor" aria-hidden="true">
          <path d="M12 2a9.99 9.99 0 0 0-8.5 15.2L2 22l4.97-1.46A10 10 0 1 0 12 2zm0 18a7.9 7.9 0 0 1-4-.95l-.29-.17-2.95.87.88-2.87-.19-.3A8 8 0 1 1 12 20zm4.5-5.4c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.21-1.43-1.35-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.42-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.87 2.32.99 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.04.4 1.39.51.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 24 24" className={base} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M4 7l8 6 8-6" />
        </svg>
      );
    default:
      return null;
  }
}

function BrandMark({ kind, badgeImage, label }: { kind: "sponsor" | "partner"; badgeImage?: string; label: string }) {
  if (badgeImage) {
    return (
      <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
        <img src={badgeImage} alt={label} className="h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[10px] font-black text-white">
      {kind === "sponsor" ? "S" : "P"}
    </span>
  );
}

export function SiteFooter() {
  const { content } = useHomeContent();
  const footer = content.footerContent;

  return (
    <footer className="w-full border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-5">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr] lg:items-start">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/15 text-sm font-black text-white">
                {footer.badgeImage ? (
                  <img src={footer.badgeImage} alt={footer.brandName} className="h-full w-full object-cover" />
                ) : (
                  <span>KA</span>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{footer.brandName}</h2>
              </div>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400">{footer.description}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-red-300">Pages</p>
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-zinc-300 sm:grid-cols-3">
              {footer.links.map((link) => (
                <Link key={link.id} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-red-300">Contact</p>
            <div className="mt-3 space-y-2 text-sm text-zinc-300">
              <p>{footer.location}</p>
              <a className="block transition hover:text-white" href={`mailto:${footer.email}`}>
                {footer.email}
              </a>
              <a className="block transition hover:text-white" href={`https://wa.me/${footer.whatsapp.replace(/\D/g, "")}`}>
                WhatsApp: {footer.whatsapp}
              </a>
              <a className="block transition hover:text-white" href={`tel:${footer.phone.replace(/\s+/g, "")}`}>
                Phone: {footer.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-white/10 pt-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-red-300">Social Media</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {footer.socials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 transition hover:border-red-400/40 hover:text-white"
                  aria-label={social.label}
                  title={social.label}
                >
                  <FooterIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:text-right">
            <p className="text-[10px] uppercase tracking-[0.35em] text-red-300">Sponsors & Partners</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 lg:justify-end">
              {footer.footerBrands.map((brand) => (
                <a
                  key={brand.id}
                  href={brand.href || "#"}
                  target={brand.href && brand.href !== "#" ? "_blank" : undefined}
                  rel={brand.href && brand.href !== "#" ? "noreferrer" : undefined}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-zinc-200 transition hover:border-red-400/40 hover:text-white"
                  aria-label={`${brand.kind}: ${brand.label}`}
                  title={`${brand.kind}: ${brand.label}`}
                >
                  <BrandMark kind={brand.kind} badgeImage={brand.badgeImage} label={brand.label} />
                  <span className="max-w-[9rem] truncate text-xs font-medium">{brand.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
