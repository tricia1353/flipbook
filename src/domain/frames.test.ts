import { expect, test } from "vitest";
import { buildMockFrames } from "./frames";

test("creates fixed preview frames inside MVP range", () => {
  const frames = buildMockFrames("project_1");

  expect(frames.length).toBeGreaterThanOrEqual(45);
  expect(frames.length).toBeLessThanOrEqual(60);
  expect(frames[0]?.id).toBe("project_1-frame-1");
});

