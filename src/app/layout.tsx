import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Flipbook Studio",
  description: "把一段回忆或幻想场景做成会动的口袋翻页书礼物。",
  applicationName: "AI Flipbook Studio",
  appleWebApp: {
    capable: true,
    title: "Flipbook Studio",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f4ef",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

