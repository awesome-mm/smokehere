import type { Metadata } from "next";

import { AboutSection } from "@/components/home/about-section";
import { AppFeaturesSection } from "@/components/home/app-features-section";
import { FaqSection } from "@/components/home/faq-section";
import { HeroSection } from "@/components/home/hero-section";
import { QuitSupportBanner } from "@/components/home/quit-support-banner";
import { Reveal, RevealNoScriptFallback } from "@/components/home/reveal";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";

export const metadata: Metadata = {
  title: "SmokeHere — 전국 흡연구역 지도",
  description:
    "흡연구역 공공데이터를 한 장의 지도에 모았습니다. 가까운 흡연구역을 지역·역·건물 이름으로 찾아보세요.",
};

/*
 * 랜딩 페이지
 *
 * 기본은 서버 컴포넌트입니다. 상태가 필요한 곳만 클라이언트로 격리했습니다.
 *   - HeroSection : 검색어 입력
 *   - FaqSection  : 아코디언 열림 상태 (Radix)
 *   - Reveal      : IntersectionObserver
 * 헤더·소개·배너·앱 기능·푸터는 전부 서버에서 렌더됩니다.
 */
export default function MainHome() {
  return (
    <div className="flex flex-1 flex-col bg-surface-soft">
      <RevealNoScriptFallback />

      <a
        href="#main"
        className="sr-only rounded-sm bg-ink px-4 py-2 text-button-sm text-background focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
      >
        본문으로 건너뛰기
      </a>

      <SiteHeader current="home" />

      <main id="main" className="flex-1">
        {/* 첫 화면은 스크롤을 기다리지 않고 바로 재생합니다 */}
        <div className="animate-rise-in">
          <HeroSection />
        </div>

        <Reveal>
          <AboutSection />
        </Reveal>
        <Reveal>
          <QuitSupportBanner />
        </Reveal>
        <Reveal>
          <AppFeaturesSection />
        </Reveal>
        <Reveal>
          <FaqSection />
        </Reveal>
      </main>

      <SiteFooter />
    </div>
  );
}
