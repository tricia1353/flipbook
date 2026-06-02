import Link from "next/link";
import { FlipbookPreview } from "@/components/flipbook/FlipbookPreview";
import { getProject } from "@/server/mockStore";

type PreviewPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { projectId } = await params;
  const project = getProject(projectId);

  if (!project) {
    return (
      <main className="app-shell">
        <section className="studio-frame simple-state">
          <h1>没有找到这个预览</h1>
          <p>可能是开发服务器重启后 mock 数据被清空了。回到创作页重新创建一次即可。</p>
          <Link className="plain-action" href="/create?mode=upload_video">
            重新创作
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="studio-frame preview-frame">
        <header className="topbar">
          <Link className="brand-lockup" href="/">
            <div className="brand-mark" aria-hidden="true">
              FS
            </div>
            <p className="brand-name">AI Flipbook Studio</p>
          </Link>
          <div className="status-pill">{project.aiJob.status}</div>
        </header>

        <div className="preview-layout">
          <aside className="preview-copy">
            <p className="eyebrow">翻页预览</p>
            <h1 className="create-title">{project.templateName}</h1>
            <p className="subcopy">
              Mock AI 已经完成生成，并抽出 {project.frames.length} 帧。你可以播放或拖动查看翻页节奏。
            </p>

            <div className="api-preview-panel">
              <span className="api-label">AI Job</span>
              <code>{project.aiJob.message}</code>
            </div>

            <Link className="entry-action compact primary" href={`/order/${project.id}`}>
              <span>
                <span className="entry-title">提交订单草稿</span>
                <span className="entry-desc">填写微信和地址，人工确认后制作。</span>
              </span>
              <span className="entry-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </aside>

          <FlipbookPreview frames={project.frames} />
        </div>
      </section>
    </main>
  );
}

