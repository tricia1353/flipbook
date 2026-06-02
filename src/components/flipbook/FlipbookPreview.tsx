"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { FlipbookFrame } from "@/domain/frames";

type FlipbookPreviewProps = {
  frames: FlipbookFrame[];
};

export function FlipbookPreview({ frames }: FlipbookPreviewProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const frame = frames[currentFrame] ?? frames[0];

  useEffect(() => {
    if (!isPlaying || frames.length === 0) return;

    const timer = window.setInterval(() => {
      setCurrentFrame((current) => (current + 1) % frames.length);
    }, 90);

    return () => window.clearInterval(timer);
  }, [frames.length, isPlaying]);

  function step(direction: -1 | 1) {
    setCurrentFrame((current) => (current + direction + frames.length) % frames.length);
  }

  if (!frame) {
    return <div className="flipbook-live empty">还没有可预览帧。</div>;
  }

  return (
    <section className="flipbook-live" aria-label="翻页书预览">
      <div
        className="live-frame"
        style={
          {
            "--frame-bg": frame.background,
            "--frame-accent": frame.accent,
          } as CSSProperties
        }
      >
        <div className="live-subject" />
        <div className="live-motion-line one" />
        <div className="live-motion-line two" />
        <span>{frame.label}</span>
      </div>

      <div className="preview-controls">
        <button type="button" onClick={() => step(-1)} aria-label="上一帧">
          ←
        </button>
        <button type="button" onClick={() => setIsPlaying((value) => !value)}>
          {isPlaying ? "暂停" : "播放"}
        </button>
        <button type="button" onClick={() => step(1)} aria-label="下一帧">
          →
        </button>
      </div>

      <input
        aria-label="当前帧"
        className="frame-slider"
        type="range"
        min={0}
        max={frames.length - 1}
        value={currentFrame}
        onChange={(event) => setCurrentFrame(Number(event.currentTarget.value))}
      />

      <p className="frame-readout">
        {currentFrame + 1} / {frames.length}
      </p>
    </section>
  );
}
