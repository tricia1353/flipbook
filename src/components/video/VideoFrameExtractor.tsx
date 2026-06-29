"use client";

import { useState, useEffect } from "react";
import type { ExtractedFrame } from "@/lib/frameExtractor";
import { extractFramesFromVideo } from "@/lib/frameExtractor";

export interface VideoFrameExtractorProps {
  videoFile: File;
  onFramesExtracted?: (frames: ExtractedFrame[]) => void;
}

export function VideoFrameExtractor({
  videoFile,
  onFramesExtracted
}: VideoFrameExtractorProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);
  const [extractStatus, setExtractStatus] = useState("");

  // 抽帧参数
  const [fps, setFps] = useState(15);
  const [targetFrames] = useState(45);

  async function handleExtract() {
    setIsExtracting(true);
    setExtractProgress(0);
    setExtractStatus("准备截取帧...");

    try {
      const frames = await extractFramesFromVideo(videoFile, {
        fps,
        targetFrames,
        skipFirstFrame: true
      });

      // 更新进度
      const duration = 2000;
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 95);
        setExtractProgress(progress);
        setExtractStatus(`截取帧中... ${Math.floor((progress / 95) * frames.length)}/${frames.length}`);
      }, 50);

      await new Promise(resolve => setTimeout(resolve, duration));
      clearInterval(progressInterval);

      setExtractProgress(100);
      setExtractStatus(`完成！提取了 ${frames.length} 帧清晰画面`);

      onFramesExtracted?.(frames);
    } catch (error) {
      setExtractStatus(error instanceof Error ? error.message : "抽帧失败");
    } finally {
      setIsExtracting(false);
    }
  }

  // 当视频文件改变时，重置进度
  useEffect(() => {
    setExtractProgress(0);
    setExtractStatus("");
  }, [videoFile]);

  return (
    <div className="frame-extractor-compact">
      <div className="extract-params">
        <div className="param-row">
          <label>FPS</label>
          <input
            type="number"
            value={fps}
            onChange={(e) => setFps(Math.max(1, Math.min(60, Number(e.target.value))))}
            min="1"
            max="60"
          />
        </div>

        <button
          type="button"
          onClick={handleExtract}
          disabled={isExtracting}
          className="extract-button"
        >
          {isExtracting ? "抽帧中..." : "开始抽帧"}
        </button>
      </div>

      {isExtracting && (
        <div className="extract-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${extractProgress}%` }}
            />
          </div>
          <p className="progress-text">{extractStatus}</p>
        </div>
      )}

      {extractProgress === 100 && (
        <div className="extract-success">
          ✓ 已提取 {targetFrames} 帧清晰画面
        </div>
      )}
    </div>
  );
}