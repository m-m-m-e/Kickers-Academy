import { NextResponse } from "next/server";
import { loadContentStore, saveContentStore } from "@/lib/content-store";
import type { StoreOrder, StoreOrderItem } from "@/lib/home-content";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanItems(value: unknown): StoreOrderItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => ({
      id: clean(item?.id) || `order-item-${Date.now()}`,
      productId: clean(item?.productId),
      productTitle: clean(item?.productTitle),
      productImage: clean(item?.productImage),
      basePrice: clean(item?.basePrice),
      customizationPrice: clean(item?.customizationPrice),
      unitPrice: clean(item?.unitPrice),
      lineTotal: clean(item?.lineTotal),
      color: clean(item?.color),
      size: clean(item?.size),
      quantity: Math.max(1, Number(item?.quantity) || 1),
      name: clean(item?.name),
      number: clean(item?.number),
      customMade: Boolean(item?.customMade)
    }))
    .filter((item) => item.productId && item.productTitle);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const buyerName = clean(body.buyerName);
    const buyerEmail = clean(body.buyerEmail);
    const buyerPhone = clean(body.buyerPhone);
    const items = cleanItems(body.items);

    if (!buyerName || !buyerEmail || !buyerPhone || items.length === 0) {
      return NextResponse.json(
        { error: "Please provide your name, email, phone number, and at least one store item." },
        { status: 400 }
      );
    }

    const content = await loadContentStore();
    const order: StoreOrder = {
      id: `store-order-${Date.now()}`,
      buyerName,
      buyerEmail,
      buyerPhone,
      deliveryPreference: clean(body.deliveryPreference) || "To be discussed",
      notes: clean(body.notes),
      items,
      status: "new",
      submittedAt: new Date().toISOString(),
      adminNote: ""
    };

    const saved = await saveContentStore({
      ...content,
      storeOrders: [order, ...content.storeOrders]
    });

    return NextResponse.json({ order, total: saved.storeOrders.length }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to submit your store request right now." }, { status: 500 });
  }
}
