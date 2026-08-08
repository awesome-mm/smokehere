"use client"

import { LocateFixed } from "lucide-react"

import { SpotListItem } from "@/components/map/spot-list-item"
import type { SpotWithDistance } from "@/lib/map/filter"

/*
 * 결과 카운트 바 + 흡연구역 목록 + 빈 상태
 *
 * 지도가 없어도 이 목록만으로 기능이 성립해야 합니다. 이름·주소·거리·형태·
 * 운영시간이 전부 여기 있습니다.
 */

export type LocateStatus =
  | "idle"
  | "locating"
  | "located"
  | "denied"
  | "unsupported"

/** 위치 요청 결과를 화면에 그대로 알립니다. 조용히 실패하지 않기 위해서입니다. */
const LOCATE_MESSAGE: Record<LocateStatus, string | null> = {
  idle: null,
  locating: "현재 위치를 확인하는 중입니다.",
  located: "현재 위치를 기준으로 거리를 다시 계산했습니다.",
  denied: "위치 권한이 없어 서울 강남역을 기준으로 표시합니다.",
  unsupported: "이 브라우저는 위치 확인을 지원하지 않아 서울 강남역을 기준으로 표시합니다.",
}

export function SpotList({
  spots,
  selectedId,
  onSelect,
  onLocate,
  locateStatus,
}: {
  spots: SpotWithDistance[]
  selectedId: number | null
  onSelect: (id: number) => void
  onLocate: () => void
  locateStatus: LocateStatus
}) {
  const message = LOCATE_MESSAGE[locateStatus]

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        {/*
          필터를 바꾸면 개수가 바뀝니다. 화면을 못 보는 사용자에게도 결과가
          몇 건인지 전달돼야 하므로 aria-live로 알립니다.
        */}
        <p aria-live="polite" className="text-caption-sm text-muted-foreground">
          {spots.length}개 결과 · 가까운 순
        </p>
        <button
          type="button"
          onClick={onLocate}
          disabled={locateStatus === "locating"}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xs text-caption-sm font-bold text-primary transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:text-muted-soft"
        >
          <LocateFixed aria-hidden="true" className="size-3.5" />
          내 위치에서 찾기
        </button>
      </div>

      {message ? (
        <p
          role="status"
          className="border-b border-hairline bg-surface-soft px-5 py-2.5 text-caption-sm text-prose"
        >
          {message}
        </p>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {spots.length > 0 ? (
          <ul>
            {spots.map((spot) => (
              <SpotListItem
                key={spot.id}
                spot={spot}
                selected={spot.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </ul>
        ) : (
          <div className="px-6 py-16 text-center">
            <p className="text-title-md text-ink">검색 결과가 없습니다</p>
            <p className="mt-2.5 text-caption-sm text-muted-foreground">
              다른 검색어를 입력하거나 필터를 해제해 보세요.
              <br />
              해당 지역 데이터가 아직 수집되지 않았을 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
