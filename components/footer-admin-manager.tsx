"use client";

import { useMemo, useState } from "react";
import type { FooterBrandItem, FooterContent, FooterIconItem, FooterLinkItem } from "@/lib/home-content";
import { AdminSaveButton } from "@/components/admin-save-button";
import { useHomeContent } from "@/components/home-content-provider";

const iconOptions: FooterIconItem["icon"][] = ["tiktok", "facebook", "instagram", "youtube", "whatsapp", "email"];
const brandKinds: FooterBrandItem["kind"][] = ["sponsor", "partner"];

function uploadToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

export function FooterAdminManager() {
  const {
    content,
    updateFooterContent,
    addFooterLink,
    updateFooterLink,
    deleteFooterLink,
    addFooterSocial,
    updateFooterSocial,
    deleteFooterSocial,
    addFooterBrand,
    updateFooterBrand,
    updateFooterBrandBadgeImage,
    deleteFooterBrand
  } = useHomeContent();

  const footer = content.footerContent;
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(footer.links[0]?.id ?? null);
  const [selectedSocialId, setSelectedSocialId] = useState<string | null>(footer.socials[0]?.id ?? null);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(footer.footerBrands[0]?.id ?? null);

  const selectedLink = useMemo(
    () => footer.links.find((item) => item.id === selectedLinkId) ?? footer.links[0] ?? null,
    [footer.links, selectedLinkId]
  );
  const selectedSocial = useMemo(
    () => footer.socials.find((item) => item.id === selectedSocialId) ?? footer.socials[0] ?? null,
    [footer.socials, selectedSocialId]
  );
  const selectedBrand = useMemo(
    () => footer.footerBrands.find((item) => item.id === selectedBrandId) ?? footer.footerBrands[0] ?? null,
    [footer.footerBrands, selectedBrandId]
  );

  const handleBrandChange = (field: keyof FooterContent, value: string) => {
    updateFooterContent({ ...footer, [field]: value } as FooterContent);
  };

  const handleBadgeFile = async (file: File | null) => {
    if (!file) return;
    const dataUrl = await uploadToDataUrl(file);
    updateFooterContent({ ...footer, badgeImage: dataUrl } as FooterContent);
  };

  const handleBadgeRemove = () => {
    updateFooterContent({ ...footer, badgeImage: "" } as FooterContent);
  };

  const handleLinkChange = (field: keyof FooterLinkItem, value: string) => {
    if (!selectedLink) return;
    updateFooterLink({ ...selectedLink, [field]: value });
  };

  const handleSocialChange = (field: keyof FooterIconItem, value: string) => {
    if (!selectedSocial) return;
    updateFooterSocial({ ...selectedSocial, [field]: value as FooterIconItem["icon"] } as FooterIconItem);
  };

  const handleBrandItemChange = (field: keyof FooterBrandItem, value: string) => {
    if (!selectedBrand) return;
    if (field === "kind") {
      updateFooterBrand({ ...selectedBrand, kind: value as FooterBrandItem["kind"] });
      return;
    }
    updateFooterBrand({ ...selectedBrand, [field]: value });
  };

  const handleBrandFile = async (file: File | null) => {
    if (!file || !selectedBrand) return;
    const dataUrl = await uploadToDataUrl(file);
    updateFooterBrandBadgeImage(selectedBrand.id, dataUrl);
  };

  return (
    <main className="p-6 lg:p-10">
      <div className="max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(214,31,38,0.22),rgba(255,255,255,0.04))] p-8 shadow-glow">
          <p className="text-sm uppercase tracking-[0.35em] text-red-200">Footer Module</p>
          <h1 className="mt-3 text-4xl font-black">Manage the site footer</h1>
          <p className="mt-4 max-w-4xl text-zinc-300">
            Keep the footer short and wide by editing the brand, links, contact info, socials, and the icon-only sponsor or
            partner badges.
          </p>
        </div>

        <div className="mt-6">
          <AdminSaveButton />
        </div>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.35em] text-red-300">Brand</p>
          <h2 className="mt-3 text-2xl font-bold">Footer identity</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-[220px_1fr]">
            <label className="flex min-h-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
              {footer.badgeImage ? (
                <img src={footer.badgeImage} alt={footer.brandName} className="h-full w-full object-contain object-center" />
              ) : (
                <span>Upload team badge</span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(event) => handleBadgeFile(event.target.files?.[0] ?? null)} />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={footer.badgeLabel}
                onChange={(event) => handleBrandChange("badgeLabel", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                placeholder="Badge label"
              />
              <input
                value={footer.brandName}
                onChange={(event) => handleBrandChange("brandName", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                placeholder="Team name"
              />
              <textarea
                value={footer.description}
                onChange={(event) => handleBrandChange("description", event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none md:col-span-2"
                placeholder="Footer description"
              />
              <input
                value={footer.location}
                onChange={(event) => handleBrandChange("location", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                placeholder="Location"
              />
              <input
                value={footer.email}
                onChange={(event) => handleBrandChange("email", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                placeholder="Email"
              />
              <input
                value={footer.whatsapp}
                onChange={(event) => handleBrandChange("whatsapp", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                placeholder="WhatsApp"
              />
              <input
                value={footer.phone}
                onChange={(event) => handleBrandChange("phone", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
                placeholder="Phone"
              />
              <div className="flex flex-wrap gap-3 md:col-span-2">
                {footer.badgeImage ? (
                  <button
                    type="button"
                    onClick={handleBadgeRemove}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200"
                  >
                    Remove Image
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">Links</p>
                <h2 className="mt-2 text-2xl font-bold">Footer pages</h2>
              </div>
              <button type="button" onClick={() => setSelectedLinkId(addFooterLink())} className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
                Add Link
              </button>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {footer.links.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => setSelectedLinkId(link.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    selectedLinkId === link.id ? "bg-white text-black" : "border border-white/10 bg-white/5 text-zinc-300"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="mt-5">
              <AdminSaveButton label="Save Footer Links" />
            </div>
            {selectedLink ? (
              <div className="mt-6 space-y-3 rounded-[1.6rem] border border-white/10 bg-black/30 p-5">
                <input
                  value={selectedLink.label}
                  onChange={(event) => handleLinkChange("label", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                />
                <input
                  value={selectedLink.href}
                  onChange={(event) => handleLinkChange("href", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                />
                <button type="button" onClick={() => deleteFooterLink(selectedLink.id)} className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200">
                  Delete
                </button>
              </div>
            ) : null}
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">Socials</p>
                <h2 className="mt-2 text-2xl font-bold">Footer socials</h2>
              </div>
              <button type="button" onClick={() => setSelectedSocialId(addFooterSocial())} className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
                Add Social
              </button>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {footer.socials.map((social) => (
                <button
                  key={social.id}
                  type="button"
                  onClick={() => setSelectedSocialId(social.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    selectedSocialId === social.id ? "bg-white text-black" : "border border-white/10 bg-white/5 text-zinc-300"
                  }`}
                >
                  {social.label}
                </button>
              ))}
            </div>
            <div className="mt-5">
              <AdminSaveButton label="Save Footer Socials" />
            </div>
            {selectedSocial ? (
              <div className="mt-6 space-y-3 rounded-[1.6rem] border border-white/10 bg-black/30 p-5">
                <input
                  value={selectedSocial.label}
                  onChange={(event) => handleSocialChange("label", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                />
                <input
                  value={selectedSocial.href}
                  onChange={(event) => handleSocialChange("href", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                />
                <select
                  value={selectedSocial.icon}
                  onChange={(event) => handleSocialChange("icon", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                >
                  {iconOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => deleteFooterSocial(selectedSocial.id)} className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200">
                  Delete
                </button>
              </div>
            ) : null}
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-panel p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-red-300">Brand Badges</p>
                <h2 className="mt-2 text-2xl font-bold">Sponsors and partners</h2>
              </div>
              <button type="button" onClick={() => setSelectedBrandId(addFooterBrand())} className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
                Add Badge
              </button>
            </div>
            <div className="mt-5">
              <AdminSaveButton label="Save Sponsor Badges" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {footer.footerBrands.map((brand) => (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => setSelectedBrandId(brand.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    selectedBrandId === brand.id ? "bg-white text-black" : "border border-white/10 bg-white/5 text-zinc-300"
                  }`}
                >
                  {brand.label}
                </button>
              ))}
            </div>
            {selectedBrand ? (
              <div className="mt-6 space-y-3 rounded-[1.6rem] border border-white/10 bg-black/30 p-5">
                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center text-sm text-zinc-300">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/40">
                    {selectedBrand.badgeImage ? (
                      <img src={selectedBrand.badgeImage} alt={selectedBrand.label} className="h-full w-full object-contain object-center" />
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                        {selectedBrand.kind === "sponsor" ? "S" : "P"}
                      </span>
                    )}
                  </span>
                  <span>{selectedBrand.badgeImage ? "Replace brand badge" : "Upload brand badge"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => handleBrandFile(event.target.files?.[0] ?? null)} />
                </label>
                {selectedBrand.badgeImage ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <img
                      src={selectedBrand.badgeImage}
                      alt={selectedBrand.label}
                      className="h-14 w-14 rounded-full border border-white/10 object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">Current badge</p>
                      <p className="text-xs text-zinc-400">Displayed in the sponsors and partners section.</p>
                    </div>
                  </div>
                ) : null}
                <input
                  value={selectedBrand.label}
                  onChange={(event) => handleBrandItemChange("label", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                />
                <input
                  value={selectedBrand.href}
                  onChange={(event) => handleBrandItemChange("href", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                />
                <select
                  value={selectedBrand.kind}
                  onChange={(event) => handleBrandItemChange("kind", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                >
                  {brandKinds.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {selectedBrand.badgeImage ? (
                  <button
                    type="button"
                    onClick={() => updateFooterBrandBadgeImage(selectedBrand.id, "")}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200"
                  >
                    Remove Badge
                  </button>
                ) : null}
                <button type="button" onClick={() => deleteFooterBrand(selectedBrand.id)} className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200">
                  Delete
                </button>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
