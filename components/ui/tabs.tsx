"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/*
 * SmokeHere 탭 — Airbnb 디자인 시스템 기반
 *
 * 활성 표시는 `bg-ink` 하단 바가 담당합니다. 색상만으로 활성/비활성을 나누지 않기 위해
 * (WCAG 1.4.1) 굵기나 브랜드 컬러가 아니라 형태(바)를 1차 신호로 씁니다.
 * brand(#ff385c)는 텍스트/텍스트 배경에 쓰지 않습니다 — 흰 텍스트 대비 3.52:1로 AA 미달입니다.
 */
function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      // orientation을 Root에 그대로 넘겨야 Radix의 roving tabindex가 방향키를 올바르게 처리합니다.
      // data-orientation 속성은 Radix가 직접 내려주므로 수동으로 덧붙이지 않습니다.
      orientation={orientation}
      className={cn("group/tabs flex gap-4 data-horizontal:flex-col", className)}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex items-center text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:items-stretch",
  {
    variants: {
      variant: {
        // 기본형. 투명 배경 + hairline 기준선, 활성 트리거의 ink 하단 바가 위치를 알려 줍니다
        underline:
          "w-full justify-start gap-6 border-hairline group-data-horizontal/tabs:border-b group-data-vertical/tabs:gap-0 group-data-vertical/tabs:border-l",
        // 밀집 전환용 세그먼티드 컨트롤. 컨테이너는 카드 라운딩(14px), 내부 트리거는 8px
        segmented: "w-fit gap-1 rounded-md bg-surface-soft p-1",
      },
    },
    defaultVariants: {
      variant: "underline",
    },
  }
)

function TabsList({
  className,
  variant = "underline",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // 높이 48px — 버튼 default와 같은 터치 타깃(44px 기준 초과). 라운딩은 버튼과 동일한 8px
        "relative inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm border border-transparent px-4 text-title-sm whitespace-nowrap transition-colors outline-none select-none group-data-vertical/tabs:justify-start",
        // 비활성 5.41:1 / 활성 15.91:1 — 둘 다 AA를 넘습니다
        "text-muted-foreground hover:text-ink data-active:text-ink",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // disabled:pointer-events-none을 쓰면 cursor-not-allowed가 표시되지 않아 제거했습니다
        "disabled:cursor-not-allowed disabled:text-muted-soft disabled:hover:text-muted-soft",
        // 활성 인디케이터. 가로는 하단 바, 세로는 좌측 바로 뒤집습니다
        "after:pointer-events-none after:absolute after:bg-ink after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:-bottom-px group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-left-px group-data-vertical/tabs:after:w-0.5",
        "group-data-[variant=underline]/tabs-list:data-active:after:opacity-100",
        // 세그먼티드는 바 대신 흰 표면 + 단일 그림자 티어로 떠 있는 느낌을 냅니다
        "group-data-[variant=segmented]/tabs-list:data-active:bg-background group-data-[variant=segmented]/tabs-list:data-active:shadow-float",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      // Radix가 패널에 tabIndex=0을 부여하므로 키보드 포커스 링을 반드시 보여 줍니다
      className={cn(
        "flex-1 rounded-sm text-body-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
