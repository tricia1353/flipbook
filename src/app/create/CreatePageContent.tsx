import Link from "next/link";
import { TEMPLATES } from "@/domain/templates";
import type { CreationMode } from "@/domain/types";

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
  const copy = modeCopy[mode];
  const templates = TEMPLATES.filter((template) => template.mode === mode);

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

        <div className="create-grid">
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

            <div className="upload-dropzone">
              <span className="upload-icon" aria-hidden="true">
                +
              </span>
              <span className="upload-title">{copy.uploadLabel}</span>
              <span className="upload-meta">MP4 / MOV / JPG / PNG</span>
            </div>

            <div className="prompt-panel">
              {copy.fields.map((field) => (
                <label className="prompt-field" key={field}>
                  <span>{field}</span>
                  <input placeholder={`填写${field}`} />
                </label>
              ))}
            </div>
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
                <article className="template-card" key={template.id}>
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
                </article>
              ))}
            </div>

            <div className="api-preview-panel">
              <span className="api-label">Next API</span>
              <code>
                POST /api/projects {"{"} mode, templateId, promptInputs, assetRefs {"}"}
              </code>
              <button className="entry-action compact" type="button">
                <span>
                  <span className="entry-title">创建预览任务</span>
                  <span className="entry-desc">下一步接入项目 API、mock AI job 和翻页预览。</span>
                </span>
                <span className="entry-arrow" aria-hidden="true">
                  →
                </span>
              </button>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

