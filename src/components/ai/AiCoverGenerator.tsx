"use client";

import { useState } from "react";
import Link from "next/link";
import type { ExtractedFrame } from "@/lib/frameExtractor";

export interface AiCoverGeneratorProps {
  frames: ExtractedFrame[];
  onCoverGenerated?: (coverUrl: string) => void;
}

const COVER_STYLES = [
  { value: "电影海报风格", label: "电影海报" },
  { value: "艺术插画风格", label: "艺术插画" },
  { value: "现代简约风格", label: "现代简约" },
  { value: "复古怀旧风格", label: "复古怀旧" },
  { value: "动漫风格", label: "动漫" },
  { value: "水彩画风格", label: "水彩画" }
];

export function AiCoverGenerator({ frames, onCoverGenerated }: AiCoverGeneratorProps) {
  const [selectedStyle, setSelectedStyle] = useState("电影海报风格");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    // 从 localStorage 获取 API Key
    const apiKey = localStorage.getItem("zhipu_api_key");

    if (!apiKey) {
      setError("请先在设置页面配置 API Key");
      return;
    }
    if (frames.length === 0) {
      setError("请先完成视频抽帧");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      // 1. 选择代表性关键帧（均匀采样）
      const sampleFrames = selectSampleFrames(frames, 4);

      // 2. 调用智谱 GLM-4V 分析视频内容
      const description = await analyzeVideoContent(apiKey, sampleFrames);

      // 3. 调用智谱 CogView-3 生成封面
      const coverUrl = await generateCover(apiKey, description, selectedStyle);

      onCoverGenerated?.(coverUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "封面生成失败");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="ai-cover-section">
      <div className="ai-cover-header">
        <div className="ai-cover-icon">🎨</div>
        <h3>AI 封面生成</h3>
      </div>

      <div className="cover-options">
        <div className="cover-option-row">
          <label>封面风格</label>
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
          >
            {COVER_STYLES.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating || frames.length === 0}
        className="generate-cover-btn"
      >
        <span>
          <span className="extract-title">
            {isGenerating ? "生成中..." : "生成 AI 封面"}
          </span>
          <span className="extract-desc">
            {frames.length > 0
              ? "基于视频内容智能生成"
              : "请先完成视频抽帧"}
          </span>
        </span>
        <span aria-hidden="true">→</span>
      </button>

      {error && (
        <div className="cover-error">
          <p>{error}</p>
          {error.includes("API Key") && (
            <Link href="/settings" className="error-link">
              前往设置 →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// 选择代表性关键帧（均匀采样）
function selectSampleFrames(frameList: ExtractedFrame[], count: number): ExtractedFrame[] {
  const step = Math.floor(frameList.length / count);
  const samples: ExtractedFrame[] = [];
  for (let i = 0; i < count; i++) {
    samples.push(frameList[Math.min(i * step, frameList.length - 1)]);
  }
  return samples;
}

// 调用智谱 GLM-4V 分析视频内容
async function analyzeVideoContent(apiKey: string, frameUrls: ExtractedFrame[]): Promise<string> {
  // 将 DataURL 转换为 base64
  const base64Images = frameUrls.map(frame => frame.dataUrl.split(',')[1]);

  const messages = [
    {
      role: "system",
      content: "你是一个资深的视觉艺术分析师和书籍封面设计专家。请从以下维度分析这些视频帧：1.核心主体/人物特征（年龄、性别、姿态、表情）2.场景环境与背景元素 3.主要配色方案与色调倾向 4.光影来源与明暗关系 5.整体情绪氛围 6.视觉焦点与构图特点。用精炼中文描述，每个维度用分号分隔，总字数控制在100字内。"
    },
    {
      role: "user",
      content: [
        { type: "text", text: "请分析这些视频帧，描述视频的主题、色调和氛围：" },
        ...base64Images.map(base64 => ({
          type: "image_url",
          image_url: { url: base64 }
        }))
      ]
    }
  ];

  const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "glm-4v",
      messages,
      max_tokens: 200,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const err = await response.json() as { error?: { message?: string } };
    throw new Error(err.error?.message || "API 调用失败");
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0].message.content;
}

// 调用智谱 CogView-3 生成封面
async function generateCover(apiKey: string, description: string, style: string): Promise<string> {
  const prompt = `一本${style}书籍的封面设计，主题基于以下内容：${description}。
画面要求：主视觉突出，采用三分法构图，黄金比例布局，视觉引导线清晰。
色彩方案：高饱和度，色彩对比强烈但和谐统一，主色调鲜明且有层次感。
光影设计：戏剧性布光，明暗交界线分明，光影层次丰富立体，主光、补光、轮廓光配合自然。
质感表现：纸张质感或织物纹理细腻可见，笔触痕迹自然流畅，材质层次分明。
渲染品质：电影级画面质感，4K超清分辨率，8K细节呈现，精修后期，适合印刷。
技术要求：无任何文字、无水印、无签名、无二维码，纯画面呈现，留白适当便于后期添加标题。`;

  const response = await fetch("https://open.bigmodel.cn/api/paas/v4/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "cogview-3-plus",
      prompt,
      size: "1024x1024"
    })
  });

  if (!response.ok) {
    const err = await response.json() as { error?: { message?: string } };
    throw new Error(err.error?.message || "封面生成失败");
  }

  const data = await response.json() as { data: Array<{ url: string }> };
  return data.data[0].url;
}