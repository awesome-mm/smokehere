import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

/** 테스트마다 반복되는 3탭 구성을 한곳에 모읍니다 */
function renderTabs(
  props: React.ComponentProps<typeof Tabs> = {},
  listProps: React.ComponentProps<typeof TabsList> = {}
) {
  return render(
    <Tabs defaultValue="near" {...props}>
      <TabsList {...listProps}>
        <TabsTrigger value="near">가까운 순</TabsTrigger>
        <TabsTrigger value="rating">평점 순</TabsTrigger>
        <TabsTrigger value="saved" disabled>
          저장됨
        </TabsTrigger>
      </TabsList>
      <TabsContent value="near">가까운 흡연구역 목록</TabsContent>
      <TabsContent value="rating">평점 높은 흡연구역 목록</TabsContent>
      <TabsContent value="saved">저장한 흡연구역 목록</TabsContent>
    </Tabs>
  )
}

describe("Tabs", () => {
  it("tablist와 tab 역할로 렌더링된다", () => {
    renderTabs()

    expect(screen.getByRole("tablist")).toBeInTheDocument()
    expect(screen.getAllByRole("tab")).toHaveLength(3)
  })

  it("defaultValue에 해당하는 탭만 선택되고 그 패널만 보인다", () => {
    renderTabs()

    expect(screen.getByRole("tab", { name: "가까운 순" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    expect(screen.getByRole("tab", { name: "평점 순" })).toHaveAttribute(
      "aria-selected",
      "false"
    )

    // 선택되지 않은 패널은 DOM에서 언마운트됩니다
    expect(screen.getByRole("tabpanel")).toHaveTextContent("가까운 흡연구역 목록")
    expect(screen.queryByText("평점 높은 흡연구역 목록")).not.toBeInTheDocument()
  })

  it("탭을 클릭하면 해당 패널로 전환된다", async () => {
    const user = userEvent.setup()
    renderTabs()

    await user.click(screen.getByRole("tab", { name: "평점 순" }))

    expect(screen.getByRole("tab", { name: "평점 순" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "평점 높은 흡연구역 목록"
    )
  })

  it("탭과 패널이 aria-controls / aria-labelledby로 서로 연결된다", () => {
    renderTabs()

    const selectedTab = screen.getByRole("tab", { name: "가까운 순" })
    const panel = screen.getByRole("tabpanel")

    expect(selectedTab).toHaveAttribute("aria-controls", panel.id)
    expect(panel).toHaveAttribute("aria-labelledby", selectedTab.id)
  })

  it("tablist는 포커스를 하나만 받는다 (roving tabindex)", async () => {
    const user = userEvent.setup()
    renderTabs()

    await user.tab()

    // 선택된 탭만 tabIndex 0, 나머지는 -1이라 Tab 한 번에 바로 잡힙니다
    expect(screen.getByRole("tab", { name: "가까운 순" })).toHaveFocus()
    expect(screen.getByRole("tab", { name: "평점 순" })).toHaveAttribute(
      "tabindex",
      "-1"
    )
  })

  it("가로 방향에서 좌우 화살표로 탭을 이동한다", async () => {
    const user = userEvent.setup()
    renderTabs()

    await user.tab()
    await user.keyboard("{ArrowRight}")

    // 비활성 탭(저장됨)은 건너뛰므로 오른쪽 끝에서 처음으로 순환합니다
    expect(screen.getByRole("tab", { name: "평점 순" })).toHaveFocus()
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "평점 높은 흡연구역 목록"
    )

    await user.keyboard("{ArrowLeft}")
    expect(screen.getByRole("tab", { name: "가까운 순" })).toHaveFocus()
  })

  it("세로 방향에서는 위아래 화살표로 이동한다", async () => {
    const user = userEvent.setup()
    renderTabs({ orientation: "vertical" })

    expect(screen.getByRole("tablist")).toHaveAttribute(
      "aria-orientation",
      "vertical"
    )

    await user.tab()
    await user.keyboard("{ArrowDown}")

    expect(screen.getByRole("tab", { name: "평점 순" })).toHaveFocus()
  })

  it("비활성 탭은 선택되지 않고 cursor-not-allowed가 붙는다", async () => {
    const user = userEvent.setup()
    renderTabs()

    const disabledTab = screen.getByRole("tab", { name: "저장됨" })
    expect(disabledTab).toBeDisabled()
    expect(disabledTab).toHaveClass("disabled:cursor-not-allowed")

    await user.click(disabledTab)
    expect(disabledTab).toHaveAttribute("aria-selected", "false")
  })

  it("활성 표시를 색상에만 기대지 않는다", () => {
    // WCAG 1.4.1 — 활성 신호의 1차 수단은 색이 아니라 ink 하단 바(형태)입니다
    renderTabs()

    const trigger = screen.getByRole("tab", { name: "가까운 순" })
    expect(trigger).toHaveClass("after:bg-ink")
    expect(trigger.className).toContain("data-active:after:opacity-100")
  })

  it("트리거는 터치 타깃 48px와 8px 라운딩을 쓴다", () => {
    renderTabs()

    const trigger = screen.getByRole("tab", { name: "가까운 순" })
    expect(trigger).toHaveClass("h-12")
    expect(trigger).toHaveClass("rounded-sm")
    expect(trigger).toHaveClass("cursor-pointer")
  })

  it("트리거에 키보드 포커스 링이 있다", () => {
    renderTabs()

    const trigger = screen.getByRole("tab", { name: "가까운 순" })
    expect(trigger).toHaveClass("focus-visible:ring-2")
    expect(trigger).toHaveClass("focus-visible:ring-offset-2")
  })

  it("segmented variant가 data-variant로 노출된다", () => {
    renderTabs({}, { variant: "segmented" })

    const list = screen.getByRole("tablist")
    expect(list).toHaveAttribute("data-variant", "segmented")
    // 세그먼티드 컨테이너는 카드 라운딩(14px)을 씁니다
    expect(list).toHaveClass("rounded-md")
  })

  it("제어 컴포넌트로도 동작한다", async () => {
    const user = userEvent.setup()
    function ControlledTabs() {
      const [value, setValue] = React.useState("near")
      return (
        <>
          <span data-testid="current">{value}</span>
          <Tabs value={value} onValueChange={setValue}>
            <TabsList>
              <TabsTrigger value="near">가까운 순</TabsTrigger>
              <TabsTrigger value="rating">평점 순</TabsTrigger>
            </TabsList>
            <TabsContent value="near">가까운 목록</TabsContent>
            <TabsContent value="rating">평점 목록</TabsContent>
          </Tabs>
        </>
      )
    }
    render(<ControlledTabs />)

    await user.click(screen.getByRole("tab", { name: "평점 순" }))

    expect(screen.getByTestId("current")).toHaveTextContent("rating")
    expect(screen.getByRole("tabpanel")).toHaveTextContent("평점 목록")
  })
})
