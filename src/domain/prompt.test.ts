import { describe, expect, test } from "vitest";
import { buildPrompt, buildProviderPrompt } from "./prompt";
import { TEMPLATES } from "./templates";

describe("guided prompt builder", () => {
  test("builds guided prompt from template fields", () => {
    const template = TEMPLATES.find((item) => item.id === "pet-moon-run")!;
    const prompt = buildPrompt(template, {
      subject: "一只白色小狗",
      scene: "月球表面",
      mood: "开心、梦幻",
      blessing: "",
    });

    expect(prompt).toContain("一只白色小狗");
    expect(prompt).toContain("月球表面");
    expect(prompt).toContain("开心、梦幻");
  });

  test("omits empty customization fields", () => {
    const template = TEMPLATES.find((item) => item.id === "birthday-magic-room")!;
    const prompt = buildPrompt(template, {
      subject: "小朋友",
      blessing: "   ",
      mood: "温暖",
    });

    expect(prompt).toContain("小朋友");
    expect(prompt).toContain("温暖");
    expect(prompt).not.toContain("祝福语：");
  });

  test("keeps negative prompt available for API provider adapters", () => {
    const template = TEMPLATES.find((item) => item.id === "anime-keepsake-style")!;
    const payload = buildProviderPrompt(template, {
      subject: "情侣",
      mood: "明亮",
    });

    expect(payload.prompt).toContain("情侣");
    expect(payload.negativePrompt).toContain("identity drift");
  });
});

