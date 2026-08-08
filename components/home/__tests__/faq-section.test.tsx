import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { FaqSection } from "@/components/home/faq-section"

/*
 * 원본 시안의 FAQ는 <div onClick>으로 토글해 키보드로 열 수 없었습니다.
 * 이 테스트는 그 회귀를 막습니다 — 질문이 버튼이어야 하고, 키보드로 조작되며,
 * 열림 상태가 aria-expanded로 전달되어야 합니다.
 * 경위: docs/design-import/sections/faq.md
 */

const FIRST = "데이터는 어디서 가져오나요?"
const SECOND = "전국 데이터는 언제 추가되나요?"

describe("FaqSection", () => {
  it("질문이 버튼으로 렌더된다", () => {
    render(<FaqSection />)

    expect(screen.getAllByRole("button")).toHaveLength(4)
    expect(screen.getByRole("button", { name: FIRST })).toBeInTheDocument()
  })

  it("첫 항목만 열린 채 시작한다", () => {
    render(<FaqSection />)

    expect(screen.getByRole("button", { name: FIRST })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    expect(screen.getByRole("button", { name: SECOND })).toHaveAttribute(
      "aria-expanded",
      "false"
    )
  })

  it("열린 항목을 다시 눌러 닫을 수 있다", async () => {
    const user = userEvent.setup()
    render(<FaqSection />)

    const first = screen.getByRole("button", { name: FIRST })
    await user.click(first)

    expect(first).toHaveAttribute("aria-expanded", "false")
  })

  it("다른 항목을 열면 먼저 열려 있던 항목이 닫힌다", async () => {
    const user = userEvent.setup()
    render(<FaqSection />)

    await user.click(screen.getByRole("button", { name: SECOND }))

    expect(screen.getByRole("button", { name: SECOND })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    expect(screen.getByRole("button", { name: FIRST })).toHaveAttribute(
      "aria-expanded",
      "false"
    )
  })

  it("키보드만으로 열고 닫을 수 있다", async () => {
    const user = userEvent.setup()
    render(<FaqSection />)

    const second = screen.getByRole("button", { name: SECOND })
    second.focus()
    await user.keyboard("{Enter}")

    expect(second).toHaveAttribute("aria-expanded", "true")

    await user.keyboard(" ")

    expect(second).toHaveAttribute("aria-expanded", "false")
  })

  it("열린 항목의 답변이 region으로 노출된다", () => {
    render(<FaqSection />)

    const panel = screen.getByRole("region", { name: FIRST })

    expect(panel).toHaveTextContent("서울열린데이터광장")
  })

  it("문의 이메일이 mailto 링크다", () => {
    render(<FaqSection />)

    expect(
      screen.getByRole("link", { name: "smoke@smokehere.kr" })
    ).toHaveAttribute("href", "mailto:smoke@smokehere.kr")
  })
})
