# Tailwind v4의 `translate-y-*`는 `transform`이 아니라 `translate` 속성으로 컴파일된다

| 항목 | 내용 |
|---|---|
| 위험도 | **6 / 10** |
| 분류 | 동작 불일치 (라이브러리 구현 ↔ 통념) |
| 발견일 | 2026-08-08 |
| 상태 | 해결됨 |
| 관련 파일 | `components/home/reveal.tsx`, `styles/globals.css` |

위험도 근거: 빌드·린트·타입·테스트를 전부 통과하고 화면에서도 **JS를 꺼야만**
드러나는 silent failure(기준 7~8). 영향 범위가 JS 비활성 사용자로 좁아 **−1**,
`transform`으로 되돌리는 코드를 짤 때마다 재발할 수 있어 **+1**,
`AGENTS.md`의 "이미 밟은 지뢰"에 기록해 **−1** → **6**.

## 1. 이슈 내용

### 증상

`Reveal` 컴포넌트는 JS가 없는 환경을 위해 `<noscript>` 폴백을 둡니다.

```tsx
<noscript>
  <style>{`[data-reveal]{opacity:1;transform:none}`}</style>
</noscript>
```

투명도는 되돌아오는데 **20px 아래로 밀린 위치는 그대로 남습니다.** 결과적으로
JS를 끄면 네 섹션(WHY & HOW, 배너, GET THE APP, FAQ)이 자기 레이아웃 박스보다
20px 아래에 그려져 다음 섹션의 `border-t` 구분선과 겹칩니다.

### 근본 원인

Tailwind v3까지 `translate-y-*`는 `transform: translateY(…)`를 만들었습니다.
**v4는 독립 `translate` 속성을 씁니다.** 빌드 산출물에서 확인했습니다.

```css
.translate-y-5 {
  --tw-translate-y: calc(var(--spacing) * 5);
  translate: var(--tw-translate-x) var(--tw-translate-y);
}
```

```
transform 속성 사용: false
```

`transform`과 `translate`는 **서로 다른 CSS 속성**이라, `transform: none`은
`translate`가 만든 이동을 되돌리지 못합니다. 에러도 경고도 나지 않습니다.

### 왜 발견이 늦었나

- `npm run lint` / `tsc` / `vitest` / `next build` **전부 통과**합니다
- 브라우저 육안 확인도 **JS가 켜져 있으면 정상**으로 보입니다
- 사전 렌더 HTML 검사에서도 `<noscript>` 태그의 **존재만** 확인했지 내용이
  실제로 작동하는지는 검증하지 않았습니다

`docs/design-import/verification.md`가 "noscript 폴백을 JS 끈 상태로 확인하지
않았습니다"를 미해결 항목으로 남겨 두었는데, 그 미검증 항목에서 정확히 이
버그가 나왔습니다. **코드 리뷰가 잡았습니다.**

## 2. 대응

```diff
- [data-reveal]{opacity:1;transform:none}
+ [data-reveal]{opacity:1;translate:none}
```

`!important`는 쓰지 않았습니다 (`AGENTS.md` 강제 규칙 3). `<noscript>` 안의
`<style>`은 `@layer`에 속하지 않고 Tailwind 유틸리티는 `@layer utilities`
안에 있어, 캐스케이드 레이어 규칙만으로 이깁니다.

### 검증

브라우저에서 동일 구조의 규칙을 주입해 실제로 이기는지 측정했습니다.

```
before          : opacity 0,  translate 0px 20px
레이어 밖 규칙 주입 후 : opacity 1,  translate none     ✅
```

첫 측정에서는 실패로 나왔는데, 대상 요소에 `duration-700` 트랜지션이 걸려 있어
**전이 시작값을 읽었던 것**이 원인이었습니다. `transition-property: none`으로
전이를 끄고 강제 리플로우 후 다시 재어 확인했습니다.

## 3. 해결 방안 및 더 나은 방법

근본 해결입니다. 다만 **같은 실수를 막는 장치는 없습니다.**

### 더 나은 방법

1. **`@media (scripting: none)` 사용** — `<noscript>` 대신 CSS만으로 처리할 수
   있고 속성을 되돌릴 필요 자체가 줄어듭니다. 다만 브라우저 지원을 확인하지
   않았습니다.
2. **초기 상태를 "보이는 쪽"으로 뒤집기** — 서버 HTML을 보이는 상태로 두고
   클라이언트가 숨김을 켜면 폴백이 아예 필요 없습니다. 하이드레이션 실패
   시나리오까지 함께 해결됩니다. **비용 대비 가치가 높아 다음에 볼 만합니다.**
3. Playwright로 JS 비활성 시나리오를 E2E 테스트에 추가.

## 4. 남은 위험

- **`noscript` 폴백을 JS를 실제로 끈 상태에서 확인하지 않았습니다.**
  캐스케이드가 이긴다는 것은 측정했지만, JS 비활성 환경 자체는 재현하지
  않았습니다.
- **하이드레이션이 끝나지 않는 경우는 여전히 막지 못합니다.** JS가 켜져 있어
  `<noscript>`가 적용되지 않는데 effect도 실행되지 않으면 히어로 아래가 빈 채로
  남습니다. 위 "더 나은 방법 2"가 이것까지 해결합니다.
- 같은 부류로 `scale-*`, `rotate-*`도 v4에서 독립 속성(`scale`, `rotate`)을
  씁니다. 이번에 쓰지 않았지만 같은 함정입니다.
