import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/*
 * 디자인 시스템의 타이포그래피 토큰 (styles/globals.css의 --text-* 정의와 1:1)
 *
 * 각 토큰은 크기·굵기·행간·자간을 한 번에 묶은 font-size 유틸리티입니다.
 * tailwind-merge는 기본 스케일(text-sm, text-lg …)만 알기 때문에 이 이름들을
 * "색상"으로 잘못 분류합니다. 그러면 `text-body-md text-ink`처럼 크기와 색을
 * 같이 쓸 때 둘이 같은 그룹으로 취급돼 뒤에 온 쪽이 앞의 것을 지워 버립니다.
 * 실제로 Input의 text-body-md가 text-ink에 먹혀 사라지는 버그가 있었습니다.
 */
export const fontSizeTokens = [
  "text-rating-display",
  "text-display-xl",
  "text-display-lg",
  "text-display-md",
  "text-display-sm",
  "text-title-md",
  "text-title-sm",
  "text-body-md",
  "text-body-sm",
  "text-caption",
  "text-caption-sm",
  "text-badge",
  "text-micro-label",
  "text-uppercase-tag",
  "text-button-md",
  "text-button-sm",
  "text-link",
  "text-nav-link",
  // 마케팅 스케일 (랜딩 전용)
  "text-hero",
  "text-section-lg",
  "text-section",
  "text-stat",
  "text-lede",
  "text-eyebrow",
  "text-eyebrow-sm",
] as const

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [...fontSizeTokens],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
