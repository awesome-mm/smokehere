"use client"

import { useId } from "react"

import { CITY_OPTIONS, type CityOption } from "@/lib/map/spots"

/*
 * 도시 필터 — 하나만 고를 수 있습니다
 *
 * 겉모습은 칩이지만 동작은 라디오 버튼입니다. 그래서 <button aria-pressed>가
 * 아니라 **감춘 네이티브 라디오 + 라벨**로 만들었습니다.
 *   - 그룹 의미(fieldset/legend)와 "여럿 중 하나"라는 관계가 마크업에 드러납니다
 *   - 좌우 방향키 이동, 그룹 단위 탭 정지 같은 키보드 동작을 브라우저가 줍니다
 *     (role="radiogroup"을 직접 쓰면 roving tabindex를 손으로 구현해야 합니다)
 *
 * 선택 상태를 색으로만 전달하지 않도록, 배경/글자 밝기를 반전시켜 명도
 * 차이로도 구분되게 했습니다. 스크린리더에는 라디오의 checked가 전달됩니다.
 */

export function CityFilter({
  value,
  onChange,
}: {
  value: CityOption
  onChange: (city: CityOption) => void
}) {
  const groupName = useId()

  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">도시 선택</legend>
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {CITY_OPTIONS.map((city) => (
          <label key={city} className="shrink-0 cursor-pointer">
            <input
              type="radio"
              name={groupName}
              value={city}
              checked={value === city}
              onChange={() => onChange(city)}
              className="peer sr-only"
            />
            <span className="inline-flex min-h-11 items-center rounded-full border border-control bg-background px-3.5 text-caption-sm text-prose transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background">
              {city}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
