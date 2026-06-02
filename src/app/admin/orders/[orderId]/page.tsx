import Link from "next/link";
import { getOrder, getProject } from "@/server/mockStore";
import { StatusControls } from "./StatusControls";

type AdminOrderPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function AdminOrderPage({ params }: AdminOrderPageProps) {
  const { orderId } = await params;
  const order = getOrder(orderId);
  const project = order ? getProject(order.projectId) : undefined;

  if (!order) {
    return (
      <main className="app-shell">
        <section className="studio-frame simple-state">
          <h1>订单不存在</h1>
          <Link className="plain-action" href="/admin">
            返回后台
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="studio-frame preview-frame">
        <header className="topbar">
          <Link className="brand-lockup" href="/admin">
            <div className="brand-mark" aria-hidden="true">
              FS
            </div>
            <p className="brand-name">Order Detail</p>
          </Link>
          <div className="status-pill">{order.id}</div>
        </header>

        <section className="admin-detail">
          <div>
            <p className="eyebrow">用户信息</p>
            <h1 className="create-title">{order.customerName}</h1>
            <dl>
              <dt>微信</dt>
              <dd>{order.wechatId}</dd>
              <dt>手机号</dt>
              <dd>{order.phone}</dd>
              <dt>收货地址</dt>
              <dd>{order.shippingAddress}</dd>
              <dt>用途</dt>
              <dd>{order.occasion || "未填写"}</dd>
              <dt>备注</dt>
              <dd>{order.userNote || "未填写"}</dd>
            </dl>
          </div>

          <div className="api-preview-panel">
            <span className="api-label">项目</span>
            <p>{project ? project.templateName : "项目已丢失"}</p>
            <code>{project?.generatedPrompt ?? ""}</code>
          </div>

          <StatusControls orderId={order.id} initialStatus={order.status} />
        </section>
      </section>
    </main>
  );
}

