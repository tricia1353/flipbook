import { expect, test } from "vitest";
import { validateMediaFile } from "./mediaValidation";

test("accepts short mp4 video", () => {
  const result = validateMediaFile({
    name: "clip.mp4",
    type: "video/mp4",
    size: 12 * 1024 * 1024,
  });

  expect(result.ok).toBe(true);
});

test("rejects unsupported media type", () => {
  const result = validateMediaFile({
    name: "file.txt",
    type: "text/plain",
    size: 100,
  });

  expect(result.ok).toBe(false);
});

