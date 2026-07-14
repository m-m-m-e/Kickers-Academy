// app/api/orders/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin-session";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const session = requireAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Math.max(0, Number(searchParams.get("page") ?? 0));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? PAGE_SIZE)));

  const [items, total] = await Promise.all([
    prisma.storeOrder.findMany({
      include: { items: true },
      orderBy: { submittedAt: "desc" },
      skip: page * pageSize,
      take: pageSize
    }),
    prisma.storeOrder.count()
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];

    const created = await prisma.storeOrder.create({
      data: {
        buyerName: body.buyerName ?? "",
        buyerEmail: body.buyerEmail ?? "",
        buyerPhone: body.buyerPhone ?? "",
        deliveryPreference: body.deliveryPreference ?? "",
        notes: body.notes ?? "",
        items: {
          create: items.map((item: Record<string, unknown>) => ({
            productId: item.productId ?? "",
            productTitle: item.productTitle ?? "",
            productImage: item.productImage ?? "",
            basePrice: item.basePrice ?? "",
            customizationPrice: item.customizationPrice ?? "",
            unitPrice: item.unitPrice ?? "",
            lineTotal: item.lineTotal ?? "",
            color: item.color ?? "",
            size: item.size ?? "",
            quantity: Number(item.quantity) || 1,
            name: item.name ?? "",
            number: item.number ?? "",
            customMade: Boolean(item.customMade)
          }))
        }
      },
      include: { items: true }
    });

    return NextResponse.json({ ok: true, order: created });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}