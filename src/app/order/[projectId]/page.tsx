import Link from "next/link";
import { getProject } from "@/server/mockStore";
import { OrderForm } from "./OrderForm";

type OrderPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { projectId } = await params;
  const project = getProject(projectId);

  if (!project) {
    return (
      <main className="app-shell">
        <section className="studio-frame simple-state">
          <h1>没有找到这个项目</h1>
          <p>请先完成一次创作预览，再提交订单草稿。</p>
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
          <div className="status-pill">Order Draft</div>
        </header>

        <div className="order-layout">
          <aside className="preview-copy">
            <p className="eyebrow">订单草稿</p>
            <h1 className="create-title">确认制作信息</h1>
            <p className="subcopy">
              当前模板：{project.templateName}。提交后不会自动扣款，团队会先通过微信确认效果和报价。
            </p>
          </aside>

          <OrderForm projectId={project.id} />
        </div>
      </section>
    </main>
  );
}

