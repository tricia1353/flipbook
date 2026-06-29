"use client";

import { useState, useEffect } from "react";
import type { ExtractedFrame } from "@/lib/frameExtractor";

export interface VideoFlipbookPreviewProps {
  frames: ExtractedFrame[];
  coverUrl?: string | null;
}

export function VideoFlipbookPreview({ frames, coverUrl }: VideoFlipbookPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = frames.length;

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages]);

  function nextPage() {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }

  function goToPage(index: number) {
    if (index === currentPage) return;
    setCurrentPage(index);
  }

  if (frames.length === 0) {
    return (
      <div className="video-flipbook-preview empty">
        <div className="flipbook-placeholder">
          <span className="placeholder-icon">📖</span>
          <p>完成抽帧后，翻页预览将在此显示</p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-flipbook-preview">
      <div className="flipbook-preview-header">
        <p className="eyebrow">Flipbook</p>
        <h3 className="preview-title">翻页预览</h3>
      </div>

      {/* 翻页书主体 */}
      <div className="flipbook-stage">
        {/* 帧堆叠效果 */}
        <div className="flipbook-stack">
          {frames.map((frame, index) => {
            const isCurrentPage = index === currentPage;
            const isPast = index < currentPage;
            const isFuture = index > currentPage;

            let zIndex = index;
            let transform = "";
            let opacity = isCurrentPage ? "1" : "0";

            // 过去页的堆叠效果
            if (isPast) {
              const offset = Math.min(currentPage - index, 3);
              transform = `translate(${offset * 3}px, ${offset * 2}px) rotate(-${offset * 2}deg)`;
              zIndex = index;
              opacity = offset >= 3 ? "0" : "1";
            }
            // 当前页
            else if (isCurrentPage) {
              zIndex = totalPages + 10;
              transform = "rotateY(0deg)";
            }
            // 未来页
            else {
              zIndex = totalPages - index;
            }

            return (
              <div
                key={frame.index}
                className={`flip-page ${isCurrentPage ? "flip-page-current" : ""}`}
                style={{
                  zIndex,
                  opacity,
                  transform,
                }}
              >
                <img
                  src={frame.dataUrl}
                  alt={`Frame ${frame.index + 1}`}
                  className="flip-page-image"
                />
                <div className="flip-page-number">
                  {String(frame.index + 1).padStart(2, "0")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 翻页控制 */}
      <div className="flipbook-controls">
        <button
          type="button"
          onClick={prevPage}
          disabled={currentPage === 0}
          className="flipbook-nav-btn"
        >
          上一页
        </button>

        <div className="flipbook-page-indicator">
          <span className="page-current">{String(currentPage + 1).padStart(2, "0")}</span>
          <span className="page-divider">/</span>
          <span className="page-total">{totalPages}</span>
        </div>

        <button
          type="button"
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          className="flipbook-nav-btn"
        >
          下一页
        </button>
      </div>

      <p className="flipbook-hint">
        💡 使用键盘 ← → 或点击按钮翻页
      </p>
    </div>
  );
}

export function CoverPreview({ frames, coverUrl }: { frames: ExtractedFrame[]; coverUrl?: string | null }) {
  const currentCover = coverUrl || frames[0]?.dataUrl;

  return (
    <div className="cover-preview-container">
      <div className="cover-preview-header">
        <p className="eyebrow">Cover</p>
        <h3 className="preview-title">封面预览</h3>
        {!coverUrl && frames.length > 0 && (
          <span className="cover-placeholder-badge">暂未生成</span>
        )}
      </div>

      <div className="cover-preview-frame">
        {currentCover && (
          <img
            src={currentCover}
            alt="封面预览"
            className="cover-preview-image"
          />
        )}
      </div>

      {coverUrl && (
        <button
          type="button"
          onClick={() => window.open(coverUrl, "_blank")}
          className="download-cover-btn"
        >
          下载封面
        </button>
      )}

      {!coverUrl && frames.length > 0 && (
        <p className="cover-preview-hint">
          生成 AI 封面后，将在此处显示
        </p>
      )}
    </div>
  );
}