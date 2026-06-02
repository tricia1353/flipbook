import type { AiJobType, CreationMode, PromptFieldKey, TemplateCategory } from "./types";

export type CreativeTemplate = {
  id: string;
  name: string;
  category: TemplateCategory;
  mode: CreationMode;
  jobType: AiJobType;
  shortDescription: string;
  requiredInputs: PromptFieldKey[];
  defaultPrompt: string;
  negativePrompt: string;
  estimatedSeconds: number;
};

export const TEMPLATES: CreativeTemplate[] = [
  {
    id: "fairy-forest-background",
    name: "童话森林",
    category: "change_world",
    mode: "upload_video",
    jobType: "background_replace",
    shortDescription: "保留真实动作，把背景换成有光斑和小路的童话森林。",
    requiredInputs: ["subject", "mood"],
    defaultPrompt:
      "Preserve the original subject motion and identity. Replace the background with a bright fairy-tale forest, soft daylight, layered trees, gentle depth, printable details.",
    negativePrompt:
      "distorted face, distorted hands, extra limbs, broken body, unreadable text, watermark, dark exposure, cropped subject",
    estimatedSeconds: 45,
  },
  {
    id: "moon-walk-background",
    name: "月球漫步",
    category: "change_world",
    mode: "upload_video",
    jobType: "background_replace",
    shortDescription: "保留人物或宠物动作，换成月球表面和远处地球。",
    requiredInputs: ["subject", "mood"],
    defaultPrompt:
      "Preserve the original subject motion and identity. Replace the background with a cinematic moon surface, visible Earth in the distance, clean shadows, whimsical gift-like mood.",
    negativePrompt:
      "identity drift, warped subject, extra animals, incorrect anatomy, heavy blur, noisy background, watermark, text artifacts",
    estimatedSeconds: 55,
  },
  {
    id: "birthday-party-background",
    name: "生日派对",
    category: "change_world",
    mode: "upload_video",
    jobType: "background_replace",
    shortDescription: "把真实动作放进温暖的生日派对布景。",
    requiredInputs: ["subject", "blessing", "mood"],
    defaultPrompt:
      "Preserve the subject and action. Replace the background with a cozy birthday party room, paper garlands, warm practical lights, handmade gift atmosphere, print-safe colors.",
    negativePrompt:
      "misspelled text, distorted face, harsh shadows, overexposed highlights, watermark, cropped subject",
    estimatedSeconds: 45,
  },
  {
    id: "retro-street-background",
    name: "复古电影街道",
    category: "change_world",
    mode: "upload_video",
    jobType: "background_replace",
    shortDescription: "把用户动作放进复古电影质感街道。",
    requiredInputs: ["subject", "mood"],
    defaultPrompt:
      "Preserve the subject action. Replace the background with a retro cinema street, warm storefront lights, gentle film grain, elegant composition, clear printable subject edge.",
    negativePrompt:
      "subject flicker, identity loss, bad masking edge, illegible signs, watermark, dark muddy colors",
    estimatedSeconds: 50,
  },
  {
    id: "anime-keepsake-style",
    name: "动漫纪念",
    category: "movie_style",
    mode: "upload_video",
    jobType: "video_stylize",
    shortDescription: "整段视频转成明亮动漫纪念风。",
    requiredInputs: ["subject", "mood"],
    defaultPrompt:
      "Stylize the full video into a bright anime keepsake look while preserving motion, identity, framing, and emotional expression. Clean lines, printable color contrast.",
    negativePrompt:
      "identity drift, deformed face, deformed hands, frame inconsistency, excessive glow, watermark, text artifacts",
    estimatedSeconds: 65,
  },
  {
    id: "clay-miniature-style",
    name: "黏土小剧场",
    category: "movie_style",
    mode: "upload_video",
    jobType: "video_stylize",
    shortDescription: "把视频变成手作黏土小剧场质感。",
    requiredInputs: ["subject", "mood"],
    defaultPrompt:
      "Stylize the video as a handcrafted clay miniature scene, tactile surfaces, soft studio lighting, consistent subject silhouette, suitable for a physical flipbook.",
    negativePrompt:
      "melting face, inconsistent body shape, muddy colors, heavy flicker, watermark, unreadable text",
    estimatedSeconds: 70,
  },
  {
    id: "vintage-film-style",
    name: "复古胶片",
    category: "movie_style",
    mode: "upload_video",
    jobType: "video_stylize",
    shortDescription: "整段视频做成温暖胶片感。",
    requiredInputs: ["subject", "mood"],
    defaultPrompt:
      "Stylize the full video with warm vintage film texture, gentle grain, natural skin tones, stable motion, clear subject, and print-friendly contrast.",
    negativePrompt:
      "overly dark exposure, crushed blacks, identity drift, unstable frames, watermark, scratches over face",
    estimatedSeconds: 50,
  },
  {
    id: "storybook-style",
    name: "童话绘本",
    category: "movie_style",
    mode: "upload_video",
    jobType: "video_stylize",
    shortDescription: "把真实视频变成柔和绘本画面。",
    requiredInputs: ["subject", "scene", "mood"],
    defaultPrompt:
      "Stylize the full video as a gentle storybook illustration, soft brush texture, clear subject outline, coherent motion, bright printable palette.",
    negativePrompt:
      "face distortion, extra limbs, frame flicker, muddy brushwork, unreadable text, watermark",
    estimatedSeconds: 65,
  },
  {
    id: "pet-moon-run",
    name: "我的宠物在月球奔跑",
    category: "fantasy_story",
    mode: "ai_generated_video",
    jobType: "reference_to_video",
    shortDescription: "用宠物参考图生成月球奔跑短片。",
    requiredInputs: ["subject", "scene", "mood"],
    defaultPrompt:
      "Generate a 3-5 second reference-based video. The subject runs or moves happily on a cinematic moon surface, Earth in the distance, playful gift feeling, stable identity, clear framing for flipbook printing.",
    negativePrompt:
      "extra animals, wrong breed, distorted legs, identity drift, fast chaotic camera, watermark, text, dark exposure",
    estimatedSeconds: 95,
  },
  {
    id: "baby-fairy-forest",
    name: "宝宝走进童话森林",
    category: "fantasy_story",
    mode: "ai_generated_video",
    jobType: "reference_to_video",
    shortDescription: "用宝宝参考图生成童话森林短片。",
    requiredInputs: ["subject", "scene", "mood"],
    defaultPrompt:
      "Generate a 3-5 second reference-based video. The baby gently steps or waves inside a bright fairy-tale forest, soft sunlight, safe warm mood, stable face identity, simple motion for flipbook frames.",
    negativePrompt:
      "distorted face, unsafe pose, extra limbs, identity drift, harsh shadows, watermark, text artifacts",
    estimatedSeconds: 95,
  },
  {
    id: "couple-retro-meet",
    name: "情侣复古电影相遇",
    category: "fantasy_story",
    mode: "ai_generated_video",
    jobType: "reference_to_video",
    shortDescription: "用情侣参考图生成复古街道相遇画面。",
    requiredInputs: ["subject", "scene", "mood"],
    defaultPrompt:
      "Generate a 3-5 second reference-based video. The couple meets or turns toward each other on a retro cinema street, warm storefront lighting, romantic but natural, stable identities, printable composition.",
    negativePrompt:
      "identity swap, distorted faces, extra people, unreadable signs, unstable camera, watermark, text artifacts",
    estimatedSeconds: 105,
  },
  {
    id: "birthday-magic-room",
    name: "魔法生日房间",
    category: "fantasy_story",
    mode: "ai_generated_video",
    jobType: "reference_to_video",
    shortDescription: "生成带生日氛围的魔法礼物短片。",
    requiredInputs: ["subject", "blessing", "mood"],
    defaultPrompt:
      "Generate a 3-5 second reference-based video. The subject appears in a cozy magical birthday room, glowing handmade decorations, gentle motion, stable identity, no readable text unless explicitly provided.",
    negativePrompt:
      "misspelled text, distorted face, extra limbs, flicker, watermark, overexposed lights, cluttered background",
    estimatedSeconds: 100,
  },
];

export function getTemplateById(templateId: string) {
  return TEMPLATES.find((template) => template.id === templateId);
}

