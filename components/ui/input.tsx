import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * SmokeHere 인풋 — Airbnb 디자인 시스템 기반
 *
 * 높이 48px, 라운딩 8px로 버튼 default와 같은 리듬을 씁니다.
 * 본문 크기를 16px(text-body-md)로 고정한 이유는 iOS Safari가 16px 미만 입력 필드에
 * 자동 확대를 걸기 때문입니다. shadcn 기본값의 `md:text-sm` 축소는 그래서 뺐습니다.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-sm border border-hairline bg-background px-4 text-body-md text-ink transition-colors outline-none",
        // placeholder는 비활성 텍스트 전용 톤(3.11:1). 읽혀야 하는 값은 text-ink로 들어옵니다
        "placeholder:text-muted-soft",
        // 파일 선택 버튼은 브라우저 기본 스타일을 지우고 라벨만 남깁니다
        "file:inline-flex file:h-8 file:cursor-pointer file:border-0 file:bg-transparent file:text-button-sm file:text-ink",
        // 포커스는 ink 테두리 + offset 링. 흰 캔버스에서도 또렷하게 보입니다 (WCAG 2.4.11)
        "focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // 읽기 전용은 클릭해도 편집이 안 되므로 텍스트 커서를 쓰지 않습니다
        "read-only:cursor-default read-only:bg-surface-soft",
        // disabled:pointer-events-none을 쓰면 cursor-not-allowed가 표시되지 않아 제거했습니다
        "disabled:cursor-not-allowed disabled:border-hairline-soft disabled:bg-surface-soft disabled:text-muted-soft",
        // 에러는 색상 하나에 기대지 않도록 테두리(형태)와 링(면적)을 함께 바꿉니다
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }
