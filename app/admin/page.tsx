"use client";

import { useMemo } from "react";
import { useHomeContent } from "@/components/home-content-provider";
import { getAdminNotifications } from "@/lib/admin-notifications";

export default function AdminPage() {
  const { content } = useHomeContent();
  const notifications = useMemo(() => getAdminNotifications(content), [content]);

  const moduleSummary = useMemo(
    () => [
      {
        name: "Home",
        count: content.heroSlides.length + content.actionCards.length,
        note: "Hero slides and action cards"
      },
      {
        name: "About",
        count: content.aboutItems.length + content.aboutSections.length,
        note: "About hero and sections"
      },
      {
        name: "Join",
        count: content.joinPage.requirements.length + content.joinPage.requiredInformation.length,
        note: "Registration content"
      },
      {
        name: "Contact",
        count:
          content.contactPage.contacts.length +
          content.contactPage.socials.length +
          content.contactSubmissions.length +
          content.feedbackSubmissions.length +
          (content.contactPage.mapImage ? 1 : 0),
        note: "Contact, map assets, messages, and reviews"
      },
      {
        name: "Engage",
        count:
          content.donatePage.engagePathways.length +
          content.donatePage.supportWays.length +
          content.donatePage.impactPoints.length +
          content.donatePage.gratitudeCards.length +
          content.engageSubmissions.length +
          content.engageConnectionRequests.length +
          content.supportSubmissions.length,
        note: "Engagement, support, and submissions"
      },
      {
        name: "Programs",
        count: content.programGroups.length + content.programGroups.reduce((total, group) => total + group.subSections.length, 0),
        note: "Age groups and sub-sections"
      },
      {
        name: "Store",
        count: content.storeCategories.length + content.storeCategories.reduce((total, category) => total + category.products.length, 0) + content.storeOrders.length,
        note: "Collections, products, and order requests"
      },
      {
        name: "News & Events",
        count: content.newsItems.length,
        note: "Posts and fixtures"
      },
      {
        name: "Gallery",
        count: content.galleryCategories.length + content.galleryCategories.reduce((total, category) => total + category.items.length, 0),
        note: "Media categories and items"
      },
      {
        name: "Footer",
        count: content.footerContent.links.length + content.footerContent.socials.length + content.footerContent.footerBrands.length,
        note: "Links, socials, and badges"
      }
    ],
    [content]
  );

  const activeModules = moduleSummary.filter((module) => module.count > 0).length;
  const totalContentItems = moduleSummary.reduce((sum, module) => sum + module.count, 0);
  const topModules = [...moduleSummary]
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
    .map((module) => ({
      ...module,
      share: totalContentItems > 0 ? Math.round((module.count / totalContentItems) * 100) : 0
    }));
  const imageSlots = [
    ...content.heroSlides.map((item) => item.image),
    ...content.aboutItems.map((item) => item.image),
    ...content.aboutSections.map((item) => item.image),
    content.programsHero.image,
    content.storeHero.image,
    content.joinPage.hero.image,
    content.contactPage.hero.image,
    content.contactPage.mapImage,
    content.donatePage.hero.image,
    ...content.donatePage.gratitudeCards.map((item) => item.image),
    content.footerContent.badgeImage,
    ...content.footerContent.footerBrands.map((item) => item.badgeImage),
    content.newsEventsHero.image,
    content.galleryHero.image,
    ...content.galleryCategories.map((category) => category.image),
    ...content.galleryCategories.flatMap((category) => category.items.map((item) => item.thumbnail || item.src)),
    ...content.storeCategories.map((category) => category.image),
    ...content.storeCategories.flatMap((category) => category.products.map((item) => item.image)),
    ...content.programGroups.map((group) => group.image)
  ];
  const uploadedImages = imageSlots.filter((item) => item.trim()).length;
  const imageCoverageLabel = imageSlots.length > 0 ? `${uploadedImages}/${imageSlots.length}` : "0/0";

  return (
    <main className="p-6 lg:p-10">
      <div className="max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(214,31,38,0.22),rgba(255,255,255,0.04))] p-8 shadow-glow">
          <p className="text-sm uppercase tracking-[0.35em] text-red-200">Dashboard Overview</p>
          <h2 className="mt-3 text-4xl font-black">Control the Kickers Academy website, content, store, and analytics.</h2>
          <p className="mt-4 max-w-3xl text-zinc-300">
            This dashboard is summary-only. It shows the current content structure without loading the heavier live analytics
            panel.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Live Items", value: String(totalContentItems) },
            { label: "Active Modules", value: String(activeModules) },
            { label: "Images Uploaded", value: imageCoverageLabel },
            { label: "New Notifications", value: String(notifications.length) }
          ].map((metric) => (
            <div key={metric.label} className="rounded-3xl border border-white/10 bg-panel p-6">
              <p className="text-sm text-zinc-400">{metric.label}</p>
              <p className="mt-3 text-3xl font-bold text-white">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-white/10 bg-panel p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Module Summary</p>
            <h3 className="mt-2 text-2xl font-bold">Coverage across the site</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {moduleSummary.map((module) => (
                <article key={module.name} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-lg font-semibold">{module.name}</h4>
                    <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-200">
                      {String(module.count).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{module.note}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className="rounded-[2rem] border border-white/10 bg-panelAlt p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Content Distribution</p>
            <h3 className="mt-2 text-2xl font-bold">Most populated modules</h3>
            <div className="mt-6 space-y-4">
              {topModules.map((row) => (
                <div key={row.name} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{row.name}</span>
                    <span className="text-red-300">{row.share}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-red-500" style={{ width: `${row.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
