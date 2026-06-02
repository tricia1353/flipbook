export type OrderDraftInput = {
  projectId: string;
  customerName: string;
  wechatId: string;
  phone: string;
  shippingAddress: string;
  occasion?: string;
  userNote?: string;
};

export type OrderDraftValidationResult =
  | { ok: true; value: OrderDraftInput }
  | { ok: false; errors: Partial<Record<keyof OrderDraftInput, string>> };

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateOrderDraft(input: Partial<OrderDraftInput>): OrderDraftValidationResult {
  const value: OrderDraftInput = {
    projectId: clean(input.projectId),
    customerName: clean(input.customerName),
    wechatId: clean(input.wechatId),
    phone: clean(input.phone),
    shippingAddress: clean(input.shippingAddress),
    occasion: clean(input.occasion),
    userNote: clean(input.userNote),
  };

  const errors: Partial<Record<keyof OrderDraftInput, string>> = {};

  if (!value.projectId) errors.projectId = "缺少项目 ID。";
  if (!value.customerName) errors.customerName = "请填写称呼。";
  if (!value.wechatId) errors.wechatId = "请填写微信号。";
  if (!value.phone) errors.phone = "请填写手机号。";
  if (!value.shippingAddress) errors.shippingAddress = "请填写收货地址。";

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, value };
}

