export type MediaFileLike = {
  name: string;
  type: string;
  size: number;
};

export type MediaValidationResult =
  | { ok: true; kind: "image" | "video" }
  | { ok: false; message: string };

const VIDEO_TYPES = new Set(["video/mp4", "video/quicktime"]);
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const VIDEO_LIMIT = 100 * 1024 * 1024;
const IMAGE_LIMIT = 20 * 1024 * 1024;

export function validateMediaFile(file: MediaFileLike): MediaValidationResult {
  if (VIDEO_TYPES.has(file.type)) {
    if (file.size > VIDEO_LIMIT) {
      return { ok: false, message: "视频文件请控制在 100MB 内。" };
    }
    return { ok: true, kind: "video" };
  }

  if (IMAGE_TYPES.has(file.type)) {
    if (file.size > IMAGE_LIMIT) {
      return { ok: false, message: "图片文件请控制在 20MB 内。" };
    }
    return { ok: true, kind: "image" };
  }

  return { ok: false, message: "请上传 MP4、MOV、JPG、PNG 或 WebP 文件。" };
}

