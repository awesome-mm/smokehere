"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

/*
 * 스크롤 등장 애니메이션
 *
 * 원본은 document.querySelectorAll("section > div > *")로 DOM을 훑어 대상을
 * 추측합니다. React에서는 트리가 바뀔 때마다 결과가 달라지므로, 감쌀 곳을
 * 명시적으로 지정하는 방식으로 바꿨습니다.
 *
 * 원본의 더 큰 문제는 [data-reveal]의 초기 상태가 opacity: 0이라는 점입니다.
 * IntersectionObserver가 없거나 JS가 죽으면 페이지 전체가 빈 화면이 됩니다.
 * 여기서는 세 경로를 막았습니다.
 *   1) IntersectionObserver 미지원 → 즉시 표시
 *   2) prefers-reduced-motion → 즉시 표시 (숨겼다 보이는 깜빡임도 없음)
 *   3) JS 자체가 없음 → <RevealNoScriptFallback />의 noscript 스타일
 *
 * 막지 못한 경로가 하나 남습니다: JS는 켜져 있는데 **하이드레이션이 끝나지
 * 않는** 경우(청크 로드 실패, 앞선 클라이언트 컴포넌트의 예외). noscript는
 * JS가 켜져 있으므로 적용되지 않고 effect는 실행되지 않아, 히어로 아래가
 * 빈 채로 남습니다. 근본적으로 없애려면 서버 HTML을 "보이는 상태"로 두고
 * 클라이언트가 숨김을 켜는 구조여야 합니다.
 * 경위: docs/design-import/sections/reveal.md
 */

export function Reveal({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    // 관찰을 걸지 않고 바로 표시하는 경로.
    // effect 본문에서 setState를 동기로 부르면 렌더가 연쇄되므로 한 프레임 미룹니다.
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          setShown(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal={shown ? "in" : "pending"}
      className={cn(
        "transition-[opacity,translate] duration-700 ease-reveal",
        shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * JS가 없는 환경에서 Reveal이 숨긴 콘텐츠를 되돌립니다.
 * 페이지당 한 번만 렌더하세요.
 *
 * `translate`를 되돌립니다. Tailwind v4의 `translate-y-*`는 `transform`이 아니라
 * **`translate` 속성**으로 컴파일되기 때문입니다.
 *   .translate-y-5{--tw-translate-y:…;translate:var(--tw-translate-x) var(--tw-translate-y)}
 * 투명도만 되돌리면 20px 오프셋이 남아 다음 섹션의 구분선과 겹칩니다.
 *
 * !important는 쓰지 않습니다. 이 <style>은 @layer에 속하지 않고, Tailwind
 * 유틸리티는 `@layer utilities` 안에 있어 캐스케이드 레이어 규칙만으로 이깁니다.
 */
export function RevealNoScriptFallback() {
  return (
    <noscript>
      <style>{`[data-reveal]{opacity:1;translate:none}`}</style>
    </noscript>
  )
}
