"use client"

import { useId } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

/*
 * 사이드바 검색 입력
 *
 * 지도 페이지의 검색은 입력할 때마다 목록이 걸러집니다. 제출 버튼이 없으므로
 * <form>이 아니라 role="search" 영역으로 감쌉니다.
 *
 * 시안은 아이콘 자리를 빈 <div>에 테두리만 둘러 원을 그렸습니다.
 * 프로젝트 아이콘 세트인 lucide로 바꿨습니다.
 */

export function MapSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const inputId = useId()

  return (
    <div role="search" className="relative">
      <label htmlFor={inputId} className="sr-only">
        흡연구역 검색
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="지역, 역, 건물 이름으로 검색"
        className="bg-surface-soft pl-11 focus-visible:bg-background"
      />
    </div>
  )
}
