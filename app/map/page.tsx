import type { Metadata } from "next";

import { MapView } from "@/components/map/map-view";
import { SiteHeader } from "@/components/home/site-header";

export const metadata: Metadata = {
  title: "흡연구역 지도 — SmokeHere",
  description:
    "지역·역·건물 이름으로 가까운 흡연구역을 찾아보세요. 형태와 운영 시간, 관리 주체까지 확인할 수 있습니다.",
};

/*
 * 흡연구역 지도 페이지
 *
 * 검색어를 `useSearchParams`가 아니라 서버의 `searchParams` prop으로 읽습니다.
 * 이유: `useSearchParams`는 프리렌더 라우트에서 Suspense 경계 아래 전체를
 * 클라이언트 렌더로 돌립니다. 그러면 흡연구역 목록이 초기 HTML에서 통째로
 * 빠져 JS가 실행되기 전에는 아무 내용도 없습니다.
 *
 * 대신 이 라우트는 정적 프리렌더가 아니라 요청 시 렌더가 됩니다. 데이터가
 * 정적 import라 비용은 낮고, 목록이 HTML에 담기는 쪽의 이득이 더 큽니다.
 *
 * 지도 자리는 아직 회색 자리표시자입니다 — components/map/map-canvas.tsx 참고.
 */
export default async function MapPage({
  searchParams,
}: PageProps<"/map">) {
  const { q } = await searchParams;
  const initialQuery = typeof q === "string" ? q.trim() : "";

  return (
    /*
      h-dvh로 **확정 높이**를 줍니다. 루트 레이아웃의 body는 min-h-full이라
      최소 높이만 있고 확정 높이가 없어서, flex-1 + min-h-0만으로는 자식이
      콘텐츠만큼 늘어나 페이지 전체가 스크롤됩니다(목록 내부 스크롤이 죽습니다).
    */
    <div className="flex h-dvh flex-col overflow-hidden">
      {/* 시안에는 제목이 없지만 페이지마다 h1이 하나는 있어야 합니다 */}
      <h1 className="sr-only">흡연구역 지도</h1>

      <SiteHeader current="map" />

      <MapView initialQuery={initialQuery} />
    </div>
  );
}
