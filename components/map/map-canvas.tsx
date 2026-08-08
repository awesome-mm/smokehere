import { Map as MapIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/*
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  여기가 실제 지도가 들어올 자리입니다. 지금은 회색 자리표시자입니다.      │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * 아직 지도를 붙이지 않은 이유
 *   퍼블리싱과 목록·필터·상세 기능이 먼저 연결돼야 지도에 무엇을 그릴지가
 *   정해집니다. 지도 연동은 그 뒤 **마지막 단계**로 진행합니다.
 *
 * 이번 범위에서 의도적으로 넣지 않은 것 (삭제가 아니라 보류)
 *   - Google Maps JavaScript API와 API 키 (시안의 키 입력 모달, localStorage 저장)
 *   - Leaflet + CARTO 타일 레이어 (시안의 키 없는 기본 지도)
 *   - 마커·툴팁·fitBounds·ResizeObserver
 *   - 지도 관련 npm 패키지 일체
 *
 * 지도를 붙일 때 손댈 지점
 *   1. 이 컴포넌트의 자리표시자를 실제 지도 컨테이너로 교체
 *   2. `lib/map/spots.ts`의 CITY_CENTERS를 초기 뷰포트로 사용
 *   3. `selectedId`와 마커 선택 상태를 양방향으로 연결
 *   4. 지도 없이도 목록만으로 기능이 성립하는 현재 구조를 깨지 않을 것
 *
 * 자리표시자는 `data-map-placeholder` 속성으로 식별할 수 있습니다.
 */

export function MapCanvas({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      data-map-placeholder="true"
      className={cn(
        "relative min-w-0 flex-1 overflow-hidden bg-surface-strong",
        className
      )}
    >
      {/*
        자리표시자 안내. 실제 지도인 것처럼 보이면 안 되므로 "준비 중"임을
        명시합니다. aria-hidden을 걸지 않는 이유는, 지도가 없다는 사실 자체가
        사용자에게 전달돼야 할 정보이기 때문입니다.
      */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <MapIcon
          aria-hidden="true"
          className="size-8 text-muted-foreground"
          strokeWidth={1.5}
        />
        <p className="text-title-md text-muted-foreground">
          지도는 준비 중입니다
        </p>
        <p className="max-w-xs text-body-sm text-muted-foreground">
          왼쪽 목록에서 흡연구역을 찾아보세요. 위치와 상세 정보는 모두 목록에서
          확인할 수 있습니다.
        </p>
      </div>

      {children}
    </div>
  )
}
