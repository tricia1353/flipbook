"use client";

import Link from "next/link";
import { useState, type ChangeEvent } from "react";
import { validateMediaFile } from "@/domain/mediaValidation";
import { VideoEditor } from "@/components/video/VideoEditor";
import { VideoFrameExtractor } from "@/components/video/VideoFrameExtractor";
import { AiCoverGenerator } from "@/components/ai/AiCoverGenerator";
import { VideoFlipbookPreview, CoverPreview } from "@/components/flipbook/VideoFlipbookPreview";
import type { ExtractedFrame } from "@/lib/frameExtractor";

export function VideoToFlipbookContent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileStatus, setSelectedFileStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [extractedFrames, setExtractedFrames] = useState<ExtractedFrame[]>([]);
  const [generatedCover, setGeneratedCover] = useState<string | null>(null);

  // 视频裁剪范围
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null;
    setSelectedFile(file);

    if (!file) {
      setSelectedFileStatus("idle");
      setExtractedFrames([]);
      setGeneratedCover(null);
      return;
    }

    const result = validateMediaFile(file);
    setSelectedFileStatus(result.ok ? "valid" : "invalid");

    if (result.ok) {
      setTrimStart(0);
      setTrimEnd(0);
    }
  }

  function handleFramesExtracted(frames: ExtractedFrame[]) {
    setExtractedFrames(frames);
  }

  function handleCoverGenerated(coverUrl: string) {
    setGeneratedCover(coverUrl);
  }

  function handleTrimChange(start: number, end: number) {
    setTrimStart(start);
    setTrimEnd(end);
  }

  return (
    <main className="app-shell">
      <section className="studio-frame video-to-flipbook-frame" aria-label="上传视频做翻页书">
        <header className="topbar">
          <Link className="brand-lockup" href="/">
            <div className="brand-mark" aria-hidden="true">
              FS
            </div>
            <p className="brand-name">AI Flipbook Studio</p>
          </Link>
          <div className="topbar-right">
            <Link className="topbar-link" href="/settings">
              ⚙️ 设置
            </Link>
            <div className="status-pill">Video to Flipbook</div>
          </div>
        </header>

        <div className="video-to-flipbook-grid">
          {/* 左侧控制面板 - 简洁 */}
          <aside className="video-control-rail">
            {/* 上传区域 */}
            <label className="upload-dropzone">
              <span className="upload-icon" aria-hidden="true">
                📁
              </span>
              <span className="upload-title">上传视频</span>
              <span className="upload-meta">MP4 / WebM · 10 秒以内</span>
              <input
                aria-label="上传视频"
                className="file-input"
                type="file"
                accept="video/mp4,video/webm"
                onChange={handleFileChange}
              />
              <span className="upload-help">
                {selectedFile
                  ? (selectedFileStatus === "valid" ? "✓ 已就绪" : "需要调整")
                  : "拖拽或点击上传"}
              </span>
            </label>

            {/* 已选择文件信息 */}
            {selectedFile && (
              <div className={selectedFileStatus === "valid" ? "selected-file-card valid" : "selected-file-card invalid"} aria-live="polite">
                <strong>{selectedFile.name}</strong>
                <span>{formatFileSize(selectedFile.size)}</span>
              </div>
            )}

            {/* 视频编辑器 */}
            {selectedFile && selectedFileStatus === "valid" && (
              <VideoEditor
                videoFile={selectedFile}
                onTrimChange={handleTrimChange}
              />
            )}

            {/* 抽帧参数 */}
            {selectedFile && selectedFileStatus === "valid" && extractedFrames.length === 0 && (
              <VideoFrameExtractor
                videoFile={selectedFile}
                onFramesExtracted={handleFramesExtracted}
              />
            )}

            {/* AI 封面生成 */}
            {extractedFrames.length > 0 && (
              <AiCoverGenerator
                frames={extractedFrames}
                onCoverGenerated={handleCoverGenerated}
              />
            )}

            {/* 导出按钮 */}
            {extractedFrames.length > 0 && (
              <button
                type="button"
                onClick={async () => {
                  const JSZip = (await import("jszip")).default;
                  const { dataUrlToBlob } = await import("@/lib/frameExtractor");
                  const zip = new JSZip();
                  const folder = zip.folder("flip-book-frames");
                  if (!folder) return;

                  for (let i = 0; i < extractedFrames.length; i++) {
                    const fileName = `frame_${String(i + 1).padStart(3, "0")}.jpg`;
                    const blob = dataUrlToBlob(extractedFrames[i].dataUrl);
                    folder.file(fileName, blob);
                  }

                  const content = await zip.generateAsync({ type: "blob" });
                  const url = URL.createObjectURL(content);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `flip-book-${Date.now()}.zip`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="export-button"
              >
                📦 导出所有图片
              </button>
            )}
          </aside>

          {/* 右侧成果展示区 - 分为两部分 */}
          <section className="video-preview-workspace">
            {!selectedFile ? (
              // 空状态
              <div className="preview-stage empty">
                <div className="simple-state">
                  <span className="placeholder-icon" style={{ fontSize: "64px", display: "block", marginBottom: "16px" }}>
                    📖
                  </span>
                  <h1>上传视频开始</h1>
                  <p>拖拽视频到左侧，或点击上传区域选择文件</p>
                </div>
              </div>
            ) : selectedFileStatus === "invalid" ? (
              // 文件错误状态
              <div className="preview-stage empty">
                <div className="simple-state" style={{ color: "var(--coral)" }}>
                  <span className="placeholder-icon" style={{ fontSize: "64px", display: "block", marginBottom: "16px" }}>
                    ⚠️
                  </span>
                  <h1>文件不合适</h1>
                  <p>请上传 MP4 或 WebM 格式的视频文件</p>
                </div>
              </div>
            ) : extractedFrames.length === 0 ? (
              // 等待抽帧
              <div className="preview-stage empty">
                <div className="simple-state">
                  <span className="placeholder-icon" style={{ fontSize: "64px", display: "block", marginBottom: "16px" }}>
                    ⏳
                  </span>
                  <h1>等待抽帧</h1>
                  <p>在左侧调整参数，点击"开始抽帧"按钮</p>
                </div>
              </div>
            ) : (
              // 成果展示：翻页预览 + 封面预览
              <div className="result-preview-grid">
                {/* 左边：翻页预览 */}
                <div className="result-preview-left">
                  <VideoFlipbookPreview
                    frames={extractedFrames}
                    coverUrl={generatedCover}
                  />
                </div>

                {/* 右边：封面预览 */}
                <div className="result-preview-right">
                  <CoverPreview
                    frames={extractedFrames}
                    coverUrl={generatedCover}
                  />
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}