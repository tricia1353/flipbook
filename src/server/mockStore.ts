import { buildMockFrames, type FlipbookFrame } from "@/domain/frames";
import { buildProviderPrompt, type PromptInputs } from "@/domain/prompt";
import { getTemplateById } from "@/domain/templates";
import type { AssetType, CreationMode, OrderStatus, PromptFieldKey } from "@/domain/types";

export type AssetRef = {
  id: string;
  assetType: AssetType;
  fileName: string;
  contentType: string;
  size: number;
};

export type ProjectRecord = {
  id: string;
  mode: CreationMode;
  templateId: string;
  templateName: string;
  promptInputs: PromptInputs;
  generatedPrompt: string;
  negativePrompt: string;
  assetRefs: AssetRef[];
  aiJob: {
    id: string;
    provider: "mock";
    status: "completed";
    message: string;
  };
  frames: FlipbookFrame[];
  createdAt: string;
};

export type OrderRecord = {
  id: string;
  projectId: string;
  status: OrderStatus;
  customerName: string;
  wechatId: string;
  phone: string;
  shippingAddress: string;
  occasion: string;
  userNote: string;
  internalNote: string;
  createdAt: string;
  updatedAt: string;
};

type Store = {
  projects: ProjectRecord[];
  orders: OrderRecord[];
};

type GlobalWithStore = typeof globalThis & {
  __flipbookStudioStore?: Store;
};

const globalForStore = globalThis as GlobalWithStore;

function getStore(): Store {
  if (!globalForStore.__flipbookStudioStore) {
    globalForStore.__flipbookStudioStore = {
      projects: [],
      orders: [],
    };
  }
  return globalForStore.__flipbookStudioStore;
}

function createId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function cleanPromptInputs(input: unknown): PromptInputs {
  if (!input || typeof input !== "object") return {};

  const keys: PromptFieldKey[] = ["subject", "scene", "mood", "style", "blessing"];
  return keys.reduce<PromptInputs>((acc, key) => {
    const value = (input as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) {
      acc[key] = value.trim();
    }
    return acc;
  }, {});
}

function cleanAssetRefs(input: unknown): AssetRef[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter((asset) => asset && typeof asset === "object")
    .map((asset) => {
      const item = asset as Record<string, unknown>;
      return {
        id: createId("asset"),
        assetType: (typeof item.assetType === "string" ? item.assetType : "reference_image") as AssetType,
        fileName: typeof item.fileName === "string" ? item.fileName : "mock-upload",
        contentType: typeof item.contentType === "string" ? item.contentType : "application/octet-stream",
        size: typeof item.size === "number" ? item.size : 0,
      };
    });
}

export function createProject(input: {
  mode: CreationMode;
  templateId: string;
  promptInputs: unknown;
  assetRefs: unknown;
}) {
  const template = getTemplateById(input.templateId);
  if (!template || template.mode !== input.mode) {
    throw new Error("模板不存在或与创作模式不匹配。");
  }

  const promptInputs = cleanPromptInputs(input.promptInputs);
  const providerPrompt = buildProviderPrompt(template, promptInputs);
  const projectId = createId("project");

  const project: ProjectRecord = {
    id: projectId,
    mode: input.mode,
    templateId: template.id,
    templateName: template.name,
    promptInputs,
    generatedPrompt: providerPrompt.prompt,
    negativePrompt: providerPrompt.negativePrompt,
    assetRefs: cleanAssetRefs(input.assetRefs),
    aiJob: {
      id: createId("job"),
      provider: "mock",
      status: "completed",
      message: "Mock AI 已生成 3-5 秒短片，并完成 50 帧预览。",
    },
    frames: buildMockFrames(projectId),
    createdAt: new Date().toISOString(),
  };

  getStore().projects.unshift(project);
  return project;
}

export function getProject(projectId: string) {
  return getStore().projects.find((project) => project.id === projectId);
}

export function createOrder(input: {
  projectId: string;
  customerName: string;
  wechatId: string;
  phone: string;
  shippingAddress: string;
  occasion?: string;
  userNote?: string;
}) {
  const now = new Date().toISOString();
  const order: OrderRecord = {
    id: createId("order"),
    projectId: input.projectId,
    status: "submitted",
    customerName: input.customerName,
    wechatId: input.wechatId,
    phone: input.phone,
    shippingAddress: input.shippingAddress,
    occasion: input.occasion ?? "",
    userNote: input.userNote ?? "",
    internalNote: "",
    createdAt: now,
    updatedAt: now,
  };

  getStore().orders.unshift(order);
  return order;
}

export function getOrders() {
  return getStore().orders;
}

export function getOrder(orderId: string) {
  return getStore().orders.find((order) => order.id === orderId);
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  const order = getOrder(orderId);
  if (!order) return undefined;

  order.status = status;
  order.updatedAt = new Date().toISOString();
  return order;
}

