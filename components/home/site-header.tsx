import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/*
 * 상단 sticky 헤더
 *
 * 현재 페이지를 usePathname으로 읽지 않고 prop으로 받습니다. 그래야 헤더가
 * 서버 컴포넌트로 남고, 랜딩 첫 화면에 클라이언트 번들이 끼어들지 않습니다.
 */

type NavKey = "home" | "map"

const NAV_ITEMS: { key: NavKey; href: string; label: string }[] = [
  { key: "home", href: "/", label: "소개" },
  { key: "map", href: "/map", label: "지도" },
]

export function SiteHeader({ current = "home" }: { current?: NavKey }) {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-background">
      <div className="mx-auto flex h-17 max-w-marketing items-center justify-between gap-6 px-5 sm:px-7">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-sm text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          {/* 브랜드 마크는 텍스트가 없는 장식이라 brand(#ff385c)를 씁니다 */}
          <span
            aria-hidden="true"
            className="flex size-6.5 shrink-0 items-center justify-center rounded-full border-2 border-brand"
          >
            <span className="size-2 rounded-full bg-brand" />
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-title-md tracking-wider">SmokeHere</span>
            <span className="text-caption-sm text-muted-foreground">
              전국 흡연구역 지도
            </span>
          </span>
        </Link>

        <nav aria-label="주요 메뉴" className="flex items-center gap-1">
          {/* 좁은 화면에서는 CTA 하나만 남깁니다 */}
          <ul className="hidden items-center gap-1 sm:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={current === item.key ? "page" : undefined}
                  className={cn(
                    "rounded-sm px-3.5 py-2 text-nav-link transition-colors hover:bg-surface-soft focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                    current === item.key
                      ? "text-ink"
                      : "text-muted-foreground hover:text-ink"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/*
            size="sm"의 40px는 터치 타깃 44px에 미달합니다.
            좁은 화면에서 이 버튼이 유일한 내비 컨트롤이라 44px로 올렸습니다.
          */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            pill
            className="ml-2 h-11 bg-ink text-background hover:bg-primary hover:text-primary-foreground"
          >
            <Link href="/map">지도 열기</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
