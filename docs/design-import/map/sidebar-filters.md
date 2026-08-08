# 사이드바 검색·도시·형태 필터

> 상태: **완료** (브라우저 확인은 #19) · 태스크 #14 · 2026-08-09

## 범위

사이드바 상단의 검색 입력과 두 줄의 칩 필터.

## 원본

`Map.dc.html` → `<aside>` 상단 블록, 스크립트의 `cities` / `filters`

## 구현 대상

| 파일 | 역할 |
|---|---|
| `components/map/map-search.tsx` | 검색 입력 |
| `components/map/city-filter.tsx` | 도시 — **단일 선택** |
| `components/map/kind-filter.tsx` | 형태 — **다중 선택** |
| `components/map/__tests__/filters.test.tsx` | 테스트 9개 |

## 단일/다중 선택 ARIA 패턴 — 이 태스크의 핵심 결정

시안은 **둘 다 똑같은 `<button>`** 입니다. 겉모습이 같은 칩이니 마크업도 같습니다.

```html
<!-- 도시: 하나만 선택되는데 -->
<button onClick="{{ c.select }}" style="background: {{ c.bg }}; ...">{{ c.name }}</button>
<!-- 형태: 여러 개 선택되는데 -->
<button onClick="{{ f.toggle }}" style="background: {{ f.bg }}; ...">{{ f.label }}</button>
```

보조기술 입장에서는 **둘 다 그냥 버튼 5개, 버튼 3개**입니다. 무엇이 선택됐는지,
하나만 고를 수 있는지 여럿인지 알 방법이 없습니다.

### 택한 것 — 감춘 네이티브 입력 + 라벨

| 필터 | 요소 | 이유 |
|---|---|---|
| 도시 | `<input type="radio">` + `<fieldset><legend>` | "여럿 중 하나"라는 관계가 마크업에 있음 |
| 형태 | `<input type="checkbox">` + `<fieldset><legend>` | 각각 독립 토글 |

`sr-only`로 입력을 감추고 형제 `<span>`을 `peer-checked:`로 칩처럼 그립니다.

### `role="radiogroup"`을 직접 쓰지 않은 이유

ARIA 라디오그룹은 **roving tabindex를 손으로 구현**해야 합니다 — 그룹 전체가 탭
정지 하나, 방향키로 항목 이동, 선택 이동 시 포커스 동기화. 네이티브 라디오는
브라우저가 전부 해 줍니다. 직접 만들 이유가 없습니다.

### `aria-pressed` 버튼을 쓰지 않은 이유

형태 필터에는 `aria-pressed`도 맞습니다. 다만 `<fieldset>/<legend>`로 얻는
**그룹 이름**("흡연구역 형태")이 없어집니다. 도시 필터와 마크업 구조를 맞추는
편이 읽기도 쉬워 체크박스로 통일했습니다.

## 색상만으로 상태를 전달하지 않기

시안의 형태 칩은 선택 여부를 **색으로만** 구분합니다.

```js
bg: on ? "var(--grey-100)" : "var(--white)",
fg: on ? "var(--primary)" : "var(--text-secondary)",
border: on ? "var(--primary)" : "var(--hairline)",
```

배경은 #f8f8f8 ↔ #ffffff로 거의 같고, 차이는 사실상 **테두리와 글자의 색상(hue)**
뿐입니다. 적록색약 사용자에게는 brand 빨강과 회색이 구분되지 않을 수 있습니다.

선택 시 **체크 아이콘**을 함께 표시하도록 했습니다 (`peer-checked:[&>svg]:block`).
도시 칩은 배경/글자가 명도 반전(어두운 채움 ↔ 흰 배경)이라 색상 없이도 구분되고,
라디오의 `checked`가 보조기술에 전달됩니다.

## 그 외 결정

### 검색은 `<form>`이 아니다

입력할 때마다 목록이 걸러지고 제출 버튼이 없습니다. `role="search"` 영역으로
감싸고 라벨은 `sr-only`로 붙였습니다.

### 검색 입력 높이 48px 유지

시안은 48px, 폰트 14.5px입니다. 로컬 `Input`이 이미 h-12(48px) + `text-body-md`
(16px)이라 그대로 씁니다. **16px은 iOS Safari의 자동 확대를 막기 위한 값**이라
14.5px로 낮추지 않았습니다 (`components/ui/input.tsx` 주석).

### 아이콘

시안은 빈 `<div>`에 테두리만 둘러 돋보기 원을 그립니다. lucide `Search`로
바꿨습니다. `pointer-events-none`으로 입력 클릭을 막지 않습니다.

### 터치 타깃 44px

칩을 `min-h-11`로 잡았습니다. 시안은 도시 칩 ~31px, 형태 칩 ~29px로 둘 다
미달입니다. Home에서 이미 같은 판단을 했고, 디자인 시스템 자체가
`--height-chip: 39px`를 정의하고 있습니다.

### 칩 테두리는 `border-control`

도시 칩은 인터랙티브 컨트롤이라 WCAG 1.4.11의 3:1이 필요합니다.
`border-control`(#929292, 3.11:1)을 씁니다. 형태 칩은 미선택 시 `border-hairline`
인데, 체크 아이콘과 라벨 텍스트가 컨트롤의 존재를 알리므로 테두리가 유일한
식별 수단이 아닙니다. **#19 브라우저 확인에서 재검토할 항목입니다.**

## 원본과 의도적으로 다른 부분

| 항목 | 원본 | 구현 | 이유 |
|---|---|---|---|
| 도시 칩 | `<button>` | `<input type="radio">` + fieldset | 단일 선택 관계를 마크업에 담음 |
| 형태 칩 | `<button>` | `<input type="checkbox">` + fieldset | 다중 선택 |
| 선택 표시 | 색상만 | 색상 + 체크 아이콘 + checked 상태 | 색각 이상 대응 |
| 칩 높이 | 29~31px | 44px | 터치 타깃 |
| 검색 아이콘 | 빈 div + border-radius | lucide `Search` | 프로젝트 아이콘 세트 |
| 검색 폰트 | 14.5px | 16px (`text-body-md`) | iOS 자동 확대 방지 |

## 검증

```
npm run lint      통과 (출력 없음)
npx tsc --noEmit  통과 (출력 없음)
npm test          9 files / 103 tests 통과 (필터 9개 포함)
```

테스트가 고정하는 것: 라디오 5개/체크박스 3개로 노출, 그룹 이름, 단일 선택
동작, 다중 선택 동작, 재클릭 해제, 스페이스바 토글.

## 남은 과제

- **브라우저 육안 확인 미실행** (#19). 특히 `sr-only` 입력의 포커스 링이
  형제 `<span>`에 제대로 나타나는지 눈으로 봐야 합니다.
- 가로 스크롤되는 도시 칩 줄이 좁은 화면에서 키보드로 접근 가능한지 확인
- 형태 칩 미선택 상태의 테두리 대비 재검토
