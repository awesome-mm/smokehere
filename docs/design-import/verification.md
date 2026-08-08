# 검증 결과

> 상태: **완료** · 태스크 #11 · 2026-08-08

`docs/guides/completion-checklist.md`의 순서대로 실행한 결과입니다.
실행하지 않은 항목은 "미실행"으로 남겼습니다.

## 자동 검증

| 단계 | 명령 | 결과 | 실행 시각 |
|---|---|---|---|
| 린트 | `npm run lint` | **통과** (출력 없음) | 19:12 |
| 타입 | `npx tsc --noEmit` | **통과** (출력 없음) | 19:12 |
| 테스트 | `npm test` | **통과** — 7 files / 74 tests | 19:12 |
| 빌드 | `npm run build` | **통과** — `/` 정적 프리렌더 | 19:12 |

### 출력

```
> smokehere@0.1.0 test
> vitest run

 RUN  v4.1.10 C:/Users/opoko/Desktop/learn/smokehere

 Test Files  7 passed (7)
      Tests  74 passed (74)
   Duration  3.84s
```

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /map
└ ○ /showcase

○  (Static)  prerendered as static content
```

클라이언트 컴포넌트가 셋 있음에도 `/`가 정적 프리렌더로 남았습니다.

### 추가한 테스트

| 파일 | 개수 | 무엇을 고정하는가 |
|---|---|---|
| `lib/__tests__/typography-tokens.test.ts` | 3 | `globals.css`의 `--text-*`와 `cn()`의 등록 목록이 정확히 일치 |
| `components/home/__tests__/faq-section.test.tsx` | 7 | 아코디언이 버튼이고, 키보드로 열리며, `aria-expanded`가 붙는다 |
| `components/home/__tests__/hero-section.test.tsx` | 6 | 검색어가 버려지지 않고 `/map?q=…`로 전달된다 |
| `components/ui/__tests__/input.test.tsx` (추가) | 1 | 인풋 테두리가 `border-control`(3.11:1)로 유지된다 |

## 사전 렌더 HTML 검사

빌드 산출물 `.next/server/app/index.html`을 직접 읽어 확인했습니다.

### heading 순서 — 건너뜀 없음

```
H1  흡연은 흡연구역에서, 거리는 모두를 위해.
H2  SMOKE HERE
H2  끊기로 마음먹었다면, 혼자 하지 않아도 됩니다.
H2  빠르게 가까운 흡연구역을 찾아요
H2  자주 묻는 질문
H3  데이터는 어디서 가져오나요?   (외 3개)
H2  Service
H2  Data
```

### 접근성 속성

| 항목 | 결과 |
|---|---|
| FAQ `aria-expanded` | **true 1개 / false 3개** — 첫 항목만 열린 채 시작 |
| 아코디언 패널 `role="region"` | 있음 |
| `href="tel:15449030"` | 있음 |
| `href="mailto:smoke@smokehere.kr"` | 있음 |
| 검색 `<label class="sr-only">` | 있음 |
| `aria-current="page"` | 있음 |
| skip link "본문으로 건너뛰기" | 있음 |
| `<noscript>` 리빌 폴백 | 있음 |

## 브라우저 육안 확인

Chrome + `npm run dev`(localhost:3000)로 확인했습니다.

| 확인 항목 | 결과 |
|---|---|
| 헤더·히어로·통계·배너·앱 기능·FAQ·푸터 렌더 | **정상** |
| 컨테이너 폭 | `1180px` — `--container-marketing` 적용 확인 |
| h1 크기 | 넓은 화면에서 `62px` (clamp 상한) |
| 인풋 테두리 실제 색 | `lab(60.56 0 0)` = `#929292` — `control` 토큰 적용 확인 |
| 리빌 애니메이션 | 스크롤 시 정상 동작 |
| 콘솔 | **에러·경고·하이드레이션 불일치 0건** (HMR 로그 35건만) |

### 반응형

`resize_window`가 이 환경에서 뷰포트에 반영되지 않아, 페이지를 **iframe에 폭을
바꿔 가며 띄워** 미디어쿼리를 실제로 태운 뒤 계산된 스타일을 읽었습니다.

| 뷰포트 | h1 | 히어로 | 앱 카드 | 푸터 | 내비 링크 | 가로 오버플로 |
|---|---|---|---|---|---|---|
| 384px | 38.3px | 1단 | 2열 | 1열 | 숨김 | **없음** |
| 762px | 52.9px | 1단 | 2열 | 2열 | 표시 | **없음** |
| 994px | 61.8px | 1단 | 2열 | 2열 | 표시 | **없음** |
| 1094px | 62px | 2단 | 3열 | 3열 | 표시 | **없음** |
| 1434px | 62px | 2단 | 3열 | 3열 | 표시 | **없음** |

통계 카드는 384px에서 2열(157.5px씩)로 유지됩니다. `text-hero` / `text-section` /
`text-section-lg`의 clamp가 의도한 하한(38 / 26 / 30px)에 정확히 도달했습니다.

