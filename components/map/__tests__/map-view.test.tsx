import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { MapView } from "@/components/map/map-view"

/*
 * 지도 페이지의 상호작용을 고정합니다.
 * 경위: docs/design-import/map/README.md
 */

const 결과개수 = () => screen.getByText(/개 결과 · 가까운 순/).textContent ?? ""
const 목록항목 = () => screen.queryAllByRole("listitem")

describe("MapView 초기 상태", () => {
  it("검색어가 없으면 서울로 시작한다", () => {
    render(<MapView />)

    expect(screen.getByRole("radio", { name: "서울" })).toBeChecked()
    expect(결과개수()).toContain("13개")
  })

  it("검색어를 들고 오면 도시 제한을 풀어 준다", () => {
    // 기본값 "서울"이면 부산 결과가 전부 걸러져 빈 화면이 됩니다
    render(<MapView initialQuery="부산역" />)

    expect(screen.getByRole("radio", { name: "전체" })).toBeChecked()
    expect(screen.getByText("부산역 광장 흡연부스")).toBeInTheDocument()
  })

  it("일치하는 곳이 없으면 빈 상태를 보여준다", () => {
    render(<MapView initialQuery="제주" />)

    expect(screen.getByText("검색 결과가 없습니다")).toBeInTheDocument()
    expect(목록항목()).toHaveLength(0)
  })
})

describe("MapView 필터", () => {
  it("도시를 바꾸면 목록이 바뀐다", async () => {
    const user = userEvent.setup()
    render(<MapView />)

    await user.click(screen.getByRole("radio", { name: "대구" }))

    expect(결과개수()).toContain("2개")
    expect(screen.getByText("대구역 동편 광장")).toBeInTheDocument()
  })

  it("형태 필터는 여러 개를 함께 걸 수 있다", async () => {
    const user = userEvent.setup()
    render(<MapView />)

    await user.click(screen.getByRole("radio", { name: "전체" }))
    const 전체개수 = 결과개수()

    await user.click(screen.getByRole("checkbox", { name: "부스형" }))
    const 부스형개수 = 결과개수()

    await user.click(screen.getByRole("checkbox", { name: "실내형" }))
    const 부스와실내개수 = 결과개수()

    expect(부스형개수).not.toBe(전체개수)
    expect(부스와실내개수).not.toBe(부스형개수)
  })

  it("검색어를 입력하면 목록이 좁혀진다", async () => {
    const user = userEvent.setup()
    render(<MapView />)

    await user.type(screen.getByRole("searchbox"), "여의도")

    expect(결과개수()).toContain("1개")
    expect(screen.getByText("여의도공원 동측 흡연구역")).toBeInTheDocument()
  })
})

describe("MapView 상세 패널", () => {
  const 첫항목선택 = async (user: ReturnType<typeof userEvent.setup>) => {
    const 항목 = within(목록항목()[0]).getByRole("button")
    await user.click(항목)
    return 항목
  }

  it("목록에서 고르면 상세 패널이 열린다", async () => {
    const user = userEvent.setup()
    render(<MapView />)

    expect(screen.queryByRole("region")).not.toBeInTheDocument()

    await 첫항목선택(user)

    const panel = screen.getByRole("region")
    expect(panel).toBeInTheDocument()
    expect(within(panel).getByRole("heading", { level: 2 })).toBeInTheDocument()
  })

  it("선택한 항목이 aria-current로 표시된다", async () => {
    const user = userEvent.setup()
    render(<MapView />)

    const 항목 = await 첫항목선택(user)

    expect(항목).toHaveAttribute("aria-current", "true")
  })

  it("닫기 버튼으로 패널을 닫는다", async () => {
    const user = userEvent.setup()
    render(<MapView />)
    await 첫항목선택(user)

    await user.click(screen.getByRole("button", { name: "상세 정보 닫기" }))

    expect(screen.queryByRole("region")).not.toBeInTheDocument()
  })

  it("Esc로도 닫힌다", async () => {
    const user = userEvent.setup()
    render(<MapView />)
    await 첫항목선택(user)

    await user.keyboard("{Escape}")

    expect(screen.queryByRole("region")).not.toBeInTheDocument()
  })

  it("닫으면 포커스가 원래 목록 항목으로 돌아간다", async () => {
    // 돌아가지 않으면 키보드 사용자가 문서 맨 위로 튕깁니다
    const user = userEvent.setup()
    render(<MapView />)
    const 항목 = await 첫항목선택(user)

    await user.keyboard("{Escape}")

    await waitFor(() => expect(항목).toHaveFocus())
  })

  it("길찾기는 좌표가 담긴 외부 링크다", async () => {
    const user = userEvent.setup()
    render(<MapView />)
    await 첫항목선택(user)

    const link = screen.getByRole("link", { name: /길찾기/ })

    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("google.com/maps/dir/")
    )
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"))
  })

  it("제보 버튼은 접수됐다고 말하지 않는다", async () => {
    const user = userEvent.setup()
    render(<MapView />)
    await 첫항목선택(user)

    await user.click(screen.getByRole("button", { name: /제보하기/ }))

    // 실제로 전송하는 곳이 없으므로 "접수"라는 표현을 쓰면 안 됩니다
    expect(screen.getByRole("status")).toHaveTextContent(
      "제보 기능은 아직 연결되지 않았습니다"
    )
    expect(screen.queryByText(/접수되었습니다/)).not.toBeInTheDocument()
  })

  it("도시를 바꾸면 선택이 해제된다", async () => {
    const user = userEvent.setup()
    render(<MapView />)
    await 첫항목선택(user)

    await user.click(screen.getByRole("radio", { name: "부산" }))

    expect(screen.queryByRole("region")).not.toBeInTheDocument()
  })
})
