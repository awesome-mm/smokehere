# 자주 묻는 질문

> 상태: **구현 완료** (테스트·브라우저 확인은 #11) · 태스크 #7 · 2026-08-08

## 범위

아코디언 4개. 원본의 직접 구현한 접힘 로직을 접근성 있는 구현으로 대체하는 것이
이 섹션의 본질입니다.

## 원본

`Home.dc.html` → 두 번째 `data-r="two"` 블록, 데이터는 스크립트의 `FAQS` 배열

원본 구현의 문제:

- `<div onClick>`으로 토글 → **키보드로 조작 불가**
- `scrollHeight`를 직접 재서 `max-height`를 계산 → resize마다 재측정 + `forceUpdate`
- `aria-expanded` / `aria-controls` 없음

## 구현 대상

`components/home/faq-section.tsx` — `"use client"`

## 아코디언 구현 방식 선택

**이미 설치된 `radix-ui`의 Accordion을 씁니다. 새 패키지를 설치하지 않았습니다.**

설치본에서 직접 확인했습니다.

```
radix-ui 버전: 1.6.7
Accordion 하위: Accordion, AccordionContent, AccordionHeader,
                AccordionItem, AccordionTrigger, Content, Header,
                Item, Root, Trigger, createAccordionScope
```

높이 애니메이션도 이미 있는 것으로 해결됩니다. `tw-animate-css`가
`--animate-accordion-down` / `--animate-accordion-up`을 정의하고, 키프레임이
Radix의 `--radix-accordion-content-height`를 참조합니다.

```
--animate-accordion-down: accordion-down …
@keyframes accordion-up { from { height: var(--radix-accordion-content-height, …
```

즉 `data-[state=open]:animate-accordion-down` 한 줄로, 원본이 60줄에 걸쳐
`scrollHeight`를 재던 일이 끝납니다.

### 택하지 않은 대안

| 대안 | 기각 이유 |
|---|---|
| 원본 방식(`scrollHeight` 측정)을 그대로 이식 | 키보드 조작이 불가능합니다. 고치려면 결국 버튼 + aria 속성을 직접 다 만들어야 하는데, 그게 Radix가 하는 일입니다 |
| `<details>/<summary>` | 마크업은 가장 단순하지만 높이 애니메이션을 걸 수 없고, 한 번에 하나만 열리는 동작을 JS 없이 만들 수 없습니다 |
| `@base-ui/react`의 Accordion | 설치돼 있긴 하지만 기존 UI 컴포넌트 4개가 전부 `radix-ui`를 씁니다. 두 라이브러리를 섞으면 접근성 구현이 갈립니다 |

`@base-ui/react`와 `radix-ui`가 둘 다 설치돼 있는 것은
`docs/issue/README.md`의 "아직 정리되지 않은 관찰"에 이미 기록돼 있습니다.
**이번에도 삭제하지 않았습니다.**

## 결정 기록

### `+` / `−` 를 아이콘 두 개의 교체로 구현

원본은 기호를 텍스트로 넣고 180도 회전 트랜지션을 겁니다.

```html
<span style="… transform: rotate({{ f.spin }}deg);">{{ f.sign }}</span>
```

**`+`와 `−`는 180도 돌려도 같은 모양이라 이 회전은 화면에 드러나지 않습니다.**
실제로 보이는 변화는 기호 교체뿐이므로, lucide `Plus` / `Minus`를 상태에 따라
보이고 감추는 방식으로 옮겼습니다. 둘 다 `aria-hidden`이며 열림 여부는
Radix가 붙이는 `aria-expanded`가 전달합니다.

### 질문은 `<h3>`

`Accordion.Header`가 기본으로 `<h3>`을 렌더합니다. 섹션 제목 h2("자주 묻는 질문")
아래 h3가 오므로 레벨이 건너뛰지 않습니다.

### `prefers-reduced-motion`

`styles/globals.css`가 이미 전역으로 애니메이션 지속시간을 0.01ms로 낮춥니다.
아코디언은 CSS 애니메이션이라 이 처리에 그대로 걸립니다. 별도 분기를 두지
않았습니다.

## 원본과 의도적으로 다른 부분

| 항목 | 원본 | 구현 | 이유 |
|---|---|---|---|
| 토글 요소 | `<div onClick>` | `<button>` (Radix Trigger) | 키보드로 조작할 수 있어야 합니다 |
| 상태 전달 | 없음 | `aria-expanded`, `aria-controls`, `role="region"` | Radix가 자동으로 붙입니다 |
| 높이 계산 | `scrollHeight` 직접 측정 + resize 리스너 | CSS 애니메이션 + Radix CSS 변수 | 측정 코드와 `forceUpdate`가 사라집니다 |
| 기호 | 텍스트 `+` / `−` + 180도 회전 | lucide `Plus` / `Minus` 교체 | 회전은 시각적으로 무의미했습니다 |
| 질문 크기 | 17px / 700 | `text-title-md` (16 / 600) | 매핑표의 반올림 규칙 |
| 이메일 | 일반 텍스트 | `mailto:` 링크 + 밑줄 | 연락 수단은 눌려야 합니다 |
| 목록 하단 | 빈 `<div>`로 마지막 구분선 | `border-b`를 Root에 지정 | 의미 없는 빈 요소를 만들지 않습니다 |
| 그리드 전환점 | 1000px | `lg` (1024px) | Tailwind 기본 브레이크포인트 |

## 검증

```
npm run lint      통과 (출력 없음)
npx tsc --noEmit  통과 (출력 없음)
```

**아직 렌더 동작을 확인하지 않았습니다.** 특히 다음 두 가지는 #11에서
테스트로 확인해야 합니다.

- `defaultValue="faq-0"`으로 첫 항목이 실제로 열린 채 시작하는가
- `collapsible`이 걸려 열린 항목을 다시 눌러 닫을 수 있는가

## 남은 과제

- **테스트 미작성** (#11) — 열림/닫힘, `aria-expanded`, 키보드 조작
- **브라우저 육안 확인 미실행** (#11) — 높이 애니메이션이 실제로 동작하는지