**한계:** 모바일 폭의 *시각적* 확인은 iframe 안에서 부분적으로만 했습니다.
창 크기 조절이 4회 시도에도 반영되지 않아 전체 화면 스크린샷은 못 찍었습니다.
레이아웃 수치는 위 표로 검증됐지만, 눈으로 본 것은 헤더·히어로·스토어 버튼까지입니다.

### 터치 타깃 실측

| 요소 | 높이 | 판정 |
|---|---|---|
| 헤더 CTA "지도 열기" | 44px | ✅ |
| 검색 인풋 / 검색 버튼 | 56px | ✅ |
| 인기 검색 칩 | **44px** (수정 후) | ✅ |
| 스토어 버튼 | 52px | ✅ |
| 전화번호 링크 | **44px** (수정 후) | ✅ |
| FAQ 토글 | 68px | ✅ |
| 헤더 텍스트 링크 "소개"·"지도" | 36px | ⚠ `sm` 미만에서 숨겨져 마우스 전용 |

## 육안 확인에서 발견해 고친 것

자동 검증은 전부 통과했는데 화면을 보고서야 드러난 문제들입니다.

### 1. 한국어 줄바꿈이 어절 중간에서 끊김

"흡연구역을"이 `흡연구 / 역을`로, "추가하고"가 `추가 / 하고`로 갈라졌습니다.
CSS 기본 `word-break: normal`이 한국어를 글자 단위로 끊기 때문입니다.

```css
/* styles/globals.css — body */
word-break: keep-all;
overflow-wrap: break-word;
```

**전역 수정입니다.** 랜딩뿐 아니라 앞으로 만들 모든 한국어 화면에 적용됩니다.

### 2. App Store 버튼이 배경과 구분되지 않음

