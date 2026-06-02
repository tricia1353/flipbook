import { NextResponse } from "next/server";
import { getOrders } from "@/server/mockStore";

export async function GET() {
  return NextResponse.json({ orders: getOrders() });
}

