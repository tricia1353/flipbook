import { NextResponse } from "next/server";
import { createProject } from "@/server/mockStore";
import type { CreationMode } from "@/domain/types";

function isCreationMode(value: unknown): value is CreationMode {
  return value === "upload_video" || value === "ai_generated_video";
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;

  if (!isCreationMode(body.mode)) {
    return NextResponse.json({ error: "创作模式无效。" }, { status: 400 });
  }

  if (typeof body.templateId !== "string" || !body.templateId) {
    return NextResponse.json({ error: "请选择模板。" }, { status: 400 });
  }

  try {
    const project = createProject({
      mode: body.mode,
      templateId: body.templateId,
      promptInputs: body.promptInputs,
      assetRefs: body.assetRefs,
    });

    return NextResponse.json({
      projectId: project.id,
      jobId: project.aiJob.id,
      status: project.aiJob.status,
      previewUrl: `/preview/${project.id}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "创建项目失败。" },
      { status: 400 },
    );
  }
}

