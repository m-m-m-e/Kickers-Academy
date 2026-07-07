"use client";

import { useMemo, useState } from "react";
import type { ImageContentItem, StoreCategory, StoreOrder, StoreProduct } from "@/lib/home-content";
import { AdminSaveButton } from "@/components/admin-save-button";
import { useHomeContent } from "@/components/home-content-provider";

function uploadToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

const splitList = (value: string) =>
  value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

function makeWhatsAppLink(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

function makeMailLink(email: string, subject: string, body: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function formatOrderMessage(order: StoreOrder) {
  const items = order.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.productTitle} | Qty: ${item.quantity} | Size: ${item.size || "N/A"} | Color: ${item.color || "N/A"} | Name: ${item.name || "None"} | Number: ${item.number || "None"} | Unit: ${item.unitPrice} | Total: ${item.lineTotal}`
    )
    .join("\n");

  return `Hello ${order.buyerName},\n\nThank you for your Kickers Academy store request. We received the following items:\n\n${items}\n\nWe will confirm availability, final price, and collection/delivery details with you.\n\nRegards,\nKickers Academy`;
}

export function StoreAdminManager() {
  const {
    content,
    updateStoreHero,
    addStoreCategory,
    updateStoreCategory,
    deleteStoreCategory,
    addStoreProduct,
    updateStoreProduct,
    deleteStoreProduct,
    updateStoreOrder,
    updateStoreOrderStatus,
    deleteStoreOrder
  } = useHomeContent();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(content.storeCategories[0]?.id ?? null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(content.storeOrders[0]?.id ?? null);

  const selectedCategory = useMemo(
    () => content.storeCategories.find((category) => category.id === selectedCategoryId) ?? content.storeCategories[0] ?? null,
    [content.storeCategories, selectedCategoryId]
  );

  const selectedProduct = selectedCategory?.products[0] ?? null;
  const selectedOrder = content.storeOrders.find((order) => order.id === selectedOrderId) ?? content.storeOrders[0] ?? null;

  const handleHeroChange = (field: keyof ImageContentItem, value: string) => {
    updateStoreHero({ ...content.storeHero, [field]: value });
  };

  const handleHeroFile = async (file: File | null) => {
    if (!file) return;
    const dataUrl = await uploadToDataUrl(file);
    updateStoreHero({ ...content.storeHero, image: dataUrl });
  };

  const handleHeroRemove = () => {
    updateStoreHero({ ...content.storeHero, image: "" });
  };

  const handleCategoryChange = (field: keyof StoreCategory, value: string) => {
    if (!selectedCategory) return;
    updateStoreCategory({ ...selectedCategory, [field]: value } as StoreCategory);
  };

  const handleCategoryFile = async (file: File | null) => {
    if (!file || !selectedCategory) return;
    const dataUrl = await uploadToDataUrl(file);
    updateStoreCategory({ ...selectedCategory, image: dataUrl });
  };

  const handleCategoryRemove = () => {
    if (!selectedCategory) return;
    updateStoreCategory({ ...selectedCategory, image: "" });
  };

  const handleAddCategory = () => {
    const id = addStoreCategory();
    setSelectedCategoryId(id);
  };

  const handleProductChange = (product: StoreProduct, field: keyof StoreProduct, value: string | boolean) => {
    if (!selectedCategory) return;
    updateStoreProduct(selectedCategory.id, { ...product, [field]: value } as StoreProduct);
  };

  const handleProductOptions = (product: StoreProduct, field: "colorOptions" | "sizeOptions", value: string) => {
    if (!selectedCategory) return;
    updateStoreProduct(selectedCategory.id, { ...product, [field]: splitList(value) } as StoreProduct);
  };

  const handleProductFile = async (file: File | null, target: StoreProduct | null) => {
    if (!file || !selectedCategory || !target) return;
    const dataUrl = await uploadToDataUrl(file);
    updateStoreProduct(selectedCategory.id, { ...target, image: dataUrl });
  };

  const handleProductRemove = (target: StoreProduct | null) => {
    if (!selectedCategory || !target) return;
    updateStoreProduct(selectedCategory.id, { ...target, image: "" });
  };

  const handleAddProduct = () => {
    if (!selectedCategory) return;
    addStoreProduct(selectedCategory.id);
  };

  return (
    <main className="p-6 lg:p-10">
      <div className="max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(214,31,38,0.22),rgba(255,255,255,0.04))] p-8 shadow-glow">
          <p className="text-sm uppercase tracking-[0.35em] text-red-200">Store Module</p>
          <h1 className="mt-3 text-4xl font-black">Manage collections and merchandise</h1>
          <p className="mt-4 max-w-4xl text-zinc-300">
            Organize jerseys, full kits, track pants, and hoodies while controlling product images and order options.
          </p>
        </div>

        <div className="mt-6">
          <AdminSaveButton />
        </div>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Store Orders</p>
              <h2 className="mt-2 text-2xl font-bold">Acquisition and merchandise requests</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
                These are request-based store orders. Contact the buyer, confirm availability, then update the request status.
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200">
              {content.storeOrders.filter((order) => order.status === "new").length} new
            </span>
          </div>

          <div className="mt-5">
            <AdminSaveButton label="Save Store Orders" />
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.25em] text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Buyer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {content.storeOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`cursor-pointer transition hover:bg-white/5 ${selectedOrder?.id === order.id ? "bg-red-500/10" : "bg-black/20"}`}
                  >
                    <td className="px-4 py-4 font-semibold text-white">{order.buyerName}</td>
                    <td className="px-4 py-4 text-zinc-300">{order.items.length}</td>
                    <td className="px-4 py-4 text-zinc-300">{new Date(order.submittedAt).toLocaleString()}</td>
                    <td className="px-4 py-4 capitalize text-zinc-300">{order.status}</td>
                  </tr>
                ))}
                {!content.storeOrders.length ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                      No store requests yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {selectedOrder ? (
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-red-300">{selectedOrder.status}</p>
                  <h3 className="mt-2 text-2xl font-black text-white">{selectedOrder.buyerName}</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    {selectedOrder.buyerEmail} / {selectedOrder.buyerPhone}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">{selectedOrder.deliveryPreference}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={makeMailLink(selectedOrder.buyerEmail, "Kickers Academy store request", formatOrderMessage(selectedOrder))}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
                  >
                    Email Buyer
                  </a>
                  <a
                    href={makeWhatsAppLink(selectedOrder.buyerPhone, formatOrderMessage(selectedOrder))}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
                  >
                    WhatsApp Buyer
                  </a>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{item.productTitle}</p>
                        <p className="mt-1 text-sm text-zinc-400">
                          Qty {item.quantity} / {item.color || "No color"} / {item.size || "No size"}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          Name: {item.name || "None"} / Number: {item.number || "None"} / Custom: {item.customMade ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="text-right text-sm text-zinc-300">
                        <p>Base: {item.basePrice}</p>
                        <p>Unit: {item.unitPrice}</p>
                        <p>Total: {item.lineTotal}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedOrder.notes ? (
                <p className="mt-5 whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-zinc-200">
                  {selectedOrder.notes}
                </p>
              ) : null}

              <label className="mt-5 block space-y-2">
                <span className="text-sm text-zinc-400">Admin note</span>
                <textarea
                  value={selectedOrder.adminNote ?? ""}
                  onChange={(event) => updateStoreOrder({ ...selectedOrder, adminNote: event.target.value })}
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                />
              </label>

              <div className="mt-5 flex flex-wrap gap-2">
                {(["new", "contacted", "confirmed", "processing", "ready", "completed", "cancelled"] as StoreOrder["status"][]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateStoreOrderStatus(selectedOrder.id, status, selectedOrder.adminNote)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${selectedOrder.status === status ? "bg-red-500 text-white" : "border border-white/10 bg-white/5 text-zinc-200"}`}
                  >
                    {status}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => deleteStoreOrder(selectedOrder.id)}
                  className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Store Hero</p>
              <h2 className="mt-2 text-2xl font-bold">Edit the store hero</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-[220px_1fr]">
            <label className="flex min-h-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
              {content.storeHero.image ? (
                <img src={content.storeHero.image} alt={content.storeHero.title} className="h-full w-full object-contain object-center" />
              ) : (
                <span>Upload hero image</span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(event) => handleHeroFile(event.target.files?.[0] ?? null)} />
            </label>
            <div className="space-y-3">
              <input
                value={content.storeHero.title}
                onChange={(event) => handleHeroChange("title", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none"
              />
              <textarea
                value={content.storeHero.description}
                onChange={(event) => handleHeroChange("description", event.target.value)}
                rows={8}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none"
              />
              <input
                value={content.storeHero.image}
                onChange={(event) => handleHeroChange("image", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none"
              />
              <div className="flex flex-wrap gap-3">
                {content.storeHero.image ? (
                  <button
                    type="button"
                    onClick={handleHeroRemove}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200"
                  >
                    Remove Image
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={handleAddCategory} className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
            Add Category
          </button>
          {content.storeCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategoryId(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategoryId === category.id
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>

        {selectedCategory ? (
          <div className="mt-8 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <section className="rounded-[2rem] border border-white/10 bg-panel p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-red-300">Category</p>
                  <h2 className="mt-2 text-2xl font-bold">{selectedCategory.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => deleteStoreCategory(selectedCategory.id)}
                  className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
                >
                  Delete Category
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <input
                  value={selectedCategory.title}
                  onChange={(event) => handleCategoryChange("title", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none"
                />
                <textarea
                  value={selectedCategory.description}
                  onChange={(event) => handleCategoryChange("description", event.target.value)}
                  rows={6}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg leading-8 text-white outline-none"
                />
                <input
                  value={selectedCategory.slug}
                  onChange={(event) => handleCategoryChange("slug", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none"
                />
                <input
                  value={selectedCategory.image}
                  onChange={(event) => handleCategoryChange("image", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none"
                />
                <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center text-sm text-zinc-400">
                  Upload category image
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => handleCategoryFile(event.target.files?.[0] ?? null)} />
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleCategoryRemove}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-panelAlt p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-red-300">Products</p>
                  <h2 className="mt-2 text-2xl font-bold">Edit merchandise items</h2>
                </div>
                <button type="button" onClick={handleAddProduct} className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
                  Add Product
                </button>
              </div>

              <div className="mt-5">
                <AdminSaveButton label="Save Products" />
              </div>

              <div className="mt-6 space-y-4">
                {selectedCategory.products.map((product) => (
                  <article key={product.id} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <div className="grid gap-4 lg:grid-cols-[160px_1fr]">
                      <label className="flex min-h-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm text-zinc-400">
                        {product.image ? (
                          <img src={product.image} alt={product.title} className="h-full w-full object-contain object-center" />
                        ) : (
                          <span>Upload product image</span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => handleProductFile(event.target.files?.[0] ?? null, product)}
                        />
                      </label>
                      {product.image ? (
                        <button
                          type="button"
                          onClick={() => handleProductRemove(product)}
                          className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200"
                        >
                          Remove Image
                        </button>
                      ) : null}
                      <div className="space-y-3">
                        <input
                          value={product.title}
                          onChange={(event) => handleProductChange(product, "title", event.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                        />
                        <textarea
                          value={product.description}
                          onChange={(event) => handleProductChange(product, "description", event.target.value)}
                          rows={4}
                          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            value={product.price}
                            onChange={(event) => handleProductChange(product, "price", event.target.value)}
                            placeholder="Normal price"
                            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                          />
                          <input
                            value={product.nameOnlyPrice}
                            onChange={(event) => handleProductChange(product, "nameOnlyPrice", event.target.value)}
                            placeholder="Name only price"
                            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                          />
                          <input
                            value={product.numberOnlyPrice}
                            onChange={(event) => handleProductChange(product, "numberOnlyPrice", event.target.value)}
                            placeholder="Number only price"
                            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                          />
                          <input
                            value={product.nameAndNumberPrice}
                            onChange={(event) => handleProductChange(product, "nameAndNumberPrice", event.target.value)}
                            placeholder="Name and number price"
                            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                          />
                        </div>
                        <input
                          value={product.image}
                          onChange={(event) => handleProductChange(product, "image", event.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                        />
                        <input
                          value={product.colorOptions.join(", ")}
                          onChange={(event) => handleProductOptions(product, "colorOptions", event.target.value)}
                          placeholder="Colors separated by commas"
                          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                        />
                        <input
                          value={product.sizeOptions.join(", ")}
                          onChange={(event) => handleProductOptions(product, "sizeOptions", event.target.value)}
                          placeholder="Sizes separated by commas"
                          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                        />
                        <div className="flex flex-wrap gap-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={product.supportsNumber}
                              onChange={(event) => handleProductChange(product, "supportsNumber", event.target.checked)}
                            />
                            Number
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={product.supportsName}
                              onChange={(event) => handleProductChange(product, "supportsName", event.target.checked)}
                            />
                            Name
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={product.supportsCustomMade}
                              onChange={(event) => handleProductChange(product, "supportsCustomMade", event.target.checked)}
                            />
                            Custom Made
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={product.featured}
                              onChange={(event) => handleProductChange(product, "featured", event.target.checked)}
                            />
                            Featured
                          </label>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <AdminSaveButton label="Save Product" />
                          <button
                            type="button"
                            onClick={() => deleteStoreProduct(selectedCategory.id, product.id)}
                            className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200"
                          >
                            Delete
                          </button>
                          {product.image ? (
                            <button
                              type="button"
                              onClick={() => handleProductRemove(product)}
                              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200"
                            >
                              Remove Image
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
