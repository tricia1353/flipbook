# AI Flipbook Studio

> 一款面向移动端的口袋翻页书自助创作工具，支持视频直接导出打印帧 或 AI 风格化处理。

## 功能概览

| 模式 | 说明 |
|------|------|
| **上传视频做翻页书** | 智能抽帧（45–60 帧），导出 ZIP，直接送打印 |
| **上传视频（AI 处理）** | 保留真实动作，换 AI 背景或变成电影/动画风格 |
| **AI 生成幻想翻页书** | 上传参考图，进入月球、森林、生日等场景 |

制作流程：上传/生成 → AI 处理 → 45–60 帧 → 微信确认

## 技术栈

- **框架**：Next.js 16 + React 19 + TypeScript
- **样式**：Tailwind CSS 4
- **打包工具**：内置 Next.js bundler
- **测试**：Vitest（单元）+ Playwright（E2E）
- **工具库**：JSZip（帧导出）

## 目录结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── page.tsx            # 首页（创作入口）
│   ├── video-to-flipbook/  # 视频→翻页书工作流
│   ├── create/             # AI 处理创作页
│   ├── preview/            # 翻页书预览
│   ├── order/              # 下单确认
│   ├── settings/           # 用户设置
│   └── api/                # API 路由
├── components/
│   ├── ai/                 # AI 封面生成
│   ├── flipbook/           # 翻页书预览组件
│   └── video/              # 视频编辑 & 抽帧
├── domain/                 # 业务逻辑（纯函数 + 类型）
└── lib/                    # 工具函数（frameExtractor 等）
```

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发（http://localhost:3000）
npm run dev

# 构建生产版本
npm run build && npm start
```

## 测试

```bash
# 单元测试
npm test

# E2E 测试
npm run test:e2e
```

## 核心工作流

1. 用户在 `/video-to-flipbook` 上传 MP4/WebM 视频（≤10 秒）
2. 前端通过 `VideoFrameExtractor` 抽取 45–60 帧
3. 可选：`AiCoverGenerator` 为翻页书生成 AI 封面
4. 点击"导出所有图片"，下载包含帧序列的 ZIP 文件
5. 提交订单后通过微信与制作方确认实体翻页书生产

## 备注

- 本项目为黑客松 MVP，API 接口为 `api-first` 设计，页面只负责收集选择和展示进度
- 实体制作、AI 生成、订单状态均通过后端 API 处理
