"use client";

import { useState } from "react";
import { ORDER_STATUS_LABELS } from "@/domain/product";
import type { OrderStatus } from "@/domain/types";

const NEXT_STATUSES: OrderStatus[] = ["contacted", "paid", "in_production", "shipped", "cancelled"];

type StatusControlsProps = {
  orderId: string;
  initialStatus: OrderStatus;
};

export function StatusControls({ orderId, initialStatus }: StatusControlsProps) {
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState("");

  async function updateStatus(nextStatus: OrderStatus) {
    setMessage("更新中...");
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!response.ok) {
      setMessage("更新失败，请重试。");
      return;
    }

    setStatus(nextStatus);
    setMessage(`已更新为：${ORDER_STATUS_LABELS[nextStatus]}`);
  }

  return (
    <div className="status-controls">
      <p>当前状态：{ORDER_STATUS_LABELS[status]}</p>
      <div>
        {NEXT_STATUSES.map((nextStatus) => (
          <button type="button" key={nextStatus} onClick={() => updateStatus(nextStatus)}>
            {ORDER_STATUS_LABELS[nextStatus]}
          </button>
        ))}
      </div>
      {message ? <span>{message}</span> : null}
    </div>
  );
}

