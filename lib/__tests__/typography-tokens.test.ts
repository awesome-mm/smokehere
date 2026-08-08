import { readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

import { cn, fontSizeTokens } from "@/lib/utils"

/*
 * 타이포 토큰 목록이 globals.css와 lib/utils.ts 두 곳에 중복되는 문제를 막습니다.
 *
 * tailwind-merge는 커스텀 `text-*`를 전부 색상으로 분류하기 때문에, cn()에
 * 등록하지 않은 타이포 토큰은 색상 클래스와 만나면 조용히 사라집니다.
 * globals.css에만 토큰을 추가하고 lib/utils.ts를 빠뜨리는 실수가 이 테스트에
 * 걸립니다. 경위는 docs/issue/2026-08-08-tailwind-merge-typography-collision.md
 */

// jsdom 환경에서는 import.meta.url이 file: 스킴이 아니라 쓸 수 없습니다.
// vitest는 프로젝트 루트에서 실행되므로 cwd를 기준으로 잡습니다.
const globalsCss = readFileSync(
  join(process.cwd(), "styles", "globals.css"),
  "utf8"
)

/** globals.css의 `--text-*` 정의에서 토큰 이름을 뽑습니다. */
function collectCssFontSizeTokens(css: string): string[] {
  const names = css.match(/--text-[a-z0-9-]+(?=\s*:)/g) ?? []
  return [
    ...new Set(
      names
        .map((name) => name.slice(2)) // 앞의 `--` 제거
        // `--text-hero--line-height` 같은 하위 속성은 토큰이 아니라 수식자입니다
        .filter((name) => !name.includes("--"))
    ),
  ].sort()
}

describe("타이포 토큰 동기화", () => {
  it("globals.css의 --text-* 토큰이 모두 cn()에 등록돼 있다", () => {
    const declared = collectCssFontSizeTokens(globalsCss)
    const registered = [...fontSizeTokens].sort()

    expect(registered).toEqual(declared)
  })

  it("등록된 토큰은 색상 클래스와 함께 써도 지워지지 않는다", () => {
    for (const token of fontSizeTokens) {
      const merged = cn(token, "text-ink")

      expect(merged).toContain(token)
      expect(merged).toContain("text-ink")
    }
  })

  it("같은 그룹의 타이포 토큰끼리는 뒤에 온 쪽만 남는다", () => {
    expect(cn("text-body-md", "text-hero")).toBe("text-hero")
  })
})
