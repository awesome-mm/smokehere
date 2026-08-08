import { cn } from "@/lib/utils"

/*
 * 랜딩 섹션 공통 껍데기
 *
 * 원본의 모든 섹션이 같은 껍데기를 반복합니다 —
 * 최대 폭 1180px, 세로 패딩 56px, 좌우 28px(모바일 20px), 선택적 상단 hairline.
 * 이 값들이 섹션마다 흩어지면 하나를 고칠 때 나머지를 놓칩니다.
 */

type SectionShellProps = {
  /** aria-labelledby로 연결할 제목 요소의 id */
  labelledBy?: string
  /** 상단 1px 구분선 */
  bordered?: boolean
  /** page = 흰 배경, soft = 페이지 배경(surface-soft) 그대로 노출 */
  surface?: "page" | "soft"
  className?: string
  children: React.ReactNode
}

export function SectionShell({
  labelledBy,
  bordered = false,
  surface = "soft",
  className,
  children,
}: SectionShellProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn(
        bordered && "border-t border-hairline",
        surface === "page" && "bg-background",
        className
      )}
    >
      <div className="mx-auto max-w-marketing px-5 py-14 sm:px-7">
        {children}
      </div>
    </section>
  )
}
