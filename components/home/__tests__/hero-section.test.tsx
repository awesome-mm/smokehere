import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { HeroSection } from "@/components/home/hero-section"

/*
 * 원본 시안은 검색어를 받아 놓고 버린 채 지도로 이동만 했습니다.
 * 이 테스트는 입력값이 실제로 지도 페이지에 전달되는지 고정합니다.
 * 경위: docs/design-import/sections/hero.md
 */

const push = vi.hoisted(() => vi.fn())

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}))

describe("HeroSection", () => {
  beforeEach(() => {
    push.mockClear()
  })

  it("검색 입력에 접근 가능한 이름이 있다", () => {
    render(<HeroSection />)

    expect(screen.getByRole("searchbox", { name: "흡연구역 검색" })).toBeInTheDocument()
  })

  it("검색어를 입력해 제출하면 지도로 검색어를 넘긴다", async () => {
    const user = userEvent.setup()
    render(<HeroSection />)

    await user.type(
      screen.getByRole("searchbox", { name: "흡연구역 검색" }),
      "강남역"
    )
    await user.click(screen.getByRole("button", { name: "검색" }))

    expect(push).toHaveBeenCalledWith(`/map?q=${encodeURIComponent("강남역")}`)
  })

  it("검색어가 비어 있으면 파라미터 없이 지도로 간다", async () => {
    const user = userEvent.setup()
    render(<HeroSection />)

    await user.click(screen.getByRole("button", { name: "검색" }))

    expect(push).toHaveBeenCalledWith("/map")
  })

  it("공백만 입력한 경우도 파라미터를 붙이지 않는다", async () => {
    const user = userEvent.setup()
    render(<HeroSection />)

    await user.type(screen.getByRole("searchbox", { name: "흡연구역 검색" }), "   ")
    await user.click(screen.getByRole("button", { name: "검색" }))

    expect(push).toHaveBeenCalledWith("/map")
  })

  it("인기 검색어가 같은 형식의 지도 링크로 연결된다", () => {
    render(<HeroSection />)

    expect(screen.getByRole("link", { name: "홍대입구" })).toHaveAttribute(
      "href",
      `/map?q=${encodeURIComponent("홍대입구")}`
    )
  })

  it("통계가 정의 목록으로 노출된다", () => {
    render(<HeroSection />)

    const term = screen.getByText("등록된 흡연구역")

    expect(term.tagName).toBe("DT")
    expect(screen.getByText("6,418").tagName).toBe("DD")
  })
})
