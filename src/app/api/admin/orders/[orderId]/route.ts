import { NextResponse } from "next/server";
import { getOrder, updateOrderStatus } from "@/server/mockStore";
import type { OrderStatus } from "@/domain/types";

const VALID_STATUSES: OrderStatus[] = [
  "submitted",
  "ai_processing",
  "awaiting_review",
  "contacted",
  "paid",
  "in_production",
  "shipped",
  "cancelled",
];

type OrderRouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function GET(_request: Request, context: OrderRouteContext) {
  const { orderId } = await context.params;
  const order = getOrder(orderId);

  if (!order) {
    return NextResponse.json({ error: "订单不存在。" }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(request: Request, context: OrderRouteContext) {
  const { orderId } = await context.params;
  const body = (await request.json()) as { status?: string };

  if (!VALID_STATUSES.includes(body.status as OrderStatus)) {
    return NextResponse.json({ error: "订单状态无效。" }, { status: 400 });
  }

  const order = updateOrderStatus(orderId, body.status as OrderStatus);
  if (!order) {
    return NextResponse.json({ error: "订单不存在。" }, { status: 404 });
  }

  return NextResponse.json({ order });
}

