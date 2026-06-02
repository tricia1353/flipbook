import Link from "next/link";

const productionSteps = ["上传/生成", "AI 处理", "45-60 帧", "微信确认"];

export default function HomePage() {
  return (
    <main className="app-shell">
      <section className="studio-frame" aria-label="AI Flipbook Studio 创作入口">
        <header className="topbar">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              FS
            </div>
            <p className="brand-name">AI Flipbook Studio</p>
          </div>
          <div className="status-pill">Pocket Gift MVP</div>
        </header>

        <div className="home-grid">
          <section className="entry-panel">
            <p className="eyebrow">移动端自助创作</p>
            <h1 className="headline">做一本会动的小礼物</h1>
            <p className="subcopy">
              上传自己的短视频，或者用本人/宠物参考图生成幻想短片。系统会把 3-5 秒画面整理成口袋翻页书预览，再提交给人工微信确认制作。
            </p>

            <div className="entry-actions" aria-label="选择创作方式">
              <Link className="entry-action primary" href="/create?mode=upload_video">
                <span>
                  <span className="entry-title">上传视频做翻页书</span>
                  <span className="entry-desc">保留真实动作，换 AI 背景或变成电影/动画风格。</span>
                </span>
                <span className="entry-arrow" aria-hidden="true">
                  →
                </span>
              </Link>

              <Link className="entry-action secondary" href="/create?mode=ai_generated_video">
                <span>
                  <span className="entry-title">AI 生成我的幻想翻页书</span>
                  <span className="entry-desc">上传本人、宝宝或宠物参考图，进入月球、森林或生日场景。</span>
                </span>
                <span className="entry-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>

            <div className="production-strip" aria-label="MVP 制作流程">
              {productionSteps.map((step) => (
                <span className="production-chip" key={step}>
                  {step}
                </span>
              ))}
            </div>
          </section>

          <aside className="preview-panel" aria-label="翻页书视觉预览">
            <div className="preview-stage">
              <div className="flipbook-object" aria-hidden="true">
                <div className="flip-page" />
                <div className="flip-page" />
                <div className="flip-page" />
                <div className="flip-cover">
                  <div className="frame-window">
                    <div className="frame-person" />
                  </div>
                  <h2 className="cover-title">Moon Run No. 01</h2>
                  <p className="cover-meta">
                    <span>3-5s</span>
                    <span>45-60 frames</span>
                    <span>WeChat confirm</span>
                  </p>
                </div>
              </div>

              <div className="preview-caption">
                <p className="caption-title">API-first 制作线</p>
                <p className="caption-copy">
                  页面只负责收集选择和展示进度；项目创建、AI 生成、订单提交、后台状态和打印任务都通过 API 接口处理。
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

