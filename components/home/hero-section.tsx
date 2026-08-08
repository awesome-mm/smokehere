"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Play, Smartphone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HeroStats } from "@/components/home/hero-stats"

/*
 * 히어로 섹션
 *
 * 검색어 상태 때문에 클라이언트 컴포넌트입니다. 랜딩에서 유일하게 상호작용이
 * 있는 영역이라 여기서 경계를 끊고, 나머지 섹션은 서버 컴포넌트로 남깁니다.
 */

const POPULAR_SEARCHES = ["강남역", "홍대입구", "여의도", "성수동", "부산역"]

/**
 * 검색어를 지도 페이지로 넘깁니다. 원본 시안은 입력값을 버리고 이동만 했습니다.
 *
 * 주의: `app/map/page.tsx`는 아직 보일러플레이트라 이 `q`를 읽지 않습니다.
 * 지금은 URL까지만 옳게 만들어 두는 단계이고, 사용자가 체감하는 결과는
 * 아직 원본과 같습니다. Map 페이지 작업에서 searchParams.q를 소비해야
 * 이 링크가 실제로 의미를 갖습니다.
 */
function buildMapHref(query: string) {
  const trimmed = query.trim()
  return trimmed ? `/map?q=${encodeURIComponent(trimmed)}` : "/map"
}

export function HeroSection() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    router.push(buildMapHref(query))
  }

  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto max-w-marketing px-5 py-14 sm:px-7"
    >
      <div className="grid items-end gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <p className="text-eyebrow text-primary">공공데이터 기반 서비스</p>

          <h1
            id="hero-title"
            className="mt-5 max-w-xl text-hero text-ink text-pretty"
          >
            흡연은 흡연구역에서, 거리는 모두를 위해.
          </h1>

          {/*
            원본의 width:460px / height:88px 고정값은 뺐습니다 — 한국어 줄 수가
            달라지면 넘치거나 빕니다. 다만 <br>은 문장을 나누는 의도적인
            조판이라 그대로 둡니다.
          */}
          <p className="mt-6 max-w-[30rem] text-lede text-prose">
            흡연구역 공공데이터를 한 장의 지도에 모았습니다.
            <br />
            현재 각 자치구에서 지원하는 데이터, 전국 데이터를 순차적으로
            추가하고 있습니다.
          </p>

          {/*
            action/method를 함께 둡니다. JS가 없으면 브라우저가 name="q"로
            /map?q=… 를 그대로 만들어 주므로, onSubmit은 그 위에 얹는
            향상된 경로가 됩니다.
          */}
          <form
            action="/map"
            method="get"
            onSubmit={handleSearch}
            className="mt-9 flex w-full max-w-lg gap-2.5"
          >
            <label htmlFor="hero-search" className="sr-only">
              흡연구역 검색
            </label>
            <Input
              id="hero-search"
              name="q"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="지역, 역, 건물 이름으로 검색"
              className="h-14 flex-1 focus-visible:border-primary"
            />
            <Button type="submit" size="lg">
              검색
            </Button>
          </form>

          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="text-caption-sm text-muted-foreground">
              인기 검색
            </span>
            <ul className="flex flex-wrap items-center gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <li key={term}>
                  {/*
                    시안의 칩은 29px이라 터치 타깃 44px에 미달합니다.
                    디자인 시스템 자체는 --height-chip: 39px를 정의하고 있어,
                    시안 쪽이 시스템에서 벗어난 값이었습니다.
                  */}
                  <Link
                    href={buildMapHref(term)}
                    className="inline-flex min-h-11 items-center rounded-full border border-control bg-background px-4 text-caption-sm text-prose transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                  >
                    {term}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            {/*
              원본의 secondary는 연회색이 아니라 어두운 채움입니다 —
              _ds/tokens/colors.css의 --action-secondary-bg: var(--grey-900).
              shadcn의 secondary(#f2f2f2)를 쓰면 페이지 배경과 구분되지 않습니다.
            */}
            <Button
              asChild
              variant="ghost"
              className="h-13 w-48 bg-ink text-background hover:bg-ink/90 hover:text-background"
            >
              <Link href="/map">
                <Smartphone aria-hidden="true" />
                App Store
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-13 w-48">
              <Link href="/map">
                <Play aria-hidden="true" />
                Google Play
              </Link>
            </Button>
            <p className="text-caption-sm text-muted-foreground">
              iOS 16 이상 · Android 10 이상 · 무료
            </p>
          </div>
        </div>

        <HeroStats />
      </div>
    </section>
  )
}
