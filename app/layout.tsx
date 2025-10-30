import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "학생-교사 플랫폼",
  description: "학생과 교사를 위한 웹 애플리케이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
