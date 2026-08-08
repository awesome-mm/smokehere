import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("라벨을 가진 button 역할로 렌더링된다", () => {
    render(<Button>가까운 흡연구역 찾기</Button>)

    expect(
      screen.getByRole("button", { name: "가까운 흡연구역 찾기" })
    ).toBeInTheDocument()
  })

  it("기본값은 default variant / default size다", () => {
    render(<Button>기본</Button>)

    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("data-variant", "default")
    expect(button).toHaveAttribute("data-size", "default")
    // 48px — 디자인 가이드가 정한 기본 CTA 높이(터치 타깃 44px 초과)
    expect(button).toHaveClass("h-12")
  })

  it.each([
    ["outline", "outline"],
    ["secondary", "secondary"],
    ["ghost", "ghost"],
    ["destructive", "destructive"],
    ["link", "link"],
  ] as const)("variant %s가 data-variant에 반영된다", (variant, expected) => {
    render(<Button variant={variant}>액션</Button>)

    expect(screen.getByRole("button")).toHaveAttribute("data-variant", expected)
  })

  it("size가 높이 클래스로 이어진다", () => {
    const { rerender } = render(<Button size="lg">히어로</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-14")

    rerender(<Button size="sm">보조</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-10")

    rerender(<Button size="xs">툴바</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-8")
  })

  it("라운딩은 기본 8px이고 pill일 때만 완전 원형이 된다", () => {
    const { rerender } = render(<Button>필터</Button>)
    expect(screen.getByRole("button")).toHaveClass("rounded-sm")

    rerender(<Button pill>필터</Button>)
    expect(screen.getByRole("button")).toHaveClass("rounded-full")
  })

  it("클릭하면 핸들러가 호출된다", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>저장</Button>)

    await user.click(screen.getByRole("button"))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("비활성 상태에서는 클릭 핸들러가 호출되지 않는다", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <Button disabled onClick={handleClick}>
        저장
      </Button>
    )

    const button = screen.getByRole("button")
    expect(button).toBeDisabled()

    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it("비활성 버튼에 cursor-not-allowed가 붙는다", () => {
    // 디자인 가이드 접근성 체크리스트: 클릭 가능 요소는 cursor-pointer,
    // 비활성은 cursor-not-allowed로 상태를 커서로도 알려야 합니다
    render(<Button disabled>저장</Button>)

    const button = screen.getByRole("button")
    expect(button).toHaveClass("cursor-pointer")
    expect(button).toHaveClass("disabled:cursor-not-allowed")
  })

  it("키보드로 포커스를 받고 Enter로 활성화된다", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>확인</Button>)

    await user.tab()

    expect(screen.getByRole("button")).toHaveFocus()

    await user.keyboard("{Enter}")
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("asChild로 링크에 버튼 스타일을 위임할 수 있다", () => {
    render(
      <Button asChild>
        <a href="/map">지도 보기</a>
      </Button>
    )

    const link = screen.getByRole("link", { name: "지도 보기" })
    expect(link).toHaveAttribute("href", "/map")
    expect(link).toHaveClass("rounded-sm")
    // button 요소로 중복 렌더링되지 않아야 합니다
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("아이콘 단독 버튼은 aria-label로 접근 가능한 이름을 갖는다", () => {
    render(
      <Button size="icon" aria-label="현재 위치로 이동">
        <svg aria-hidden="true" />
      </Button>
    )

    expect(
      screen.getByRole("button", { name: "현재 위치로 이동" })
    ).toBeInTheDocument()
  })

  it("전달한 className이 기본 클래스와 병합된다", () => {
    render(<Button className="w-full">전체 폭</Button>)

    const button = screen.getByRole("button")
    expect(button).toHaveClass("w-full")
    expect(button).toHaveClass("h-12")
  })

  it("타이포 토큰과 색상 토큰이 서로를 지우지 않는다", () => {
    // 회귀 방지: tailwind-merge가 text-button-md를 색상으로 오인하면
    // text-primary-foreground와 같은 그룹이 돼 하나가 사라집니다 (lib/utils.ts 참고)
    render(<Button>가까운 흡연구역 찾기</Button>)

    const button = screen.getByRole("button")
    expect(button).toHaveClass("text-button-md")
    expect(button).toHaveClass("text-primary-foreground")
  })

  it("className으로 타이포 크기만 덮어써도 색상은 유지된다", () => {
    render(<Button className="text-button-sm">작은 라벨</Button>)

    const button = screen.getByRole("button")
    expect(button).toHaveClass("text-button-sm")
    expect(button).not.toHaveClass("text-button-md")
    expect(button).toHaveClass("text-primary-foreground")
  })
})
