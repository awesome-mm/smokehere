# 디자인 토큰 매핑표

> 상태: **완료** · 태스크 #1 · 2026-08-08

Claude Design의 `_ds/airbnb-design-system-.../tokens/*.css` 토큰을 이 저장소의
`styles/globals.css` 토큰으로 옮기는 1:1 표입니다. 모든 섹션 작업이 이 표를
기준으로 하며, **여기에 없는 값을 임의로 쓰지 않습니다.**

## 결론 요약

1. **로컬 토큰이 우선입니다.** 원격 `_ds`는 Figma를 그대로 옮겨 적은 것이고,
   로컬 `styles/globals.css`는 거기에 WCAG 대비 검증을 거친 결과입니다.
   원격 값을 그대로 가져오면 **대비가 나빠지는 지점이 3곳** 있습니다.
2. **`var(--X)`를 그대로 복사하면 안 됩니다.** 이름은 같은데 값이 다른 토큰이
   5개 있습니다. 특히 `--radius-xl`은 12px ↔ 32px로 벌어집니다.
3. **마케팅 스케일 타이포 토큰 7개를 새로 추가했습니다.** 기존 스케일은 제품
   UI용이라 h1이 28px에서 멈추는데, 랜딩 시안은 62px를 요구합니다.
4. **폰트는 Inter 하나로 갑니다.** 원본의 `--font-alt`(Lato)는 도입하지 않습니다.

## 색상

원본이 실제로 Home에서 쓰는 토큰만 옮깁니다.

| 원본 토큰 | 값 | 로컬 클래스 | 값 | 판단 |
|---|---|---|---|---|
| `--surface-page` / `--white` | `#ffffff` | `bg-background` / `text-white` | `#ffffff` | 동일 |
| `--surface-soft` / `--grey-100` | `#f8f8f8` | `bg-surface-soft` | `#f7f7f7` | 로컬 (차이 1/255, 무시 가능) |
| `--grey-900` | `#1c1b1b` | `bg-ink` / `text-ink` | `#222222` | **로컬** — 순수 검정에 가까운 값을 쓰지 않는다는 규약 |
| `--grey-800` / `--text-primary` | `#212121` | `text-ink` | `#222222` | 로컬 |
| `--grey-700` | `#3f3d3d` | `text-prose` | `#3f3f3f` | 로컬 (사실상 동일) |
| `--grey-500` / `--text-secondary` | `#707070` | `text-muted-foreground` | `#6a6a6a` | **로컬** — 5.41:1 > 4.95:1 |
| `--grey-300` | `#d9d9d9` | `border-strong` | `#c1c1c1` | 로컬 |
| `--hairline` | `#cccccc` | `border-hairline` | `#dddddd` | 로컬 |
| `--primary` | `#dd3f57` | `bg-primary` / `text-primary` | `#e00b41` | **로컬 — 필수.** 아래 참조 |
| `--rausch` | `#ff5a5f` | `text-brand` / `fill-brand` | `#ff385c` | 로컬. **비텍스트 전용** |

### ⚠ 액션 토큰은 shadcn variant와 이름이 겹치지만 뜻이 다릅니다

```css
--action-primary-bg:   var(--primary);    /* #dd3f57 */
--action-secondary-bg: var(--grey-900);   /* 어두운 채움 */
--action-disabled-bg:  var(--grey-300);
```

