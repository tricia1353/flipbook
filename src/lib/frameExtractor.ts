/**
 * 视频抽帧工具函数
 * 支持智能抽帧：按清晰度筛选，自动跳过模糊帧
 */

export interface ExtractedFrame {
  index: number;
  time: number;
  dataUrl: string;
  sharpnessScore: number;
}

export interface ExtractFrameOptions {
  fps?: number;
  targetFrames?: number;
  skipFirstFrame?: boolean;
}

/**
 * 计算清晰度分数（拉普拉斯方差）
 * 降采样到 200px 宽度以提高性能
 */
function calculateSharpness(canvas: HTMLCanvasElement): number {
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;

  const width = canvas.width;
  const height = canvas.height;

  // 降采样
  const sampleWidth = Math.min(width, 200);
  const sampleHeight = Math.floor((height * sampleWidth) / width);

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = sampleWidth;
  tempCanvas.height = sampleHeight;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return 0;

  tempCtx.drawImage(canvas, 0, 0, sampleWidth, sampleHeight);

  const imgData = tempCtx.getImageData(0, 0, sampleWidth, sampleHeight);
  const data = imgData.data;

  // 转灰度
  const gray = new Uint8Array(sampleWidth * sampleHeight);
  for (let i = 0; i < data.length; i += 4) {
    gray[i / 4] = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
  }

  // 计算拉普拉斯方差
  let sum = 0;
  let count = 0;

  for (let y = 1; y < sampleHeight - 1; y++) {
    for (let x = 1; x < sampleWidth - 1; x++) {
      const idx = y * sampleWidth + x;
      const laplacian =
        -gray[idx - 1] - gray[idx + 1] -
        gray[idx - sampleWidth] - gray[idx + sampleWidth] +
        4 * gray[idx];
      sum += laplacian * laplacian;
      count++;
    }
  }

  return count > 0 ? sum / count : 0;
}

/**
 * 从视频文件提取帧
 */
export async function extractFramesFromVideo(
  videoFile: File,
  options: ExtractFrameOptions = {}
): Promise<ExtractedFrame[]> {
  const {
    fps = 15,
    targetFrames = 45,
    skipFirstFrame = true
  } = options;

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoFile);
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = async () => {
      const duration = video.duration;
      const interval = 1 / fps;
      const totalCandidates = Math.floor(duration * fps);

      const candidates: ExtractedFrame[] = [];
      let time = skipFirstFrame ? interval : 0;

      while (time < duration) {
        video.currentTime = time;
        await new Promise<void>((resolveSeek) => {
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            resolveSeek();
          };
          video.addEventListener('seeked', onSeeked);
        });

        // 绘制到 canvas
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          time += interval;
          continue;
        }
        ctx.drawImage(video, 0, 0);

        candidates.push({
          index: candidates.length,
          time,
          dataUrl: canvas.toDataURL('image/jpeg', 0.92),
          sharpnessScore: calculateSharpness(canvas)
        });

        time += interval;
      }

      // 按清晰度排序并选择前 N 帧
      const sorted = [...candidates].sort((a, b) => b.sharpnessScore - a.sharpnessScore);
      const sharpFrames = sorted.slice(0, targetFrames);

      // 按时间顺序重排
      sharpFrames.sort((a, b) => a.time - b.time);

      // 更新索引
      sharpFrames.forEach((frame, i) => {
        frame.index = i;
      });

      resolve(sharpFrames);
    };

    video.onerror = () => {
      reject(new Error('视频加载失败'));
    };

    video.load();
  });
}

/**
 * DataURL 转 Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}