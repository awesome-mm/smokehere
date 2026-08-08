import { useState } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { CityFilter } from "@/components/map/city-filter"
import { KindFilter } from "@/components/map/kind-filter"
import { MapSearch } from "@/components/map/map-search"
import type { SpotKind } from "@/lib/map/spots"

/*
 * 두 필터는 겉모습이 같은 칩이지만 동작이 다릅니다 — 도시는 단일 선택,
 * 형태는 다중 선택. 마크업이 그 차이를 담고 있는지 고정합니다.
 * 경위: docs/design-import/map/sidebar-filters.md
 */

function ControlledKindFilter() {
  const [kinds, setKinds] = useState<SpotKind[]>([])
  return <KindFilter value={kinds} onChange={setKinds} />
}

describe("MapSearch", () => {
  it("접근 가능한 이름을 가진 검색 입력이다", () => {
    render(<MapSearch value="" onChange={vi.fn()} />)

    expect(
      screen.getByRole("searchbox", { name: "흡연구역 검색" })
    ).toBeInTheDocument()
  })

  it("입력할 때마다 값을 올려보낸다", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<MapSearch value="" onChange={onChange} />)

    await user.type(screen.getByRole("searchbox"), "강남")

    expect(onChange).toHaveBeenCalled()
  })
})

describe("CityFilter", () => {
  it("단일 선택이므로 라디오로 노출된다", () => {
    render(<CityFilter value="서울" onChange={vi.fn()} />)

    expect(screen.getAllByRole("radio")).toHaveLength(5)
    expect(screen.getByRole("radio", { name: "서울" })).toBeChecked()
    expect(screen.getByRole("radio", { name: "부산" })).not.toBeChecked()
  })

  it("그룹에 이름이 있다", () => {
    render(<CityFilter value="전체" onChange={vi.fn()} />)

    expect(screen.getByRole("group", { name: "도시 선택" })).toBeInTheDocument()
  })

  it("선택하면 그 도시를 올려보낸다", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CityFilter value="서울" onChange={onChange} />)

    await user.click(screen.getByRole("radio", { name: "부산" }))

    expect(onChange).toHaveBeenCalledWith("부산")
  })
})

describe("KindFilter", () => {
  it("다중 선택이므로 체크박스로 노출된다", () => {
    render(<KindFilter value={["부스형"]} onChange={vi.fn()} />)

    expect(screen.getAllByRole("checkbox")).toHaveLength(3)
    expect(screen.getByRole("checkbox", { name: "부스형" })).toBeChecked()
    expect(screen.getByRole("checkbox", { name: "개방형" })).not.toBeChecked()
  })

  it("여러 개를 함께 선택할 수 있다", async () => {
    const user = userEvent.setup()
    render(<ControlledKindFilter />)

    await user.click(screen.getByRole("checkbox", { name: "부스형" }))
    await user.click(screen.getByRole("checkbox", { name: "실내형" }))

    expect(screen.getByRole("checkbox", { name: "부스형" })).toBeChecked()
    expect(screen.getByRole("checkbox", { name: "실내형" })).toBeChecked()
    expect(screen.getByRole("checkbox", { name: "개방형" })).not.toBeChecked()
  })

  it("다시 누르면 해제된다", async () => {
    const user = userEvent.setup()
    render(<ControlledKindFilter />)

    const 부스형 = screen.getByRole("checkbox", { name: "부스형" })
    await user.click(부스형)
    await user.click(부스형)

    expect(부스형).not.toBeChecked()
  })

  it("키보드만으로 토글할 수 있다", async () => {
    const user = userEvent.setup()
    render(<ControlledKindFilter />)

    const 개방형 = screen.getByRole("checkbox", { name: "개방형" })
    개방형.focus()
    await user.keyboard(" ")

    expect(개방형).toBeChecked()
  })
})