**원본의 secondary는 어두운 채움인데 shadcn의 `secondary`는 연회색(#f2f2f2)
입니다.** 이름만 같고 뜻이 반대입니다. 시안에서 `variant="secondary"`를 보고
`<Button variant="secondary">`로 옮기면 버튼이 배경에 묻힙니다.

| 원본 variant | 뜻 | 로컬 |
|---|---|---|
| primary | brand 채움 | `<Button>` (기본) |
| secondary | **grey-900 채움** | `variant="ghost"` + `bg-ink text-background` |
| tertiary | 아웃라인 | `variant="outline"` |

이 항목은 #3에서 잘못 매핑했다가 **#11 육안 확인에서 발견**했습니다.

### `--primary`를 원본 값으로 쓰면 안 되는 이유

원본 `#dd3f57`은 흰 텍스트 대비가 **4.27:1**로 WCAG AA(4.5:1)에 미달합니다.
로컬 `#e00b41`은 **4.89:1**로 통과합니다.

```
원본 primary #dd3f57 위 흰 텍스트    4.27:1  큰텍스트만
로컬 primary #e00b41 위 흰 텍스트    4.89:1  AA 통과
```

Home 시안은 이 색을 **배경**(배너)과 **텍스트**(eyebrow 라벨, FAQ +/− 기호, 카드
아이콘) 양쪽에 쓰기 때문에 두 방향 모두 문제가 됩니다. 흰 배경 위 `#dd3f57`
텍스트도 같은 4.27:1입니다.

계산은 WCAG 2.x 상대 휘도 공식으로 직접 수행했습니다(`docs/design-guide.md`의
기존 수치와 동일한 방법이며, `#e00b41` = 4.89:1로 재현됨).

### 옮기면서 대비가 깨지는 지점 3곳

| 위치 | 원본 | 대비 | 조치 | 담당 |
|---|---|---|---|---|
| 배너 보조 문구 (`opacity: 0.9` 흰 텍스트) | 흰색 90% / `#e00b41` | **4.13:1** ❌ | `opacity` 제거하고 순수 흰색(4.89:1) | #5 |
| 푸터 하단 저작권 바 | `#707070` / `#1c1b1b` | **3.47:1** ❌ | `text-muted-soft`(`#929292`) / `bg-ink` → **5.11:1** | #8 |
| 히어로 검색 인풋 테두리 | `#707070` (4.95:1) | — | 로컬 `border-hairline`은 **1.36:1**. 그대로 쓰면 원본보다 나빠짐 | #3 |

세 번째 항목은 기존 `components/ui/input.tsx`의 문제이기도 해서 별도 이슈로
기록했습니다 → [`docs/issue/2026-08-08-input-border-nontext-contrast.md`](../issue/2026-08-08-input-border-nontext-contrast.md)

## 폰트

| 원본 토큰 | 값 | 로컬 | 판단 |
|---|---|---|---|
| `--font-core` | Figtree | `font-sans` (Inter) | 로컬 |
| `--font-alt` | Lato | `font-sans` (Inter) | **로컬 — 두 번째 서체를 도입하지 않음** |

`--font-alt`는 원본에서 대문자 라벨, 로고, 통계 수치, 전화번호에 쓰입니다.
Lato를 추가하지 않는 이유:

- `docs/design-guide.md`가 이미 "폰트는 Inter" 하나로 시스템을 확정했습니다.
  두 번째 서체는 그 결정을 뒤집습니다.
- 해당 자리의 시각적 특징은 **서체가 아니라 자간·굵기·대문자화**에서 나옵니다.
  `--text-eyebrow`(0.16em 자간)로 그 효과를 재현합니다.
- Inter는 통계 수치에 필요한 tabular numeral을 갖고 있습니다.

**이 결정으로 원본과 미세하게 달라 보이는 것을 감수합니다.** 되돌리려면
`app/layout.tsx`에 `next/font/google`의 Lato를 추가하고 `--font-alt`를 정의하면
됩니다(패키지 설치 불필요).

## 라운딩

원본과 로컬이 **같은 이름에 다른 값**을 쓰는 가장 위험한 영역입니다.

| 원본 토큰 | 원본 값 | 로컬 클래스 | 로컬 값 | 원본 사용처 |
|---|---|---|---|---|
| `--radius-xs` | 4px | `rounded-xs` | 4px | — |
| `--radius-sm` | 5px | `rounded-xs` | 4px | — |
| `--radius-md` | 8px | `rounded-sm` | 8px | 내비 링크 호버, 배너 "금연상담" pill |
| `--radius-lg` | 10px | `rounded-md` | 14px | 통계 카드 |
| `--radius-xl` | 12px | `rounded-md` | 14px | **배너 컨테이너, 앱 기능 카드, 검색 인풋** |
| `--radius-chip` | 40px | `rounded-full` | — | 인기 검색 칩, 헤더 CTA |
| `--radius-circle` | 50% | `rounded-full` | — | 로고 링, 장식 마크 |

**`rounded-xl`을 쓰지 마세요.** 로컬에서 32px이며 원본 의도(12px)의 2.7배입니다.
원본이 `--radius-xl`을 쓴 자리는 전부 `rounded-md`(14px)로 갑니다. 이는
`docs/design-guide.md`의 "카드 = `rounded-md`" 규약과도 일치합니다.

검색 인풋만 예외적으로 판단이 갈립니다. 원본은 `--radius-xl`(12px)이지만
디자인 가이드는 "버튼·인풋 = `rounded-sm`(8px)"입니다 → **`rounded-sm`을 씁니다.**
높이 56px 인풋에서 8px과 12px의 차이는 크지 않고, 같은 줄의 버튼과 라운딩이
어긋나는 쪽이 더 눈에 띕니다.

## 타이포그래피

### 새로 추가한 마케팅 스케일 7개

원본은 62 / 40 / 34 / 30 / 17.5 / 11.5 / 10.5px를 쓰는데 기존 18개 토큰에
대응물이 없습니다. `styles/globals.css`와 `lib/utils.ts`에 **함께** 추가했습니다.

| 새 토큰 | 스펙 | 원본 사용처 |
|---|---|---|
| `text-hero` | `clamp(38px, 3.84vw + 23.6px, 62px)` / 1.08 / 800 / -0.035em | 히어로 h1 |
| `text-section-lg` | 40px / 1.25 / 800 / -0.03em | GET THE APP h2 |
| `text-section` | 34px / 1.2 / 800 / -0.03em | WHY&HOW · FAQ · 배너 h2 |
| `text-stat` | 30px / 1.1 / 700 / -0.02em | 통계 수치, 전화번호 |
| `text-lede` | 17.5px / 1.7 / 400 | 히어로 본문, 섹션 부제 |
| `text-eyebrow` | 11.5px / 1 / 600 / 0.16em | 섹션 상단 대문자 라벨 |
| `text-eyebrow-sm` | 10.5px / 1 / 600 / 0.14em | 푸터 컬럼 헤드, 헤더 부제 |

`text-eyebrow` / `text-eyebrow-sm`은 **`uppercase`와 함께** 써야 합니다.
Tailwind의 `--text-*` 토큰은 대문자 변환을 담지 못합니다.

#### `text-hero`가 clamp인 이유

원본은 브레이크포인트 2개로 62 → 46 → 38px를 계단식으로 내립니다. clamp 한 줄로
대체하면 섹션마다 반응형 오버라이드를 반복하지 않아도 됩니다.

| 뷰포트 | clamp 결과 | 원본 |
|---|---|---|
| 375px | 38.0px | 38px |
| 680px | 49.7px | 46px |
| 1000px | 62.0px | 62px |
| 1440px | 62.0px (상한) | 62px |

680px 부근에서 3.7px 커지는 것을 감수합니다. 계단식 점프가 없어지는 대가입니다.

### 기존 스케일로 흡수한 크기

원본의 나머지 크기는 새 토큰을 만들지 않고 기존 토큰으로 반올림합니다.

| 원본 | 로컬 토큰 | 스펙 | 차이 |
|---|---|---|---|
| 17px / 700 (FAQ 질문) | `text-title-md` | 16 / 600 | −1px, 굵기 한 단계 |
| 15.5px (본문, 앱 카드, 인풋) | `text-body-md` | 16 / 400 | +0.5px |
| 14.5px · 14px | `text-body-sm` | 14 / 400 | — |
| 13.5px · 13px | `text-caption-sm` | 13 / 400 | — |
| 12.5px · 12px | `text-micro-label` 또는 `text-caption-sm` | 12 / 700 · 13 / 400 | 섹션에서 판단 |
| 14px / 600 (내비 링크) | `text-nav-link` | 16 / 600 | +2px |

**`text-*` 토큰에 `font-bold`나 `leading-*`를 덧붙이지 마세요.** 굵기·행간·자간이
토큰 안에 이미 묶여 있습니다.

### ⚠ 이 결정은 기존 디자인 가이드와 충돌합니다

`docs/design-guide.md`는 이렇게 적고 있습니다.

> **디스플레이 굵기를 올리지 마세요.** h1이 28px인 것은 의도된 것입니다. 이
> 시스템은 타이포그래피 근육이 아니라 지도·사진·여백으로 위계를 만듭니다.

Home 시안의 62px/800 h1은 여기에 정면으로 어긋납니다. 그럼에도 도입한 이유:

- 기존 스케일은 **제품 UI**(지도, 카드, 목록)를 상정하고 만들어졌습니다.
  랜딩 페이지에는 위계를 만들 지도도 사진도 없습니다.
- 토큰 이름을 `text-hero` / `text-section` 계열로 분리해 **제품 UI로 새지
  않도록** 격리했습니다.

`docs/design-guide.md` 본문은 이번 작업에서 수정하지 않았습니다. 두 스케일이
공존한다는 사실을 가이드에 반영할지는 별도 판단이 필요합니다.

## 간격 · 크기

원본 `spacing.css`는 4px 기반이라 Tailwind 기본 스케일과 그대로 맞습니다.
별도 토큰을 만들지 않습니다.

| 원본 | 로컬 |
|---|---|
| 컨테이너 1180px | `max-w-marketing` (**신규 추가**, 73.75rem) |
| 섹션 세로 패딩 56px | `py-14` |
| 섹션 좌우 패딩 28px / 모바일 20px | `px-5 sm:px-7` |
| `--height-button-big` 56px | `<Button size="lg">` (h-14) |
| `--height-button-small` 48px | `<Button>` 기본 (h-12) |
| `--size-icon` 24px | `size-6` |
| 히어로 그리드 gap 56px | `gap-14` |
| 카드 그리드 gap 20px | `gap-5` |

## 테두리

원본 `borders.css`는 전부 `inset box-shadow` 방식이고 "드롭 섀도는 시스템 밖"이라고
명시합니다. 로컬은 실제 `border` + 단일 `shadow-float`를 씁니다.

Home 시안 자체는 `box-shadow`를 전혀 쓰지 않으므로 **이번 작업에서 그림자는
등장하지 않습니다.** 테두리는 전부 `border border-hairline`으로 갑니다.

## 이름은 같은데 값이 다른 토큰

`var(--X)`를 그대로 복사하면 조용히 다른 결과가 나오는 목록입니다.

| 토큰 | 원격 | 로컬 | 벌어지는 폭 |
|---|---|---|---|
| `--radius-xl` | 12px | 32px | **2.7배** |
| `--radius-md` | 8px | 14px | 1.75배 |
| `--radius-lg` | 10px | 20px | 2배 |
| `--radius-sm` | 5px | 8px | 1.6배 |
| `--primary` | `#dd3f57` | `#e00b41` | 대비 4.27 ↔ 4.89 |
| `--hairline` | `#cccccc` | `#dddddd` | 로컬이 더 연함 |
| `--surface-soft` | `#f8f8f8` | `#f7f7f7` | 무시 가능 |

**규칙: 섹션 구현에서 인라인 `style`이나 `var(--…)`를 쓰지 않습니다.**
전부 Tailwind 유틸리티로 옮기고, 이 표에 없는 값이 필요하면 표를 먼저 고칩니다.

## 한국어 줄바꿈 (#11에서 추가)

CSS 기본 `word-break: normal`은 한국어를 **글자 단위로** 끊습니다. 화면에서
"흡연구역을"이 `흡연구 / 역을`로 갈라지는 것을 보고 전역으로 고쳤습니다.

```css
/* styles/globals.css — body */
word-break: keep-all;      /* 어절을 붙여 둡니다 */
overflow-wrap: break-word; /* 한 어절이 컨테이너보다 길 때만 예외적으로 끊습니다 */
```

랜딩뿐 아니라 앞으로 만들 모든 한국어 화면에 적용됩니다.

## 변경한 파일

| 파일 | 변경 |
|---|---|
| `styles/globals.css` | 마케팅 타이포 토큰 7개, `--container-marketing`, `--control`, `--on-inverse(-muted)`, `--ease-reveal`, `--animate-rise-in`, `@keyframes rise-in`, `word-break: keep-all` |
| `lib/utils.ts` | `fontSizeTokens`에 새 토큰 7개 등록 (18 → 25개), `export` 추가 |
| `lib/__tests__/typography-tokens.test.ts` | **신규** — 토큰 목록 동기화 테스트 |

동기화 테스트는 `globals.css`의 `--text-*`를 추출해 `fontSizeTokens`와 **정확히
일치**하는지 검사합니다. 한쪽만 고치면 테스트가 실패하므로, 이 문서 상단의
"타이포 토큰은 두 파일을 함께 고쳐야 한다"는 주의가 이제 기계적으로 강제됩니다.

## 검증

```
npm run lint      통과 (출력 없음)
npx tsc --noEmit  통과 (출력 없음)
npm test          5 files / 60 tests 통과
npm run build     통과 — / · /map · /showcase 정적 생성
```

새 토큰을 아직 아무 컴포넌트도 쓰지 않으므로, **Tailwind가 `text-hero` 등의
유틸리티를 실제로 생성하는지는 확인되지 않았습니다.** Tailwind v4는 사용된
클래스만 생성하기 때문에 지금 단계에서는 확인할 방법이 없습니다. #2에서 헤더가
`text-eyebrow-sm`을 쓰는 순간 브라우저에서 확인합니다.
