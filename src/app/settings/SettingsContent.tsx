"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function SettingsContent() {
  const [apiKey, setApiKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // 从 localStorage 加载
  useEffect(() => {
    const saved = localStorage.getItem("zhipu_api_key");
    if (saved) {
      setApiKey(saved);
    }
  }, []);

  // 保存到 localStorage
  function handleSave() {
    localStorage.setItem("zhipu_api_key", apiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  }

  function handleClear() {
    setApiKey("");
    localStorage.removeItem("zhipu_api_key");
  }

  return (
    <main className="app-shell">
      <section className="studio-frame settings-frame" aria-label="设置">
        <header className="topbar">
          <Link className="brand-lockup" href="/">
            <div className="brand-mark" aria-hidden="true">
              FS
            </div>
            <p className="brand-name">AI Flipbook Studio</p>
          </Link>
          <div className="status-pill">Settings</div>
        </header>

        <div className="settings-layout">
          <aside className="settings-rail">
            <p className="eyebrow">Settings</p>
            <h1 className="create-title">配置</h1>
            <p className="subcopy">
              配置 AI 服务的 API 密钥，用于生成封面等功能
            </p>

            <nav className="settings-nav">
              <Link className="settings-nav-item active" href="/settings">
                API 设置
              </Link>
            </nav>
          </aside>

          <section className="settings-workspace">
            <div className="settings-section">
              <div className="settings-section-header">
                <h2 className="workspace-title">智谱 AI API</h2>
                <a
                  href="https://open.bigmodel.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="settings-link"
                >
                  获取 API Key →
                </a>
              </div>

              <div className="settings-card">
                <label className="prompt-field">
                  <span>API Key</span>
                  <input
                    type="password"
                    placeholder="在此输入智谱 API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </label>

                <p className="settings-help">
                  API Key 将保存在浏览器本地，不会发送到服务器。新用户可免费获取一定额度。
                </p>

                <div className="settings-actions">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="settings-save-btn"
                  >
                    {isSaved ? "✓ 已保存" : "保存配置"}
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="settings-clear-btn"
                  >
                    清除
                  </button>
                </div>

                {isSaved && (
                  <div className="settings-success">
                    配置已保存到本地存储
                  </div>
                )}
              </div>

              <div className="settings-info">
                <h3>关于智谱 AI</h3>
                <p>
                  智谱清言提供 GLM-4V（多模态）和 CogView-3（图像生成）服务，用于分析视频内容和生成精美封面。
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}