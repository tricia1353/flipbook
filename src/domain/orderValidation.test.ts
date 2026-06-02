import { expect, test } from "vitest";
import { validateOrderDraft } from "./orderValidation";

test("requires wechat and phone before order submission", () => {
  const result = validateOrderDraft({
    projectId: "project_1",
    customerName: "小王",
    wechatId: "",
    phone: "",
    shippingAddress: "上海市",
    occasion: "生日礼物",
    userNote: "",
  });

  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.errors.wechatId).toBeDefined();
    expect(result.errors.phone).toBeDefined();
  }
});

