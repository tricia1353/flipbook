import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { CreatePageContent } from "./CreatePageContent";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

test("renders upload video creation page", () => {
  render(<CreatePageContent mode="upload_video" />);

  expect(screen.getByRole("heading", { name: "先选一个 AI 处理方向" })).toBeInTheDocument();
  expect(screen.getByText("童话森林")).toBeInTheDocument();
  expect(screen.getByText("上传 3-5 秒视频")).toBeInTheDocument();
});

test("renders AI generated video creation page", () => {
  render(<CreatePageContent mode="ai_generated_video" />);

  expect(screen.getByRole("heading", { name: "选择一个幻想模板" })).toBeInTheDocument();
  expect(screen.getByText("我的宠物在月球奔跑")).toBeInTheDocument();
  expect(screen.getByText("上传本人/宠物参考图")).toBeInTheDocument();
});

test("shows selected file details after upload", () => {
  render(<CreatePageContent mode="upload_video" />);

  const file = new File(["demo"], "demo.mp4", { type: "video/mp4" });
  const input = screen.getByLabelText("上传 3-5 秒视频") as HTMLInputElement;

  fireEvent.change(input, { target: { files: [file] } });

  expect(screen.getByText("已选择文件")).toBeInTheDocument();
  expect(screen.getByText("demo.mp4")).toBeInTheDocument();
});
