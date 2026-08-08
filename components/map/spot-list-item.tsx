"use client"

import type { SpotWithDistance } from "@/lib/map/filter"
import { cn } from "@/lib/utils"

/*
 * 목록 한 행
 *
 * 시안은 <div onClick>이라 키보드로 고를 수 없습니다. Home의 FAQ와 같은 문제라
 * 같은 방식으로 고쳤습니다 — 행 전체가 <button>입니다.
 *
 * 선택 상태는 aria-current="true"로 전달합니다. 목록에서 "지금 보고 있는 항목"을
 * 가리키는 용도라 aria-selected(선택 위젯)보다 이쪽이 맞습니다.
 */

/** 형태 배지의 색. brand는 텍스트를 얹지 않는 규약이라 배경은 항상 연한 면입니다. */
function kindBadgeClass(kind: SpotWithDistance["kind"]) {
  if (kind === "부스형") return "bg-surface-soft text-primary"
  if (kind === "실내형") return "bg-surface-soft text-ink"
  return "bg-surface-soft text-prose"
}

export function SpotListItem({
  spot,
  selected,
  onSelect,
}: {
  spot: SpotWithDistance
  selected: boolean
  onSelect: (id: number) => void
}) {
  return (
    <li>
      <button
        type="button"
        // 상세 패널을 닫을 때 이 항목으로 포커스를 되돌리기 위한 표식입니다
        data-spot-id={spot.id}
        aria-current={selected ? "true" : undefined}
        onClick={() => onSelect(spot.id)}
        className={cn(
          "w-full cursor-pointer border-b border-l-3 border-b-hairline px-5 py-4 text-left transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none",
          selected
            ? "border-l-primary bg-surface-soft"
            : "border-l-transparent hover:bg-surface-soft"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-title-md text-ink">{spot.name}</p>
            <p className="mt-1 truncate text-caption-sm text-muted-foreground">
              {spot.address}
            </p>
          </div>
          {/*
            "320m"만 읽히면 무엇의 거리인지 알 수 없습니다.
            화면에는 수치만 두고 보조기술에는 기준을 붙여 읽히게 합니다.
          */}
          <span className="shrink-0 text-caption-sm font-bold text-primary">
            <span aria-hidden="true">{spot.distanceLabel}</span>
            <span className="sr-only">기준 위치에서 {spot.distanceLabel}</span>
          </span>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span
            className={cn(
              "rounded-xs px-2 py-0.5 text-caption-sm font-bold",
              kindBadgeClass(spot.kind)
            )}
          >
            {spot.kind}
          </span>
          <span className="rounded-xs bg-surface-strong px-2 py-0.5 text-caption-sm text-prose">
            <span className="sr-only">운영 시간 </span>
            {spot.hours}
          </span>
        </div>
      </button>
    </li>
  )
}
