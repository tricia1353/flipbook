export type FlipbookFrame = {
  id: string;
  index: number;
  label: string;
  background: string;
  accent: string;
};

const FRAME_BACKGROUNDS = ["#ffe2d6", "#e1f0ed", "#fff1a8", "#e7e1ff", "#d9ecff"];
const FRAME_ACCENTS = ["#e95f45", "#147c7a", "#3f7d4f", "#6f5cc4", "#1f2326"];

export function buildMockFrames(projectId: string, frameCount = 50): FlipbookFrame[] {
  const safeFrameCount = Math.min(Math.max(frameCount, 45), 60);

  return Array.from({ length: safeFrameCount }, (_, index) => ({
    id: `${projectId}-frame-${index + 1}`,
    index: index + 1,
    label: `Frame ${String(index + 1).padStart(2, "0")}`,
    background: FRAME_BACKGROUNDS[index % FRAME_BACKGROUNDS.length],
    accent: FRAME_ACCENTS[index % FRAME_ACCENTS.length],
  }));
}

