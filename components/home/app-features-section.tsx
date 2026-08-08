import {
  BadgeCheck,
  Bookmark,
  Download,
  MapPin,
  Megaphone,
  Search,
  type LucideIcon,
} from "lucide-react"

import { SectionShell } from "@/components/home/section-shell"

/*
 * 앱 기능 소개 카드 6개
 *
 * 원본은 Material Symbols 이름(LocationOn, GetApp, Verified, Campaign)을 쓰고
 * 제목과 본문을 <br>로 이은 한 덩어리 텍스트로 둡니다.
 * 실제로는 목록이라 <ul>/<li>로 구조화하고 제목·본문을 분리했습니다.
 */

const APP_FEATURES: {
  icon: LucideIcon
  title: string
  body: string
}[] = [
  { icon: MapPin, title: "열자마자 반경 500m", body: "가까운 순으로 보여줘요" },
  { icon: Bookmark, title: "자주 가는 곳 저장", body: "검색 없이 한 번에 열려요" },
  { icon: Download, title: "오프라인에서도", body: "마지막 지역은 그대로" },
  { icon: Search, title: "역·건물 이름으로", body: "주소를 몰라도 찾아요" },
  { icon: BadgeCheck, title: "지자체 공식 데이터", body: "매주 갱신합니다" },
  { icon: Megaphone, title: "잘못된 정보 제보", body: "확인 후 지도에 반영해요" },
]

export function AppFeaturesSection() {
  return (
    <SectionShell bordered surface="page" labelledBy="app-features-title">
      <p className="text-eyebrow text-primary uppercase">GET THE APP</p>
      {/* 시안의 <br> 위치를 지킵니다 (주머니 속에서 더 빠르게 / 가까운 …) */}
      <h2
        id="app-features-title"
        className="mt-4 max-w-2xl text-section-lg text-ink"
      >
        빠르게
        <br />
        가까운 흡연구역을 찾아요
      </h2>
      <p className="mt-5 text-lede text-muted-foreground">
        위치 권한만 허용하면 나머지는 앱이 알아서 합니다
      </p>

      <ul className="mt-13 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {APP_FEATURES.map(({ icon: Icon, title, body }) => (
          <li
            key={title}
            className="flex flex-col items-center gap-2.5 rounded-md border border-hairline bg-surface-soft p-4 text-center sm:flex-row sm:items-start sm:gap-4 sm:p-6 sm:text-left"
          >
            <Icon
              aria-hidden="true"
              className="size-7 shrink-0 text-primary"
              strokeWidth={1.75}
            />
            <div>
              <p className="text-title-md text-ink">{title}</p>
              <p className="mt-1 text-body-md text-muted-foreground">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </SectionShell>
  )
}
