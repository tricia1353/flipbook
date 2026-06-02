# 外部 AI API 接入说明

当前 MVP 已经是 API-first 流程，但 AI 结果先用 mock provider 模拟。这样可以先验证用户创作、翻页预览、订单提交和后台履约，不会被真实 AI 的价格、速度和稳定性卡住。

## 当前可用链路

用户点击「创建预览任务」后，前端调用：

```http
POST /api/projects
```

请求结构：

```json
{
  "mode": "upload_video",
  "templateId": "fairy-forest-background",
  "promptInputs": {
    "subject": "一只白色小狗",
    "mood": "开心"
  },
  "assetRefs": [
    {
      "assetType": "source_video",
      "fileName": "demo.mp4",
      "contentType": "video/mp4",
      "size": 1024
    }
  ]
}
```

当前返回 mock 预览：

```json
{
  "projectId": "project_xxx",
  "jobId": "job_xxx",
  "status": "completed",
  "previewUrl": "/preview/project_xxx"
}
```

## 接真实 AI 的位置

真实 AI 不应该写在页面组件里。推荐只改服务端这几处：

- `src/app/api/projects/route.ts`：接收创建项目请求。
- `src/server/mockStore.ts`：当前生成 mock project、mock AI job、mock frames。
- 后续新增 `src/server/ai/<provider>.ts`：封装真实 AI provider。

页面继续只调用 `/api/projects`。

## 推荐接入步骤

1. 选择 AI provider。
2. 在 provider 平台创建 API key。
3. 创建本地 `.env.local`，不要提交到 git：

```bash
AI_PROVIDER=real
AI_API_BASE_URL=https://your-provider-api.example.com
AI_API_KEY=你的真实APIKey
```

4. 在 `src/server/ai/` 新增 provider adapter。
5. 在 `/api/projects` 中根据 `AI_PROVIDER` 选择 mock 或真实 provider。
6. 真实 provider 返回视频 URL 后，再接 FFmpeg 抽帧和打印 PDF worker。

## Provider Adapter 约定

后续真实 provider 建议实现这些能力：

```ts
export type GenerateVideoInput = {
  templateId: string;
  prompt: string;
  negativePrompt: string;
  assetUrls: string[];
};

export type GenerateVideoOutput = {
  providerJobId: string;
  status: "queued" | "running" | "completed" | "failed";
  videoUrl?: string;
  errorMessage?: string;
};
```

上传视频入口需要：

- `replaceBackground`
- `stylizeVideo`

AI 生成入口需要：

- `generateVideo`

## 你实际怎么操作

现在先这样跑本地 MVP：

```bash
npm run dev
```

打开：

```text
http://127.0.0.1:3000
```

当你准备接真实 AI 时，把服务商名称、API 文档地址和 API key 给我，我会把 mock provider 替换成真实 API adapter。

