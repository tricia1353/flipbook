"use client";

import { useState, type FormEvent } from "react";

type OrderFormProps = {
  projectId: string;
};

type SubmitResult = {
  orderId?: string;
  adminUrl?: string;
  error?: string;
  errors?: Record<string, string>;
};

export function OrderForm({ projectId }: OrderFormProps) {
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
        customerName: form.get("customerName"),
        wechatId: form.get("wechatId"),
        phone: form.get("phone"),
        shippingAddress: form.get("shippingAddress"),
        occasion: form.get("occasion"),
        userNote: form.get("userNote"),
      }),
    });

    setResult((await response.json()) as SubmitResult);
    setIsSubmitting(false);
  }

  if (result?.orderId) {
    return (
      <div className="success-panel">
        <p className="eyebrow">提交成功</p>
        <h2>我们会通过微信联系你</h2>
        <p>订单草稿号：{result.orderId}</p>
        {result.adminUrl ? <a href={result.adminUrl}>去后台查看</a> : null}
      </div>
    );
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <label className="prompt-field">
        <span>称呼</span>
        <input name="customerName" placeholder="例如 小王" />
      </label>
      <label className="prompt-field">
        <span>微信号</span>
        <input name="wechatId" placeholder="方便人工确认效果" />
      </label>
      <label className="prompt-field">
        <span>手机号</span>
        <input name="phone" placeholder="用于制作沟通" />
      </label>
      <label className="prompt-field">
        <span>收货地址</span>
        <input name="shippingAddress" placeholder="省市区和详细地址" />
      </label>
      <label className="prompt-field">
        <span>用途</span>
        <input name="occasion" placeholder="生日、纪念日、宠物礼物..." />
      </label>
      <label className="prompt-field">
        <span>备注</span>
        <textarea name="userNote" placeholder="想特别强调的效果或制作要求" />
      </label>

      {result?.error ? <p className="form-error">{result.error}</p> : null}
      {result?.errors
        ? Object.values(result.errors).map((error) => (
            <p className="form-error" key={error}>
              {error}
            </p>
          ))
        : null}

      <button className="entry-action compact primary" type="submit" disabled={isSubmitting}>
        <span>
          <span className="entry-title">{isSubmitting ? "正在提交" : "提交订单草稿"}</span>
          <span className="entry-desc">不在线支付，人工微信确认后再制作。</span>
        </span>
        <span className="entry-arrow" aria-hidden="true">
          →
        </span>
      </button>
    </form>
  );
}

