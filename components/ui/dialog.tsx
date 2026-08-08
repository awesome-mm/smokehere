"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/*
 * SmokeHere 다이얼로그 — Airbnb 디자인 시스템 기반
 *
 * 포커스 트랩, Esc 닫기, aria-labelledby/aria-describedby 연결은 모두 Radix가 처리합니다.
 * DialogTitle을 빼면 접근 가능한 이름이 사라지므로 반드시 함께 쓰세요(시각적으로 숨기려면 sr-only).
 */
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        // scrim은 렌더 시점에 50% 불투명도로 씁니다. 원본 radix-nova의 backdrop-blur는
        // 이 시스템에 없는 표현이라 뺐습니다 — 깊이는 사진과 라운딩이 만듭니다
        "fixed inset-0 isolate z-50 bg-scrim/50 duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg bg-popover p-6 text-popover-foreground outline-none",
          // 큰 패널이라 20px 라운딩. 그림자는 시스템 유일 티어인 shadow-float
          // (첫 레이어가 1px 헤어라인 역할을 하므로 별도 border를 두지 않습니다)
          "shadow-float",
          // 모바일에서 좌우 16px 여백을 남기고, 내용이 길면 패널 안에서만 스크롤합니다
          "max-h-[calc(100dvh-2rem)] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-lg",
          "duration-200 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            {/* 아이콘 단독 버튼이므로 aria-label이 접근 가능한 이름을 책임집니다 */}
            <Button
              variant="ghost"
              size="icon-sm"
              pill
              aria-label="닫기"
              className="absolute top-4 right-4"
            >
              <XIcon />
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      // 닫기 버튼(40px)과 제목이 겹치지 않도록 오른쪽을 비워 둡니다
      className={cn("flex flex-col gap-2 pr-10 text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        // 패널 패딩(p-6)을 상쇄해 폭을 꽉 채우고 hairline으로 액션 영역을 구분합니다.
        // 모바일에서는 세로로 쌓아 버튼이 좁아지지 않게 합니다
        "-mx-6 -mb-6 flex flex-col-reverse gap-2 rounded-b-lg border-t border-hairline p-6 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">닫기</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      // text-display-sm(20/600)에 굵기·행간이 이미 묶여 있어 font-*를 덧붙이지 않습니다
      className={cn("font-heading text-display-sm text-ink", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-body-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-ink",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
