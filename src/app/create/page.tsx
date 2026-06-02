import { CreatePageContent } from "./CreatePageContent";
import type { CreationMode } from "@/domain/types";

type CreatePageProps = {
  searchParams: Promise<{
    mode?: string | string[];
  }>;
};

function normalizeMode(mode: string | string[] | undefined): CreationMode {
  const value = Array.isArray(mode) ? mode[0] : mode;
  return value === "ai_generated_video" ? "ai_generated_video" : "upload_video";
}

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const params = await searchParams;
  return <CreatePageContent mode={normalizeMode(params.mode)} />;
}

