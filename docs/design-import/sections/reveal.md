# 스크롤 리빌 애니메이션

> 상태: **구현 완료** (브라우저 확인은 #11) · 태스크 #9 · 2026-08-08

## 범위

뷰포트 진입 시 요소가 아래에서 떠오르는 등장 애니메이션.

## 원본

`Home.dc.html` → `<style>`의 `[data-reveal]` / `@keyframes riseIn`,
스크립트의 `componentDidMount` IntersectionObserver 블록

## 구현 대상

- `components/home/reveal.tsx` — `Reveal`, `RevealNoScriptFallback`
- `styles/globals.css` — `--ease-reveal`, `--animate-rise-in`, `@keyframes rise-in`

## 사양

| 항목 | 값 | 원본과 동일 |
|---|---|---|
| 이동 | `translate-y-5` (20px) → `0` | 원본 22px |
| 투명도 | `0` → `1` | ✅ |
| 지속시간 | `duration-700` | ✅ |
| 감속 곡선 | `ease-reveal` = `cubic-bezier(0.22, 0.61, 0.36, 1)` | ✅ |
| threshold | `0.12` | ✅ |
| rootMargin | `0px 0px -8% 0px` | ✅ |
| 반복 | 없음 (`unobserve`) | ✅ |

곡선은 인라인 arbitrary 값 대신 `--ease-reveal` 토큰으로 등록했습니다.

## 결정 기록

### motion 패키지를 설치하지 않음

`package.json`의 dependencies에 `motion`이 **없습니다.** CSS 트랜지션 +
IntersectionObserver로 충분히 구현되는 동작이라 설치하지 않았습니다.

원본도 라이브러리 없이 CSS 트랜지션만 씁니다. 여기에 애니메이션 라이브러리를
들이면 랜딩 첫 화면의 JS 번들만 커집니다.

### 대상을 DOM 순회로 추측하지 않음

원본은 이렇게 대상을 찾습니다.

```js
root.querySelectorAll("section > div > *").forEach((el) => {
  if (el.closest("header") || el.hasAttribute("data-reveal")) return;
  if (el.getBoundingClientRect().height < 8) return;
  el.setAttribute("data-reveal", "");
  io.observe(el);
});
```

셀렉터가 DOM 구조에 묶여 있어, 섹션 안에 `<div>`를 하나 더 감싸는 순간 대상이
바뀝니다. `getBoundingClientRect().height < 8` 같은 조건도 레이아웃에 따라
결과가 달라집니다. React에서는 트리가 자주 바뀌므로 감쌀 곳을 명시하는 방식으로
바꿨습니다.

```tsx
<Reveal>
  <AboutSection />
</Reveal>
```

### 콘텐츠가 사라지지 않도록 세 겹의 보호

**원본의 가장 위험한 부분입니다.** `[data-reveal]`의 초기 상태가 `opacity: 0`
이라, IntersectionObserver가 동작하지 않으면 페이지가 빈 화면이 됩니다.

| 경로 | 처리 |
|---|---|
| IntersectionObserver 미지원 | `!("IntersectionObserver" in window)` → 즉시 표시 |
| `prefers-reduced-motion: reduce` | 즉시 표시. 숨겼다 보이는 깜빡임도 없앱니다 |
| JS 자체가 없음 | `<RevealNoScriptFallback />`의 `<noscript>` 스타일이 되돌립니다 |

```tsx
<noscript>
  <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
</noscript>
```

`RevealNoScriptFallback`은 **페이지당 한 번만** 렌더합니다 (#10).

### effect 본문의 동기 setState를 피함

첫 구현에서 린트가 잡았습니다.

```
react-hooks/set-state-in-effect
  41 |       setState(true)
     |       ^^^^^^^^ Avoid calling setState() directly within an effect
```

즉시 표시 경로를 `requestAnimationFrame`으로 한 프레임 미뤄 해결했습니다.
IntersectionObserver 콜백 안의 `setShown`은 콜백이라 문제가 되지 않습니다.

### 히어로는 스크롤을 기다리지 않음

원본은 히어로 섹션에 `animation: riseIn 0.6s ease both`를 직접 겁니다.
첫 화면이 스크롤을 기다리면 안 되기 때문입니다. `--animate-rise-in` 토큰과
`@keyframes rise-in`으로 옮겼습니다 (#10에서 히어로에 적용).

## 원본과 의도적으로 다른 부분

| 항목 | 원본 | 구현 | 이유 |
|---|---|---|---|
| 대상 선정 | `querySelectorAll` DOM 순회 | 명시적 `<Reveal>` 래퍼 | 셀렉터가 DOM 구조에 묶여 있습니다 |
| 이동 거리 | 22px | 20px (`translate-y-5`) | Tailwind 스케일 |
| IO 미지원 | 처리 없음 (`return`만) → **콘텐츠 영영 안 보임** | 즉시 표시 | 접근성·견고성 |
| reduced-motion | 애니메이션만 끔 (초기 opacity 0은 유지) | 즉시 표시 | 원본은 `[data-reveal]` 규칙만 덮어써 실제로는 동작했지만, JS 경로에서는 여전히 위험합니다 |
| `@keyframes drift` | 정의됨 | **옮기지 않음** | 원본 어디에서도 쓰이지 않습니다 |
| resize 재측정 | `window.addEventListener("resize", …)` + `forceUpdate` | 없음 | FAQ 높이 계산용이었고, 그 계산 자체가 사라졌습니다 (#7) |

## 코드 리뷰에서 잡힌 버그 — `transform`으로는 되돌려지지 않았음

`<noscript>` 폴백이 이랬습니다.

```css
[data-reveal]{opacity:1;transform:none}
```

**투명도만 돌아오고 20px 오프셋은 남습니다.** Tailwind v4의 `translate-y-*`가
`transform`이 아니라 독립 `translate` 속성으로 컴파일되기 때문입니다.

```css
.translate-y-5{--tw-translate-y:calc(var(--spacing) * 5);
               translate:var(--tw-translate-x) var(--tw-translate-y)}
```

JS를 끄면 네 섹션이 자기 박스보다 20px 아래로 그려져 다음 섹션의 구분선과
겹칩니다. 자동 검증은 전부 통과하고 JS가 켜져 있으면 정상으로 보여 발견이
어렵습니다. `translate:none`으로 고쳤습니다.
→ `docs/issue/2026-08-08-tailwind-v4-translate-not-transform.md`

## `!important`를 쓰지 않는 이유와 근거

폴백은 유틸리티(`opacity-0`, `translate-y-5`)를 덮어써야 하지만 `!important`를
쓰지 않습니다 (`AGENTS.md` 강제 규칙 3).

Tailwind v4는 유틸리티를 `@layer utilities`에 넣고, **캐스케이드 레이어 규칙상
레이어에 속하지 않은 선언이 레이어 안 선언을 이깁니다.** `<noscript>` 안의
`<style>`은 레이어 밖이라 그대로 이깁니다.

브라우저에서 실제로 측정했습니다.

```
before                : opacity 0,  translate 0px 20px
레이어 밖 규칙 주입 후 : opacity 1,  translate none     ✅
```

**첫 측정은 실패로 나왔습니다.** 대상 요소에 `duration-700` 트랜지션이 걸려 있어
주입 직후 읽은 값이 전이 시작값이었기 때문입니다. `transition-property: none`으로
전이를 끄고 강제 리플로우 후 다시 재어 확인했습니다. 측정 방법이 틀렸던 것이지
캐스케이드가 실패한 것이 아니었습니다.

## 검증

```
npm run lint      통과 (출력 없음)
npx tsc --noEmit  통과 (출력 없음)
브라우저          레이어 밖 규칙이 important 없이 유틸리티를 덮어씀 (실측)
```

## 남은 과제

- **`noscript` 폴백을 JS를 실제로 끈 상태에서 확인하지 않았습니다.** 캐스케이드가
  이긴다는 것은 측정했지만 JS 비활성 환경 자체는 재현하지 않았습니다.
- **하이드레이션이 끝나지 않는 경우는 막지 못합니다.** JS가 켜져 있어
  `<noscript>`가 적용되지 않는데 effect도 실행되지 않으면 히어로 아래가 빈 채로
  남습니다. 서버 HTML을 "보이는 상태"로 두고 클라이언트가 숨김을 켜는 구조로
  뒤집으면 이 경로까지 사라집니다 — **다음에 볼 가치가 있습니다.**
- `scale-*`, `rotate-*`도 v4에서 독립 속성입니다. 이번엔 안 썼지만 같은 함정입니다.
