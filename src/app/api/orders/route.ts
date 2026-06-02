import { NextResponse } from "next/server";
import { validateOrderDraft } from "@/domain/orderValidation";
import { createOrder, getProject } from "@/server/mockStore";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const validation = validateOrderDraft(body);

  if (!validation.ok) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  const project = getProject(validation.value.projectId);
  if (!project) {
    return NextResponse.json({ error: "项目不存在，请先完成预览。" }, { status: 404 });
  }

  const order = createOrder(validation.value);

  return NextResponse.json({
    orderId: order.id,
    status: order.status,
    adminUrl: `/admin/orders/${order.id}`,
  });
}

