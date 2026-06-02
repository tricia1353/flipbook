import { render, screen } from "@testing-library/react";
import HomePage from "./page";

test("shows both creation entries", () => {
  render(<HomePage />);

  expect(screen.getByText("上传视频做翻页书")).toBeInTheDocument();
  expect(screen.getByText("AI 生成我的幻想翻页书")).toBeInTheDocument();
});

