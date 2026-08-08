import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/*
 * SmokeHere 버튼 — Airbnb 디자인 시스템 기반
 *
 * 라운딩은 8px(rounded-sm) 고정, 기본 높이는 48px입니다.
 * 포커스는 ink 링 + offset으로 흰 캔버스 위에서 또렷하게 보이도록 했습니다.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm border border-transparent bg-clip-padding whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // 주 CTA. 배경은 brand-strong(#e00b41) — 흰 텍스트 대비 4.89:1로 AA 통과
        // 호버는 어둡게 갑니다. brand(#ff385c)로 밝히면 흰 텍스트 대비가 3.52:1로 떨어집니다.
        // 비활성 라벨은 원본의 흰색 대신 ink를 씁니다 — 흰색은 brand-subtle 위에서 1.37:1로 안 읽힙니다.
        default:
          "bg-primary text-primary-foreground hover:bg-[color-mix(in_oklch,var(--primary),black_12%)] disabled:bg-brand-subtle disabled:text-ink disabled:opacity-100",
        // 흰 배경 + ink 1px 아웃라인
        outline:
          "border-ink bg-background text-ink hover:bg-surface-soft aria-expanded:bg-surface-soft",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-surface-strong/70 aria-expanded:bg-secondary",
        ghost:
          "text-ink hover:bg-surface-soft aria-expanded:bg-surface-soft",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
        // 텍스트 전용. 호버 시 밑줄만
        link: "text-ink underline-offset-4 hover:underline",
      },
      size: {
        // 48px — 시스템 기본 CTA 높이 (터치 타깃 44px 이상)
        default: "h-12 px-6 text-button-md",
        sm: "h-10 px-4 text-button-sm",
        // 32px. 밀집한 툴바 전용이며 터치 UI에서는 쓰지 마세요
        xs: "h-8 px-3 text-button-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-14 px-8 text-button-md",
        icon: "size-12",
        "icon-sm": "size-10",
        "icon-xs": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-14 [&_svg:not([class*='size-'])]:size-5",
      },
      // 검색 버튼·필터 칩처럼 완전히 둥근 형태
      pill: {
        true: "rounded-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      pill: false,
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  pill = false,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, pill, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
