import { describe, expect, test } from "vitest";
import { ORDER_STATUS_LABELS, POCKET_FLIPBOOK_SKU } from "./product";
import type { OrderStatus } from "./types";

describe("flipbook product model", () => {
  test("pocket flipbook sku locks first version constraints", () => {
    expect(POCKET_FLIPBOOK_SKU.durationSeconds.min).toBe(3);
    expect(POCKET_FLIPBOOK_SKU.durationSeconds.max).toBe(5);
    expect(POCKET_FLIPBOOK_SKU.frameCount.min).toBe(45);
    expect(POCKET_FLIPBOOK_SKU.frameCount.max).toBe(60);
  });

  test("all order statuses have user-facing labels", () => {
    const statuses: OrderStatus[] = [
      "submitted",
      "ai_processing",
      "awaiting_review",
      "contacted",
      "paid",
      "in_production",
      "shipped",
      "cancelled",
    ];

    for (const status of statuses) {
      expect(ORDER_STATUS_LABELS[status]).toBeTruthy();
    }
  });
});

