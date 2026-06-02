import Link from "next/link";
import { ORDER_STATUS_LABELS } from "@/domain/product";
import { getOrders } from "@/server/mockStore";

export default function AdminPage() {
  const orders = getOrders();

  return (
    <main className="app-shell">
      <section className="studio-frame preview-frame">
        <header className="topbar">
          <Link className="brand-lockup" href="/">
            <div className="brand-mark" aria-hidden="true">
              FS
            </div>
            <p className="brand-name">Admin</p>
          </Link>
          <div className="status-pill">{orders.length} orders</div>
        </header>

        <section className="admin-layout">
          <div>
            <p className="eyebrow">后台履约</p>
            <h1 className="create-title">订单列表</h1>
          </div>

          {orders.length === 0 ? (
            <div className="simple-state inline">
              <p>还没有订单草稿。先从前台提交一次，就会出现在这里。</p>
            </div>
          ) : (
            <div className="admin-list">
              {orders.map((order) => (
                <Link className="admin-row" href={`/admin/orders/${order.id}`} key={order.id}>
                  <span>{order.customerName}</span>
                  <span>{order.wechatId}</span>
                  <span>{ORDER_STATUS_LABELS[order.status]}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

