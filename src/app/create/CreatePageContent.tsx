"use client";

import Link from "next/link";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { validateMediaFile } from "@/domain/mediaValidation";
import { TEMPLATES } from "@/domain/templates";
import type { CreationMode, PromptFieldKey } from "@/domain/types";
import { VideoFrameExtractor } from "@/components/video/VideoFrameExtractor";
import { AiCoverGenerator } from "@/components/ai/AiCoverGenerator";
import type { ExtractedFrame } from "@/lib/frameExtractor";

type CreatePageContentProps = {
  mode: CreationMode;
};

const modeCopy = {
  upload_video: {
    label: "上传视频做翻页书",
    title: "先选一个 AI 处理方向",
    uploadLabel: "上传 3-5 秒视频",
    fields: ["主角", "氛围", "祝福语"],
  },
  ai_generated_video: {
    label: "AI 生成我的幻想翻页书",
    title: "选择一个幻想模板",
    uploadLabel: "上传本人/宠物参考图",
    fields: ["主角", "场景", "氛围"],
  },
} satisfies Record<
  CreationMode,
  {
    label: string;
    title: string;
    uploadLabel: string;
    fields: string[];
  }
>;

export function CreatePageContent({ mode }: CreatePageContentProps) {
  const router = useRouter();
  const copy = modeCopy[mode];
  const templates = useMemo(() => TEMPLATES.filter((template) => template.mode === mode), [mode]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id ?? "");
  const selectedTemplate = templates.find((template) => template.id === selectedTemplateId) ?? templates[0];
  const [promptInputs, setPromptInputs] = useState<Partial<Record<PromptFieldKey, string>>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileStatus, setSelectedFileStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [uploadMessage, setUploadMessage] = useState("先用本地文件名模拟上传，后续接对象存储 API。");
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [extractedFrames, setExtractedFrames] = useState<ExtractedFrame[]>([]);
  const [generatedCover, setGeneratedCover] = useState<string | null>(null);

  function handleFramesExtracted(frames: ExtractedFrame[]) {
    setExtractedFrames(frames);
  }

  function handleCoverGenerated(coverUrl: string) {
    setGeneratedCover(coverUrl);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null;
    setSelectedFile(file);

    if (!file) {
      setSelectedFileStatus("idle");
      setUploadMessage("先用本地文件名模拟上传，后续接对象存储 API。");
      return;
    }

    const result = validateMediaFile(file);
    setSelectedFileStatus(result.ok ? "valid" : "invalid");
    setUploadMessage(result.ok ? `${file.name} 已选择，创建项目时会作为素材引用提交。` : result.message);
  }

  function updatePromptInput(key: PromptFieldKey, value: string) {
    setPromptInputs((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTemplate) return;

    const mediaValidation = selectedFile ? validateMediaFile(selectedFile) : undefined;
    if (selectedFile && mediaValidation && !mediaValidation.ok) {
      setSubmitError(mediaValidation.message);
      setSubmitState("error");
      return;
    }

    setSubmitState("submitting");
    setSubmitError("");

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode,
        templateId: selectedTemplate.id,
        promptInputs,
        assetRefs: selectedFile
          ? [
              {
                assetType: mode === "upload_video" ? "source_video" : "reference_image",
                fileName: selectedFile.name,
                contentType: selectedFile.type,
                size: selectedFile.size,
              },
            ]
          : [],
      }),
    });

    const payload = (await response.json()) as { previewUrl?: string; error?: string };

    if (!response.ok || !payload.previewUrl) {
      setSubmitState("error");
      setSubmitError(payload.error ?? "创建预览任务失败，请稍后重试。");
      return;
    }

    router.push(payload.previewUrl);
  }

  return (
    <main className="app-shell">
      <section className="studio-frame create-frame" aria-label={copy.label}>
        <header className="topbar">
          <Link className="brand-lockup" href="/">
            <div className="brand-mark" aria-hidden="true">
              FS
            </div>
            <p className="brand-name">AI Flipbook Studio</p>
          </Link>
          <div className="status-pill">API-first flow</div>
        </header>

        <form className="create-grid" onSubmit={handleSubmit}>
          <aside className="create-rail">
            <p className="eyebrow">{copy.label}</p>
            <h1 className="create-title">{copy.title}</h1>

            <div className="mode-switch" aria-label="创作模式">
              <Link className={mode === "upload_video" ? "mode-tab active" : "mode-tab"} href="/create?mode=upload_video">
                上传视频
              </Link>
              <Link
                className={mode === "ai_generated_video" ? "mode-tab active" : "mode-tab"}
                href="/create?mode=ai_generated_video"
              >
                AI 生成
              </Link>
            </div>

            <label className="upload-dropzone">
              <span className="upload-icon" aria-hidden="true">
                +
              </span>
              <span className="upload-title">{copy.uploadLabel}</span>
              <span className="upload-meta">MP4 / MOV / JPG / PNG</span>
              <input
                aria-label={copy.uploadLabel}
                className="file-input"
                type="file"
                accept="video/mp4,video/quicktime,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />
              <span className="upload-help">{uploadMessage}</span>
            </label>

            {selectedFile ? (
              <div className={selectedFileStatus === "valid" ? "selected-file-card valid" : "selected-file-card invalid"} aria-live="polite">
                <span className="selected-file-kicker">{selectedFileStatus === "valid" ? "已选择文件" : "文件需要调整"}</span>
                <strong>{selectedFile.name}</strong>
                <span>
                  {formatFileSize(selectedFile.size)} · {selectedFile.type || "未知类型"}
                </span>
              </div>
            ) : null}

            <div className="prompt-panel">
              {(selectedTemplate?.requiredInputs ?? []).map((field) => (
                <label className="prompt-field" key={field}>
                  <span>{fieldLabel[field]}</span>
                  <input
                    name={field}
                    placeholder={`填写${fieldLabel[field]}`}
                    value={promptInputs[field] ?? ""}
                    onChange={(event) => updatePromptInput(field, event.currentTarget.value)}
                  />
                </label>
              ))}
            </div>

            {/* 视频抽帧和封面生成 - 仅在上传视频模式下显示 */}
            {mode === "upload_video" && selectedFile && selectedFileStatus === "valid" && (
              <>
                <VideoFrameExtractor
                  videoFile={selectedFile}
                  onFramesExtracted={handleFramesExtracted}
                />

                {extractedFrames.length > 0 && (
                  <AiCoverGenerator
                    frames={extractedFrames}
                    onCoverGenerated={handleCoverGenerated}
                  />
                )}
              </>
            )}
          </aside>

          <section className="template-workspace">
            <div className="workspace-head">
              <div>
                <p className="eyebrow">Templates</p>
                <h2 className="workspace-title">选择模板</h2>
              </div>
              <span className="frame-count">45-60 frames</span>
            </div>

            <div className="template-grid">
              {templates.map((template, index) => (
                <button
                  className={template.id === selectedTemplate?.id ? "template-card selected" : "template-card"}
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(template.id)}
                  aria-pressed={template.id === selectedTemplate?.id}
                >
                  <div className="template-thumb" data-index={index + 1}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="template-body">
                    <h3>{template.name}</h3>
                    <p>{template.shortDescription}</p>
                    <div className="template-meta">
                      <span>{template.estimatedSeconds}s</span>
                      <span>{template.jobType}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="api-preview-panel">
              <span className="api-label">Next API</span>
              <code>
                POST /api/projects {"{"} mode, templateId, promptInputs, assetRefs {"}"}
              </code>
              <button className="entry-action compact" type="submit" disabled={submitState === "submitting"}>
                <span>
                  <span className="entry-title">{submitState === "submitting" ? "正在创建任务" : "创建预览任务"}</span>
                  <span className="entry-desc">调用 /api/projects，生成 mock AI job 和 50 帧翻页预览。</span>
                </span>
                <span className="entry-arrow" aria-hidden="true">
                  →
                </span>
              </button>
              {submitError ? <p className="form-error">{submitError}</p> : null}
            </div>
          </section>
        </form>
      </section>
    </main>
  );
}

const fieldLabel: Record<PromptFieldKey, string> = {
  subject: "主角",
  scene: "场景",
  mood: "氛围",
  style: "风格",
  blessing: "祝福语",
};

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
