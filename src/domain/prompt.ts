import type { CreativeTemplate } from "./templates";
import type { PromptFieldKey } from "./types";

export type PromptInputs = Partial<Record<PromptFieldKey, string>>;

const FIELD_LABELS: Record<PromptFieldKey, string> = {
  subject: "主角",
  scene: "场景",
  mood: "氛围",
  style: "风格",
  blessing: "祝福语",
};

export type ProviderPromptPayload = {
  prompt: string;
  negativePrompt: string;
};

export function buildPrompt(template: CreativeTemplate, inputs: PromptInputs) {
  const userLines = template.requiredInputs
    .map((key) => {
      const value = inputs[key]?.trim();
      return value ? `${FIELD_LABELS[key]}：${value}` : null;
    })
    .filter((line) => line !== null);

  return [
    template.defaultPrompt,
    "User customization:",
    ...userLines,
    "Output requirement: 3-5 seconds, stable subject identity, simple readable motion, suitable for extracting 45-60 printable flipbook frames.",
  ].join("\n");
}

export function buildProviderPrompt(
  template: CreativeTemplate,
  inputs: PromptInputs,
): ProviderPromptPayload {
  return {
    prompt: buildPrompt(template, inputs),
    negativePrompt: template.negativePrompt,
  };
}

