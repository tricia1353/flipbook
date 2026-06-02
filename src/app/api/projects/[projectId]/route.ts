import { NextResponse } from "next/server";
import { getProject } from "@/server/mockStore";

type ProjectRouteContext = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function GET(_request: Request, context: ProjectRouteContext) {
  const { projectId } = await context.params;
  const project = getProject(projectId);

  if (!project) {
    return NextResponse.json({ error: "项目不存在。" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

