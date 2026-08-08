"use client"

import { Check } from "lucide-react"

import { SPOT_KINDS, type SpotKind } from "@/lib/map/spots"

/*
 * 형태 필터 — 여러 개를 함께 고를 수 있습니다
 *
 * 도시 필터와 동작이 달라 마크업도 다릅니다. 이쪽은 다중 선택이라 체크박스입니다.
 * 겉모습만 같은 칩으로 두면 사용자는 둘 다 같은 규칙이라고 오해합니다.
 *
 * 시안은 선택 상태를 **색으로만** 표시합니다(brand 테두리 + 틴트 배경).
 * 색각 이상 사용자에게는 구분되지 않으므로 체크 아이콘을 함께 넣었습니다.
 */

export function KindFilter({
  value,
  onChange,
}: {
  value: readonly SpotKind[]
  onChange: (kinds: SpotKind[]) => void
}) {
  function toggle(kind: SpotKind) {
    onChange(
      value.includes(kind)
        ? value.filter((item) => item !== kind)
        : [...value, kind]
    )
  }

  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">흡연구역 형태</legend>
      <div className="flex flex-wrap gap-1.5">
        {SPOT_KINDS.map((kind) => (
          <label key={kind} className="cursor-pointer">
            <input
              type="checkbox"
              checked={value.includes(kind)}
              onChange={() => toggle(kind)}
              className="peer sr-only"
            />
            <span className="inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-hairline bg-background px-3 text-caption-sm text-muted-foreground transition-colors peer-checked:border-primary peer-checked:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background [&>svg]:hidden peer-checked:[&>svg]:block">
              <Check aria-hidden="true" className="size-3.5" />
              {kind}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