`variant="secondary"`(#f2f2f2)로 매핑했는데 페이지 배경(#f7f7f7)과 거의 같아
버튼으로 보이지 않았습니다. 원본 디자인 시스템을 다시 확인하니

```css
/* _ds/.../tokens/colors.css */
--action-secondary-bg: var(--grey-900);
```

secondary는 **어두운 채움**이었습니다. shadcn의 `secondary`와 이름만 같고 뜻이
달랐던 것으로, 매핑표가 놓친 항목입니다. 어두운 채움으로 고쳤습니다.

### 3. 터치 타깃 2곳 미달

| 요소 | 수정 전 | 수정 후 | 비고 |
|---|---|---|---|
| 인기 검색 칩 | 30px | 44px | 시안은 29px이지만 DS는 `--height-chip: 39px`를 정의합니다. 시안 쪽이 시스템 밖이었습니다 |
| 전화번호 링크 | 33px | 44px | 모바일에서 이 배너의 주 액션입니다 |

## 접근성 체크리스트

`docs/design-guide.md` 기준입니다.

- [x] 텍스트 대비 4.5:1 이상 — 계산으로 확인 (#1 · #5 · #8)
- [x] `brand`(#ff385c) 배경 위에 텍스트를 얹지 않았는가 — 로고 마크에만 사용
- [x] 터치 타깃 44×44px 이상 — 실측 (헤더 텍스트 링크는 마우스 전용)
- [x] 키보드 포커스가 눈에 보이는가 — 전 인터랙티브 요소에 `focus-visible:ring-2`
- [x] 아이콘 단독 버튼에 `aria-label` — 아이콘 단독 버튼 없음. 장식 아이콘은 `aria-hidden`
- [x] 색상만으로 정보를 전달하지 않는가 — FAQ는 `+/−` 기호와 `aria-expanded` 병행
- [x] `prefers-reduced-motion`에서 콘텐츠가 사라지지 않는가 — `Reveal`이 즉시 표시로 분기
- [x] heading 레벨이 h1 → h2 → h3로 이어지는가 — 사전 렌더 HTML로 확인
- [ ] **키보드만으로 전체 순회** — RTL 테스트로 FAQ 키보드 조작만 확인. 브라우저에서 Tab 순회는 **미실행**

## 코드 리뷰 반영 (2026-08-08, `/code-review high`)

리뷰어가 체크리스트를 독립적으로 재실행해 같은 결과(린트·타입 clean, 74 테스트,
빌드 성공)를 확인했고, 프로덕션 CSS를 grep해 새 토큰이 실제로 컴파일되는 것도
검증했습니다.

| 지적 | 수준 | 조치 |
|---|---|---|
| `noscript` 폴백이 `transform:none`만 되돌려 20px 오프셋이 남음 | medium | **수정** — `translate:none`. 별도 이슈 기록 |
| 하이드레이션 실패 경로는 막지 못함 (주석이 과장) | medium | **주석 정정** — 구조 개선은 남은 과제로 기록 |
| 검색어가 `/map`에 전달되지만 Map은 아직 스텁이라 사용자 체감은 원본과 동일 | medium | **주석 정정** — Map 작업에서 `searchParams.q` 소비 필요 |
| 검색 `<form>`에 `action` 없어 JS 없으면 동작 안 함 | low | **수정** — `action="/map" method="get"` 추가 |
| 인기 검색 칩 테두리가 `border-hairline`(1.36:1) — 이번에 만든 규칙 미적용 | low | **수정** — `border-control`(3.11:1) |
| `.claude/settings.json`의 taskmaster 플러그인 변경이 함께 딸려옴 | low | **미조치** — 이 세션 시작 시점에 이미 수정돼 있던 변경입니다 |

리뷰어가 "확인 후 문제없음"으로 정리한 것: skip link 위치(`focus:absolute`가
`focus:not-sr-only`의 `position:static`을 이김), `animate-rise-in` 키프레임 방출,
타이포 토큰 동기화 테스트의 정규식 동작, `<dl>` 순서, Radix heading 레벨,
`--control`/`--on-inverse-muted`/`--primary` 대비 계산.

## `!important` 제거 (2026-08-09)

프로젝트 규칙으로 `!important`를 금지하고(`AGENTS.md` 강제 규칙 3),
기존 사용처를 전부 걷어냈습니다.

| 위치 | 이전 | 이후 |
|---|---|---|
| `styles/globals.css` `prefers-reduced-motion` | `!important` 4개 | `@layer base` **밖으로 이동**, `!important` 0개 |
| `components/home/reveal.tsx` `noscript` | `!important` 3개 | 레이어 밖 규칙, `!important` 0개 |

근거는 캐스케이드 레이어입니다. Tailwind v4는 유틸리티를 `@layer utilities`에
넣고, **레이어에 속하지 않은 선언이 레이어 안 선언을 특정도와 무관하게
이깁니다.** `@layer base`는 utilities보다 약해서 `!important`가 필요했지만,
레이어 밖으로 옮기니 필요가 없어졌습니다.

### 검증

```
빌드 산출 CSS의 !important : 5건 → 1건
남은 1건                    : [hidden]{display:none!important} — Tailwind preflight (우리 코드 아님)
prefers-reduced-motion 위치 : 중괄호 깊이 0 = @layer 밖 ✅
```

브라우저 실측:

```
[data-reveal] 레이어 밖 규칙 주입  → opacity 0→1, translate 0px 20px→none  ✅
* {transition-duration:0.01ms} 주입 → 0.7s → 1e-05s (=0.01ms)              ✅
```

첫 측정에서는 실패로 보였는데, `duration-700` 트랜지션의 **전이 시작값**을
읽었던 것이 원인이었습니다. 전이를 끄고 강제 리플로우 후 재측정해 확인했습니다.

### 부수적으로 발견한 것

문서에 `!` 접두사 예시를 **실제 클래스 이름으로** 적었더니 Tailwind가 `.md`
파일을 스캔해 그 유틸리티를 프로덕션 CSS에 생성했습니다. 금지 규칙을 적는
행위가 금지 대상을 배포한 셈입니다. 예시를 컴파일되지 않는 형태로 고쳤고,
`docs/design-guide.md`에 경고를 남겼습니다.

## 미해결 항목

1. **모바일 폭 전체 스크린샷 미실행.** 창 크기 조절이 동작하지 않았습니다.
   레이아웃 수치는 검증됐으나 눈으로 본 범위는 제한적입니다.
2. **브라우저 Tab 순회 미실행.** 포커스 순서가 DOM 순서와 같을 것으로 보이지만
   확인하지 않았습니다.
3. **`noscript` 폴백을 JS 끈 상태로 확인하지 않았습니다.** 캐스케이드가 이기는
   것은 실측했지만 JS 비활성 환경 자체는 재현하지 않았습니다.
   → 이 미검증 항목에서 실제 버그가 나왔습니다 (`transform` ↔ `translate`).
   Playwright로 JS 비활성 시나리오를 넣을 가치가 있습니다.
3-1. **하이드레이션이 끝나지 않는 경우** 히어로 아래가 빈 채로 남습니다.
   서버 HTML을 "보이는 상태"로 두고 클라이언트가 숨김을 켜는 구조로 뒤집으면
   해결됩니다.
3-2. **검색어가 아직 소비되지 않습니다.** `/map?q=…`까지는 옳게 만들지만
   `app/map/page.tsx`가 스텁이라 사용자 체감은 원본과 같습니다. Map 작업에서
   `searchParams.q`를 읽어야 합니다.
4. **`docs/design-guide.md`를 갱신하지 않았습니다.** 이번 작업에서 추가한 것들이
   가이드에 반영돼 있지 않습니다.
   - 마케팅 타이포 스케일 7개 (`text-hero` 등)
   - `control` / `on-inverse` / `on-inverse-muted` 색상 토큰
   - `--container-marketing`
   - 접근성 체크리스트에 **비텍스트 대비 3:1** 항목 없음
5. **배너 운영시간 "평일 09:00 – 22:00"을 실제 정보와 대조하지 않았습니다.**
6. **`@base-ui/react`와 `radix-ui`가 여전히 둘 다 설치돼 있습니다.**
   규칙에 따라 **삭제하지 않았고**, 이번 작업은 `radix-ui`만 썼습니다.
