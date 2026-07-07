"use client";

import { useState } from "react";
import type { ImageContentItem } from "@/lib/home-content";

/**
 * CardGrid - Display list items in a 3-column grid
 * Used for: Core Values (6 items in 3x2 grid)
 */
export function CardGrid({ items, icons }: { items: string[]; icons?: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={item}
          className="rounded-lg border border-white/20 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 backdrop-blur-sm hover:border-white/40 hover:bg-white/10 transition-all duration-300"
        >
          {icons?.[index] && <div className="mb-3 text-4xl">{icons[index]}</div>}
          <p className="text-lg font-semibold text-white">{item}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * CardRow - Display 4 items in a horizontal row
 * Used for: Why Choose Us (4 items)
 */
export function CardRow({ items, icons }: { items: string[]; icons?: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={item}
          className="flex flex-col items-start rounded-lg border border-white/20 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/10"
        >
          {icons?.[index] && <div className="mb-4 text-3xl">{icons[index]}</div>}
          <p className="text-base leading-7 text-zinc-100">{item}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * IconListDisplay - Display items with icons (one per line)
 * Used for: Coaching Philosophy (bullet points with icons)
 */
export function IconListDisplay({ items, icons }: { items: string[]; icons?: string[] }) {
  return (
    <ul className="mx-auto max-w-3xl space-y-4">
      {items.map((item, index) => (
        <li key={item} className="flex items-start gap-4">
          <span className="mt-1 flex-shrink-0 text-2xl">{icons?.[index] || "•"}</span>
          <span className="text-lg leading-8 text-zinc-100">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * AccordionSection - Expandable/collapsible text content
 * Used for: Long paragraphs (About Us, Mission, Vision, etc.)
 */
export function AccordionSection({ title, summary, content }: { title: string; summary?: string; content: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-white/20 bg-black/40 backdrop-blur-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
      >
        <div>
          <p className="text-lg font-semibold text-white">{title}</p>
          {summary && !isOpen && <p className="mt-2 text-sm text-zinc-400">{summary}</p>}
        </div>
        <div className="flex-shrink-0">
          <svg
            className={`h-5 w-5 text-red-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="border-t border-white/10 px-6 py-5">
          <p className="text-base leading-8 text-zinc-200">{content}</p>
        </div>
      )}
    </div>
  );
}

/**
 * CalloutBlock - Highlighted key statement with visual emphasis
 * Used for: Pull quotes or important statements
 */
export function CalloutBlock({ text, icon }: { text: string; icon?: string }) {
  return (
    <div className="rounded-lg border-l-4 border-white/30 bg-white/5 px-6 py-8 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        {icon && <div className="text-4xl flex-shrink-0">{icon}</div>}
        <p className="text-xl font-semibold leading-8 text-white">{text}</p>
      </div>
    </div>
  );
}
