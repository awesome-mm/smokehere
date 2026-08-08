# Input 테두리가 WCAG 비텍스트 대비 3:1에 미달한다

| 항목 | 내용 |
|---|---|
| 위험도 | **7 / 10** |
| 분류 | 접근성 규약 위반 (조용한 실패) |
| 발견일 | 2026-08-08 |
| 상태 | **해결됨** (2026-08-08, 방안 B 적용) |
| 관련 파일 | `components/ui/input.tsx`, `styles/globals.css` |

위험도 근거: 빌드·린트·타입·테스트가 전부 통과하고 화면도 "이상해 보이지 않는"
silent failure(기준 7~8). 프로젝트가 WCAG 준수를 **강제 규약**으로 걸고 있어 **+1**,
영향이 한 컴포넌트에 국한되고 수정이 한 줄이라 **−1** → **7**.

## 1. 이슈 내용

### 증상

`components/ui/input.tsx`의 기본 테두리가 `border-hairline`(`#dddddd`)입니다.

```tsx
"h-12 w-full min-w-0 rounded-sm border border-hairline bg-background px-4 …"
```

인풋 배경은 `bg-background`(`#ffffff`)이고 랜딩 페이지 배경도 흰색 계열이라,
**이 1px 테두리가 입력 필드의 경계를 알려 주는 유일한 시각 정보**입니다.

흰 배경 위 `#dddddd`의 대비는 **1.36:1**입니다.

```
로컬 hairline #dddddd / 흰 배경       1.36:1  미달
로컬 border-strong #c1c1c1 / 흰 배경   1.80:1  미달
원본 인풋 테두리 #707070 / 흰 배경      4.95:1  AA 통과
```

### 위반 조항

WCAG 2.2 **1.4.11 Non-text Contrast (AA)** 는 "사용자 인터페이스 컴포넌트를
식별하는 데 필요한 시각 정보"에 **3:1 이상**을 요구합니다. 입력 필드의 경계는
여기에 해당합니다. 1.36:1은 요구치의 절반에도 못 미칩니다.

`docs/design-guide.md`의 접근성 체크리스트는 **텍스트** 대비(4.5:1)만 항목으로
갖고 있어 이 항목이 점검망에서 빠져 있었습니다.

### 발견 경위

Claude Design의 `Home.dc.html`을 옮기던 중 발견했습니다. 원본 시안은 검색
인풋에 `border: 1px solid var(--grey-500)`(`#707070`, 4.95:1)를 씁니다.
로컬 토큰으로 그대로 매핑하면 **원본보다 접근성이 나빠지는** 상황이라 대비를
계산하다가 드러났습니다.

즉 원본 디자인 쪽이 이 지점에서는 더 정확했습니다.

### 근본 원인

`--hairline`(`#dddddd`)은 **구분선(divider)** 용도로 정해진 값입니다. 구분선은
순수 장식이라 WCAG 대비 요구에서 면제됩니다. 그 값을 **컴포넌트 경계**에도
그대로 쓴 것이 원인입니다. 두 용도는 요구 조건이 다릅니다.

| 용도 | 대비 요구 | 적정 토큰 |
|---|---|---|
| 섹션 구분선, 카드 사이 hairline | 없음 (장식) | `hairline` `#dddddd` (1.36:1) |
| 입력 필드·버튼 아웃라인 등 컴포넌트 경계 | **3:1** | 현재 적정 토큰 **없음** |

`border-strong`(`#c1c1c1`, 1.80:1)이 후보처럼 보이지만 이것도 미달입니다.

## 2. 대응

발견 시점(#1)에는 토큰 매핑 범위를 넘어 보류했고, 히어로 검색창을 구현하는
#3에서 **방안 B(경계 전용 토큰 신설)** 를 적용했습니다.

```css
/* styles/globals.css */
--control: oklch(0.66 0 0);        /* #929292 — 흰 배경 위 3.11:1 */
--color-control: var(--control);   /* @theme inline */
```

```tsx
/* components/ui/input.tsx */
- "… border border-hairline bg-background …"
+ "… border border-control bg-background …"
```

히어로에만 덧칠하는 방식을 택하지 않은 이유는, 그렇게 하면 같은 판단을
폼이 늘어날 때마다 반복해야 하고 공유 `Input`은 여전히 미달로 남기 때문입니다.

### 검증

```
npm run lint      통과
npx tsc --noEmit  통과
npm test          5 files / 60 tests 통과
```

기존 `input.test.tsx`는 rest 상태 테두리를 단언하지 않아 깨지지 않았습니다.
**이것 자체가 약점이라** 아래 재발 방지 항목에 남깁니다.

## 3. 해결 방안 및 더 나은 방법

### 방안 A — Input만 고친다 (최소)

```tsx
- "… border border-hairline bg-background …"
+ "… border border-muted-soft bg-background …"
```

`muted-soft`(`#929292`)는 흰 배경 위 **3.11:1**로 1.4.11을 통과합니다.
한 줄이면 끝나고 다른 컴포넌트에 영향이 없습니다.

다만 `muted-soft`는 원래 "비활성 텍스트 전용"으로 정의된 토큰이라, 테두리
용도로 빌려 쓰면 **토큰의 의미가 흐려집니다.**

### 방안 B — 경계 전용 토큰을 새로 만든다 (권장)

```css
/* 컴포넌트 경계 전용. WCAG 1.4.11의 3:1을 만족해야 합니다 */
--border-control: oklch(0.66 0 0); /* #929292 — 흰 배경 위 3.11:1 */
```

`--color-border-control`로 노출하고 인풋·아웃라인 버튼·체크박스가 함께 씁니다.
장식용 `hairline`과 용도가 분리되어 다음 사람이 같은 실수를 하지 않습니다.

**방안 B를 권합니다.** 이 프로젝트는 앞으로 폼 컴포넌트가 더 늘어날 것이고
(제보 폼, 검색 필터), 그때마다 같은 판단을 반복하지 않으려면 토큰이 필요합니다.

### 함께 넣을 재발 방지 장치

- `docs/design-guide.md` 접근성 체크리스트에 **비텍스트 대비 3:1** 항목 추가
  (현재 텍스트 4.5:1만 있음)
- `components/ui/__tests__/input.test.tsx`에 테두리 클래스 단언 추가

## 4. 남은 위험

- **테스트가 rest 상태 테두리를 단언하지 않습니다.** 누군가 `border-control`을
  다시 `border-hairline`으로 되돌려도 60개 테스트가 전부 통과합니다. #11에서
  단언을 추가합니다.
- **`docs/design-guide.md`의 접근성 체크리스트에 비텍스트 대비 항목이 아직
  없습니다.** 텍스트 4.5:1만 있습니다.
- **같은 문제가 다른 컴포넌트에도 있을 수 있습니다.** `tabs.tsx`의
  `border-transparent`, `dialog.tsx`의 `border-hairline`은 이번에 대비를
  계산하지 않았습니다.
- `focus-visible` 상태는 `border-ink` + `ring-2`로 바뀌므로 **포커스 시에는
  문제가 없습니다.** 미달인 것은 기본(rest) 상태입니다.
