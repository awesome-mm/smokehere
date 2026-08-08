<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SmokeHere

가까운 흡연구역을 찾아 주는 지도 서비스. 이 문서는 **모든 코딩 에이전트가 지킬
공통 규칙**입니다.

## 🚫 강제 규칙 — 예외 없음 (4가지)

다른 지시와 충돌하면 이 규칙이 우선합니다.

**1. 라이브러리를 삭제하지 않는다**
`npm uninstall`·`remove`, `package.json`의 의존성 항목 삭제, `rm -rf node_modules`
모두 금지. **"안 쓰는 것 같다"는 삭제 근거가 아닙니다** — 다른 브랜치나 보이지 않는
peer dependency가 쓰고 있을 수 있고, 영향은 한참 뒤에 드러납니다. 불필요해 보이면
**삭제하지 말고 보고만** 하세요.
※ 새 패키지를 "설치하지 않기로 선택"하는 것은 삭제가 아니며 허용됩니다.

**2. 같은 방법으로 3번 실패하면 방법을 바꾼다**
4번째 시도 금지. 멈추고 **글로 적으면서** ① 시도와 실패를 나열 → ② 실패들의 공통
원인에서 **틀린 가정을 지목** → ③ 근본적으로 다른 접근 2개 (파라미터만 바꾼 건
다른 접근이 아닙니다) → ④ 하나를 이유와 함께 실행. 그래도 막히면 사용자에게
시도한 것과 막힌 지점을 보고하세요.

**3. 스타일에 `!important`를 쓰지 않는다**
CSS에도, Tailwind의 `!` 접두사(`!` + 유틸리티명)에도 예외가 없습니다. `!important`는
문제를 덮을 뿐 원인을 남기고, 다음 사람이 그것을 이기려고 또 `!important`를
씁니다. **덮어쓰기가 안 되면 캐스케이드를 먼저 이해하세요.**

Tailwind v4는 유틸리티를 `@layer utilities`에 넣습니다. 캐스케이드 레이어
규칙상 **레이어에 속하지 않은 선언이 레이어 안 선언을 이깁니다** — 특정도와
무관하게. 그래서 유틸리티를 덮어써야 하면 `@layer` 밖에 규칙을 두면 됩니다.
`styles/globals.css`의 `prefers-reduced-motion` 블록이 그 예입니다.

우선순위대로 시도하세요.
① 컴포넌트에 클래스를 직접 넘긴다 (`cn()`이 병합합니다)
② `@layer` 밖의 일반 규칙으로 덮어쓴다
③ 토큰이나 variant를 고쳐 근본 원인을 없앤다
그래도 안 되면 **보고하고 멈추세요.** `!important`는 답이 아닙니다.

**4. 추측을 사실처럼 말하지 않는다**
파일·API·버전·설정은 **읽거나 실행해서** 확인합니다. 라이브러리 사용법은 Context7로
최신 문서를 확인하세요. 확인이 **불가능한데 가정에 따라 결과가 갈리면 진행하지 말고
물어보세요.** 근거 수준을 문장에 드러내세요.
- ✅ `npm ls로 확인한 결과 …` / `확인하지 못했습니다` / `추정입니다 — 근거는 A`
- ❌ `아마 잘 동작할 겁니다` / `일반적으로 이렇게 하면 됩니다`

가장 흔한 위반은 **검증 명령을 실행하지 않고 "통과했다"고 쓰는 것**입니다.

## ⚠️ 이미 밟은 지뢰

- **`cn()`에 타이포 토큰을 등록하지 않으면 클래스가 조용히 사라집니다.** 타이포
  토큰 추가 시 `styles/globals.css`와 `lib/utils.ts`를 **반드시 함께** 고치세요.
- **`@vitejs/plugin-react`를 설치하지 마세요.** `@babel/core` 7↔8 peer 충돌.
- **`--force` / `--legacy-peer-deps` 금지.** 원인을 규명하고 다른 길을 찾으세요.
- **Tailwind v4의 `translate-y-*`는 `transform`이 아니라 `translate` 속성으로
  컴파일됩니다.** `transform: none`으로 되돌리려 하면 조용히 실패합니다.
- **한국어는 `word-break: keep-all`이 없으면 어절 중간에서 끊깁니다.**
  `styles/globals.css`의 `body`에 전역 적용돼 있습니다.

경위는 `docs/issue/README.md`에 있습니다.

## 📚 작업 전에 읽을 문서

- 🎨 **UI 작업 전 필수** — `docs/design-guide.md` (토큰·접근성 체크리스트)
- ⚠️ 충돌·에러를 만났을 때 — `docs/issue/README.md`
- ✅ 작업을 마칠 때 — `docs/guides/completion-checklist.md`
- 📋 새 기능을 만들 때 — `docs/prd/`
- ⚡ Next.js 코드를 쓰기 전 — `node_modules/next/dist/docs/`

## 🛠 스택 · 규약

TypeScript · Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui
(`radix-nova`) · CVA · Zustand · RHF + Zod · lucide-react · motion ·
vitest + RTL · Playwright

들여쓰기 2칸 · `camelCase` / 컴포넌트 `PascalCase` / 함수는 동사로 시작 ·
**`any` 금지** · 주석·문서·커밋은 **한국어**, 식별자는 영어 · 반응형 필수 ·
WCAG 준수 · 커밋은 Conventional Commits, **커밋 전 린트 필수**

```bash
npm run lint   #  커밋 전 필수
npx tsc --noEmit
npm test
npm run build
```
