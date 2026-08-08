import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Input } from "@/components/ui/input"

describe("Input", () => {
  it("label의 htmlFor로 접근 가능한 이름이 연결된다", () => {
    render(
      <>
        <label className="text-caption" htmlFor="place">
          장소 이름
        </label>
        <Input id="place" />
      </>
    )

    expect(screen.getByLabelText("장소 이름")).toBeInTheDocument()
  })

  it("타이핑한 값이 반영되고 onChange가 호출된다", async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Input aria-label="검색어" onChange={handleChange} />)

    const input = screen.getByRole("textbox", { name: "검색어" })
    await user.type(input, "강남역")

    expect(input).toHaveValue("강남역")
    expect(handleChange).toHaveBeenCalled()
  })

  it("높이 48px와 8px 라운딩을 쓴다", () => {
    // 버튼 default와 같은 리듬 — 디자인 가이드의 라운딩 표 기준
    render(<Input aria-label="검색어" />)

    const input = screen.getByRole("textbox")
    expect(input).toHaveClass("h-12")
    expect(input).toHaveClass("rounded-sm")
  })

  it("본문 크기를 16px로 고정해 iOS 자동 확대를 막는다", () => {
    render(<Input aria-label="검색어" />)

    const input = screen.getByRole("textbox")
    expect(input).toHaveClass("text-body-md")
    // shadcn 기본값의 md:text-sm 축소는 제거돼 있어야 합니다
    expect(input.className).not.toMatch(/md:text-sm/)
  })

  it("포커스를 받으면 ink 테두리와 offset 링이 걸린다", async () => {
    const user = userEvent.setup()
    render(<Input aria-label="검색어" />)

    const input = screen.getByRole("textbox")
    await user.click(input)

    expect(input).toHaveFocus()
    // WCAG 2.4.11 — 키보드 포커스가 흰 캔버스에서도 보여야 합니다
    expect(input).toHaveClass("focus-visible:border-ink")
    expect(input).toHaveClass("focus-visible:ring-2")
    expect(input).toHaveClass("focus-visible:ring-offset-2")
  })

  it("비활성 상태에서는 입력을 받지 않고 cursor-not-allowed가 붙는다", async () => {
    const user = userEvent.setup()
    render(<Input aria-label="검색어" disabled />)

    const input = screen.getByRole("textbox")
    expect(input).toBeDisabled()
    expect(input).toHaveClass("disabled:cursor-not-allowed")

    await user.type(input, "강남역")
    expect(input).toHaveValue("")
  })

  it("읽기 전용은 값을 보여 주되 편집되지 않는다", async () => {
    const user = userEvent.setup()
    render(<Input aria-label="주소" readOnly defaultValue="서울시 강남구" />)

    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("readonly")
    expect(input).toHaveClass("read-only:cursor-default")

    await user.type(input, "변경")
    expect(input).toHaveValue("서울시 강남구")
  })

  it("aria-invalid일 때 테두리와 링을 함께 바꾼다", () => {
    // 색상 하나에만 기대지 않도록 형태(테두리)와 면적(링)을 같이 씁니다 (WCAG 1.4.1)
    render(<Input aria-label="검색어" aria-invalid />)

    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input).toHaveClass("aria-invalid:border-destructive")
    expect(input).toHaveClass("aria-invalid:ring-2")
  })

  it("aria-describedby로 에러 메시지를 연결할 수 있다", () => {
    render(
      <>
        <Input aria-label="검색어" aria-invalid aria-describedby="search-error" />
        <p id="search-error">검색어를 입력해 주세요</p>
      </>
    )

    const input = screen.getByRole("textbox")
    expect(input).toHaveAccessibleDescription("검색어를 입력해 주세요")
  })

  it("type을 그대로 전달한다", () => {
    render(<Input aria-label="비밀번호" type="password" />)

    // password는 textbox 역할이 아니라서 role 쿼리가 통하지 않습니다
    expect(screen.getByLabelText("비밀번호")).toHaveAttribute("type", "password")
  })

  it("placeholder는 비활성 톤을 쓴다", () => {
    render(<Input aria-label="검색어" placeholder="지역이나 장소를 검색하세요" />)

    const input = screen.getByPlaceholderText("지역이나 장소를 검색하세요")
    // muted-soft는 3.11:1이라 읽혀야 하는 값이 아닌 힌트 전용입니다
    expect(input).toHaveClass("placeholder:text-muted-soft")
  })

  it("전달한 className이 기본 클래스와 병합된다", () => {
    render(<Input aria-label="검색어" className="max-w-sm" />)

    const input = screen.getByRole("textbox")
    expect(input).toHaveClass("max-w-sm")
    expect(input).toHaveClass("h-12")
  })
})
