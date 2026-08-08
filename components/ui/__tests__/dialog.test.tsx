import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

/** 트리거 + 제목/설명 + 액션을 갖춘 기본 구성 */
function renderDialog(
  contentProps: Partial<React.ComponentProps<typeof DialogContent>> = {}
) {
  return render(
    <Dialog>
      <DialogTrigger asChild>
        <Button>흡연구역 신고</Button>
      </DialogTrigger>
      <DialogContent {...contentProps}>
        <DialogHeader>
          <DialogTitle>흡연구역을 신고할까요?</DialogTitle>
          <DialogDescription>
            잘못된 위치나 사라진 흡연구역을 알려 주세요.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button>신고하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

describe("Dialog", () => {
  it("처음에는 닫혀 있다", () => {
    renderDialog()

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("트리거를 클릭하면 열린다", async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole("button", { name: "흡연구역 신고" }))

    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("DialogTitle이 접근 가능한 이름이 된다", async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole("button", { name: "흡연구역 신고" }))

    // Radix가 aria-labelledby로 연결합니다. Title을 빼면 이름 없는 모달이 됩니다
    expect(screen.getByRole("dialog")).toHaveAccessibleName(
      "흡연구역을 신고할까요?"
    )
  })

  it("DialogDescription이 aria-describedby로 연결된다", async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole("button", { name: "흡연구역 신고" }))

    expect(screen.getByRole("dialog")).toHaveAccessibleDescription(
      "잘못된 위치나 사라진 흡연구역을 알려 주세요."
    )
  })

  it("열리면 포커스가 다이얼로그 안으로 들어간다", async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole("button", { name: "흡연구역 신고" }))

    const dialog = screen.getByRole("dialog")
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
  })

  it("Esc로 닫히고 포커스가 트리거로 돌아온다", async () => {
    const user = userEvent.setup()
    renderDialog()

    const trigger = screen.getByRole("button", { name: "흡연구역 신고" })
    await user.click(trigger)
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    await user.keyboard("{Escape}")

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it("닫기 아이콘 버튼에 접근 가능한 이름이 있고 클릭하면 닫힌다", async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole("button", { name: "흡연구역 신고" }))

    // 아이콘 단독 버튼이므로 aria-label이 이름을 책임집니다
    const closeButton = screen.getByRole("button", { name: "닫기" })
    await user.click(closeButton)

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("DialogClose로 감싼 버튼도 다이얼로그를 닫는다", async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole("button", { name: "흡연구역 신고" }))
    await user.click(screen.getByRole("button", { name: "취소" }))

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("showCloseButton이 false면 닫기 아이콘을 렌더링하지 않는다", async () => {
    const user = userEvent.setup()
    renderDialog({ showCloseButton: false })

    await user.click(screen.getByRole("button", { name: "흡연구역 신고" }))

    expect(screen.queryByRole("button", { name: "닫기" })).not.toBeInTheDocument()
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("오버레이는 scrim을 50% 불투명도로 쓴다", async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole("button", { name: "흡연구역 신고" }))

    // 디자인 가이드: scrim은 렌더 시점에 50%로 적용합니다
    const overlay = document.querySelector('[data-slot="dialog-overlay"]')
    expect(overlay).toHaveClass("bg-scrim/50")
    // 이 시스템에 없는 표현이라 backdrop blur는 쓰지 않습니다
    expect(overlay?.className).not.toMatch(/backdrop-blur/)
  })

  it("패널은 20px 라운딩과 단일 그림자 티어를 쓴다", async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole("button", { name: "흡연구역 신고" }))

    const dialog = screen.getByRole("dialog")
    expect(dialog).toHaveClass("rounded-lg")
    expect(dialog).toHaveClass("shadow-float")
  })

  it("제목의 타이포 토큰과 색상 토큰이 함께 살아남는다", async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole("button", { name: "흡연구역 신고" }))

    const title = screen.getByText("흡연구역을 신고할까요?")
    expect(title).toHaveClass("text-display-sm")
    expect(title).toHaveClass("text-ink")
  })

  it("제어 컴포넌트로 열림 상태를 다룰 수 있다", async () => {
    const user = userEvent.setup()
    const handleOpenChange = vi.fn()

    function ControlledDialog() {
      const [open, setOpen] = React.useState(false)
      return (
        <Dialog
          open={open}
          onOpenChange={(next) => {
            handleOpenChange(next)
            setOpen(next)
          }}
        >
          <DialogTrigger asChild>
            <Button>열기</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>위치 권한이 필요합니다</DialogTitle>
              <DialogDescription>
                가까운 흡연구역을 찾으려면 위치 접근을 허용해 주세요.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
    }
    render(<ControlledDialog />)

    await user.click(screen.getByRole("button", { name: "열기" }))
    expect(handleOpenChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    await user.keyboard("{Escape}")
    expect(handleOpenChange).toHaveBeenCalledWith(false)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("모달이 열려 있는 동안 바깥 콘텐츠는 보조기술에서 가려진다", async () => {
    const user = userEvent.setup()
    render(
      <>
        <main>
          <h1>흡연구역 지도</h1>
        </main>
        <Dialog>
          <DialogTrigger asChild>
            <Button>신고</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>신고하기</DialogTitle>
              <DialogDescription>내용을 알려 주세요.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    )

    expect(
      screen.getByRole("heading", { name: "흡연구역 지도" })
    ).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "신고" }))

    // Radix는 aria-modal="true"를 붙이지 않고 다이얼로그 바깥 형제 요소에
    // aria-hidden을 걸어 격리합니다. VoiceOver가 aria-modal 안의 콘텐츠를
    // 제대로 읽지 못하는 문제 때문에 택한 방식입니다.
    // 결과적으로 바깥 heading은 접근성 트리에서 사라집니다.
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "흡연구역 지도" })).toBeNull()
  })
})
