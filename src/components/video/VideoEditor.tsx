"use client";

import { useState, useRef, useEffect } from "react";

export interface VideoEditorProps {
  videoFile: File;
  onTrimChange?: (startTime: number, endTime: number) => void;
}

export function VideoEditor({ videoFile, onTrimChange }: VideoEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [dragStartTrim, setDragStartTrim] = useState({ start: 0, end: 0 });
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // 创建视频 URL
  useEffect(() => {
    if (!videoFile) return;

    const url = URL.createObjectURL(videoFile);
    setVideoUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [videoFile]);

  // 视频事件监听
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      console.log("Video loaded, duration:", video.duration);
      setDuration(video.duration);
      const defaultDuration = Math.min(5, video.duration);
      setTrimStart(0);
      setTrimEnd(defaultDuration);
      onTrimChange?.(0, defaultDuration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [videoUrl, onTrimChange]);

  // 播放/暂停
  function togglePlay() {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    if (isPlaying) {
      video.pause();
    } else {
      // 如果当前时间已经超过结束时间，跳转到开始
      if (video.currentTime >= trimEnd) {
        video.currentTime = trimStart;
      }
      video.play().catch(err => {
        console.error("播放失败:", err);
      });
    }
  }

  // 跳转到指定时间
  function seekTo(time: number) {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(time, duration));
  }

  // 处理时间轴点击
  function handleTimelineClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / rect.width) * duration;
    seekTo(time);
  }

  // 更新裁剪范围
  function updateTrim(start: number, end: number) {
    const newStart = Math.max(0, Math.min(start, duration));
    const newEnd = Math.max(newStart + 0.5, Math.min(end, duration));
    setTrimStart(newStart);
    setTrimEnd(newEnd);
    onTrimChange?.(newStart, newEnd);
  }

  // 开始拖拽裁剪
  function handleDragStart(e: React.MouseEvent, type: "start" | "end" | "range") {
    e.preventDefault();
    const x = e.clientX;
    setDragStartTime(x);
    setDragStartTrim({ start: trimStart, end: trimEnd });

    if (type === "start") {
      setIsDraggingStart(true);
    } else if (type === "end") {
      setIsDraggingEnd(true);
    } else {
      setIsDragging(true);
    }
  }

  // 鼠标移动
  useEffect(() => {
    if (!containerRef.current || duration === 0) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const deltaX = e.clientX - dragStartTime;
      const timeDelta = (deltaX / rect.width) * duration;

      if (isDraggingStart) {
        const newStart = Math.max(0, dragStartTrim.start + timeDelta);
        updateTrim(newStart, trimEnd);
      } else if (isDraggingEnd) {
        const newEnd = Math.min(duration, dragStartTrim.end + timeDelta);
        updateTrim(trimStart, newEnd);
      } else if (isDragging) {
        const newStart = Math.max(0, dragStartTrim.start + timeDelta);
        const newEnd = Math.min(duration, dragStartTrim.end + timeDelta);
        updateTrim(newStart, newEnd);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingStart(false);
      setIsDraggingEnd(false);
      setIsDragging(false);
    };

    if (isDraggingStart || isDraggingEnd || isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingStart, isDraggingEnd, isDragging, dragStartTime, dragStartTrim, trimStart, trimEnd, duration]);

  // 循环播放选中的片段
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isPlaying) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= trimEnd && trimEnd > trimStart) {
        video.currentTime = trimStart;
        video.play().catch(() => {
          // 如果循环播放失败，暂停
          setIsPlaying(false);
        });
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [trimEnd, trimStart, isPlaying]);

  // 格式化时间
  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div className="video-editor" ref={containerRef}>
      <div className="video-editor-header">
        <p className="eyebrow">Video Preview</p>
        <h3 className="preview-title">视频预览</h3>
        <div className="video-duration">
          {formatTime(trimStart)} / {formatTime(trimEnd)}
          <span className="trim-duration">({formatTime(trimEnd - trimStart)})</span>
        </div>
      </div>

      {/* 视频播放器 */}
      <div className="video-player-container">
        <video
          ref={videoRef}
          src={videoUrl || undefined}
          className="video-player"
          playsInline
          muted
          preload="metadata"
        />
        <button
          type="button"
          onClick={togglePlay}
          className="video-play-btn"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
      </div>

      {/* 时间轴 */}
      <div className="video-timeline">
        <div
          className="timeline-track"
          onClick={handleTimelineClick}
        >
          {/* 已播放进度 */}
          <div
            className="timeline-progress"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          />

          {/* 裁剪区域 */}
          {duration > 0 && (
            <div
              className="timeline-trim"
              style={{
                left: `${(trimStart / duration) * 100}%`,
                width: `${((trimEnd - trimStart) / duration) * 100}%`
              }}
            >
              <div
                className="trim-handle trim-handle-start"
                onMouseDown={(e) => handleDragStart(e, "start")}
              />
              <div
                className="trim-handle trim-handle-end"
                onMouseDown={(e) => handleDragStart(e, "end")}
              />
              <div
                className="trim-handle trim-handle-range"
                onMouseDown={(e) => handleDragStart(e, "range")}
              />
            </div>
          )}

          {/* 当前时间指示器 */}
          {duration > 0 && (
            <div
              className="timeline-cursor"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          )}
        </div>
      </div>

      {/* 时间刻度 */}
      {duration > 0 && (
        <div className="timeline-scale">
          {Array.from({ length: Math.min(11, Math.ceil(duration) + 1) }).map((_, i) => {
            const time = (duration / 10) * i;
            return (
              <span
                key={i}
                className="scale-mark"
                style={{ left: `${(time / duration) * 100}%` }}
              >
                {formatTime(time)}
              </span>
            );
          })}
        </div>
      )}

      {/* 裁剪信息 */}
      {duration > 0 && (
        <div className="trim-info">
          <div className="trim-stat">
            <span className="trim-label">裁剪范围:</span>
            <span className="trim-value">{formatTime(trimStart)} - {formatTime(trimEnd)}</span>
          </div>
          <div className="trim-stat">
            <span className="trim-label">选择时长:</span>
            <span className="trim-value">{formatTime(trimEnd - trimStart)}</span>
          </div>
          <div className="trim-stat">
            <span className="trim-label">建议:</span>
            <span className="trim-value">
              {trimEnd - trimStart > 10 ? "⚠️ 太长，建议 3-5 秒" : "✓ 长度合适"}
            </span>
          </div>
        </div>
      )}

      {/* 快捷按钮 */}
      {duration > 0 && (
        <div className="video-editor-actions">
          <button
            type="button"
            onClick={() => seekTo(trimStart)}
            className="video-action-btn"
          >
            跳到开始
          </button>
          <button
            type="button"
            onClick={() => seekTo(trimEnd)}
            className="video-action-btn"
          >
            跳到结束
          </button>
          <button
            type="button"
            onClick={() => updateTrim(0, Math.min(5, duration))}
            className="video-action-btn"
          >
            重置为 5 秒
          </button>
        </div>
      )}
    </div>
  );
}