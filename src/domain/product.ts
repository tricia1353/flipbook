export const POCKET_FLIPBOOK_SKU = {
  id: "pocket-gift-v1",
  name: "口袋礼物版翻页书",
  durationSeconds: { min: 3, max: 5 },
  frameCount: { min: 45, max: 60 },
  fulfillment: "manual_wechat",
} as const;

export const ORDER_STATUS_LABELS = {
  submitted: "已提交",
  ai_processing: "AI 处理中",
  awaiting_review: "待人工审核",
  contacted: "已联系",
  paid: "已收款",
  in_production: "制作中",
  shipped: "已发货",
  cancelled: "已取消",
} as const;

