import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "../styles/globals.css";

// Airbnb Cereal VF는 유료 라이선스라 가장 가까운 오픈소스 대체인 Inter를 씁니다
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "smokehere",
  description: "Find a smoking area near you.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
