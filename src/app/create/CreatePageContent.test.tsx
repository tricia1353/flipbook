import { render, screen } from "@testing-library/react";
import { CreatePageContent } from "./CreatePageContent";

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

