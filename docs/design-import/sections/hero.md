# Hero

> 상태: **구현 완료** (브라우저 확인·테스트는 #11) · 태스크 #3 · 2026-08-08

## 범위

2단 그리드. 좌측은 대문자 라벨 → h1 → 본문 → 검색 폼 → 인기 검색 칩 → 스토어 버튼,
우측은 통계 카드 4개.

## 원본

`Home.dc.html` → `data-r="hero"`, `data-r="stats"` 블록
데이터는 하단 `<script type="text/x-dc">`의 `popular`, `heroStats`

## 구현 대상

- `components/home/hero-section.tsx` — `"use client"`
- `components/home/hero-stats.tsx`

## 결정 기록

### 클라이언트 경계를 히어로에서 끊음

랜딩에서 상태를 가지는 곳은 검색 입력 하나뿐입니다. 여기서만 `"use client"`를
선언하고 나머지 섹션은 서버 컴포넌트로 남깁니다.

### 검색어를 버리지 않고 지도로 넘김

원본은 제출 시 입력값을 **버리고** `Map.dc.html`로 이동만 합니다.

```js
onSearch: (e) => { e.preventDefault(); location.href = "Map.dc.html"; },
```

입력을 받아 놓고 쓰지 않는 것은 사용자를 속이는 동작이라 `/map?q=…`로
넘기도록 했습니다. 인기 검색 칩도 같은 형식을 씁니다. Map 페이지에서 이
파라미터를 읽는 것은 Map 작업 범위입니다.

### 통계 카드를 `<dl>`로 구조화

수치와 라벨은 정의 목록입니다. 다만 `<dl>`은 `<dt>`가 `<dd>`보다 앞에 와야
유효한데, 시각 순서는 수치가 먼저입니다. DOM 순서는 규격대로 두고
`flex-col-reverse`로 화면 순서만 뒤집었습니다.

### 공유 `Input`의 테두리를 근본 수정

원본 검색 인풋은 `border: 1px solid var(--grey-500)`(#707070, 4.95:1)인데
로컬 `Input`은 `border-hairline`(#dddddd, **1.36:1**)이라 그대로 옮기면
원본보다 접근성이 나빠지는 상황이었습니다.

히어로에만 덧칠하지 않고 이슈 문서의 **방안 B**를 적용했습니다.

```css
/* styles/globals.css */
--control: oklch(0.66 0 0);   /* #929292 — 흰 배경 위 3.11:1 */
--color-control: var(--control);
```

```tsx
/* components/ui/input.tsx */
- border border-hairline
+ border border-control
```

장식용 `hairline`과 컴포넌트 경계용 `control`이 토큰 이름으로 분리돼, 앞으로
폼이 늘어나도 같은 판단을 반복하지 않습니다.
→ `docs/issue/2026-08-08-input-border-nontext-contrast.md`

## lucide-react 아이콘 대체 매핑

`node -e "require('lucide-react')"`로 **lucide-react 1.30.0에 실제로 존재하는지
확인**한 뒤 확정했습니다.

| 원본 (Material) | lucide-react | 근거 |
|---|---|---|
| `PhoneIphone` | `Smartphone` | 존재 확인됨 |
| `Android` | `Play` | 존재 확인됨. Google Play의 재생 삼각형에 대응 |

**lucide는 브랜드 로고를 제공하지 않습니다.** 상표 문제로 브랜드 아이콘 세트가
제거됐습니다. `Apple`은 존재하지만 **과일 사과**이지 Apple 사의 마크가 아니라
쓰지 않았습니다.

실제 배포 전에는 Apple / Google이 배포하는 **공식 배지 에셋**으로 교체해야
합니다. 두 회사 모두 배지의 형태·여백·문구를 가이드라인으로 규정하고 있어
아이콘 + 텍스트 조합으로 대체하는 것은 임시입니다.

## 원본과 의도적으로 다른 부분

| 항목 | 원본 | 구현 | 이유 |
|---|---|---|---|
| 본문 문단 | `width: 460px; height: 88px` + `<br>` | `max-w-[30rem]` + **`<br>` 유지** | 고정 크기만 뺐습니다. 한국어 줄 수가 달라지면 넘치거나 빕니다. `<br>`은 문장을 나누는 조판이라 유지 — 경위는 `banner.md`의 "개행을 되돌린 이유" |
| h1 크기 | 62 / 46 / 38px 계단식 | `text-hero` = `clamp(38px, …, 62px)` | 브레이크포인트 오버라이드 제거 (매핑표) |
| 검색 인풋 라운딩 | `--radius-xl` (12px) | `rounded-sm` (8px) | 같은 줄의 버튼과 라운딩을 맞춥니다 (매핑표) |
| 검색 인풋 라벨 | 없음 (placeholder만) | `<label class="sr-only">` | placeholder는 라벨이 아닙니다. 입력을 시작하면 사라집니다 |
| 인기 검색 칩 | `<a>` 나열 | `<ul>/<li>` | 목록입니다 |
| 스토어 버튼 | `secondary` / `tertiary` variant | **어두운 채움** / `outline` | 아래 "육안 확인에서 고친 것" 참조 |
| 인기 검색 칩 | 29px 높이 | `min-h-11` (44px) | 터치 타깃. DS 자체는 `--height-chip: 39px`를 정의합니다 |
| 스토어 버튼 크기 | 190 × 52px | `w-48 h-13` (192 × 52px) | Tailwind 스케일에 맞춤 |
| 그리드 전환점 | 1000px | `lg` (1024px) | Tailwind 기본 브레이크포인트 |

## 육안 확인에서 고친 것 (#11)

### App Store 버튼의 variant를 잘못 매핑했음

`variant="secondary"`(shadcn, `#f2f2f2`)로 옮겼더니 페이지 배경(`#f7f7f7`)과
거의 같아 **버튼으로 보이지 않았습니다.** 원본 디자인 시스템을 다시 보니

```css
/* _ds/.../tokens/colors.css */
--action-secondary-bg: var(--grey-900);
```

원본의 secondary는 **어두운 채움**입니다. shadcn의 `secondary`와 이름만 같고
뜻이 반대였습니다. 매핑표가 색상 토큰만 대조하고 **액션 토큰
(`--action-*-bg`)은 대조하지 않아** 놓친 항목입니다.

`bg-ink text-background`로 고쳤습니다.

### 인기 검색 칩이 터치 타깃 미달

실측 30px. `min-h-11`(44px)로 올렸습니다. 시안은 29px이지만 디자인 시스템
자체는 `--height-chip: 39px`를 정의하고 있어, **시안 쪽이 시스템에서 벗어난
값**이었습니다.

## 검증 (#11)

```
검색 인풋 56px · 검색 버튼 56px · 스토어 버튼 52px · 인기 검색 칩 44px
인풋 테두리 실제 색 lab(60.56 0 0) = #929292 (control 토큰)
h1: 384px→38.3px / 762px→52.9px / 994px→61.8px / 1094px 이상→62px
```

테스트 6개 통과 (`components/home/__tests__/hero-section.test.tsx`).

## 남은 과제

- 스토어 버튼이 현재 `/map`으로 갑니다. 실제 앱이 없으므로 원본과 동일한
  동작이지만, 앱 스토어 링크처럼 보이는 것이 오해를 부를 수 있습니다.
- 배포 전 Apple / Google 공식 배지 에셋으로 교체가 필요합니다.
