# Radix Dialog에 aria-modal이 없어 접근성 테스트가 실패

| 항목 | 내용 |
|---|---|
| 위험도 | **3 / 10** |
| 분류 | 동작 불일치 (라이브러리 구현 ↔ 일반적인 ARIA 기대) |
| 발견일 | 2026-08-08 |
| 상태 | 해결됨 (제품 코드 변경 없음 — 테스트를 실제 동작에 맞춤) |
| 관련 파일 | `components/ui/dialog.tsx`, `components/ui/__tests__/dialog.test.tsx` |

위험도 근거: 테스트 실패로 즉시 드러났고 원인도 명확합니다(기준 3~4). 제품 결함이
아니라 **기대가 틀린 경우**였습니다. 다만 "Radix가 ARIA 권고와 다르게 동작한다"는
사실을 모르면 다음 사람이 같은 테스트를 또 작성하게 되므로 기록합니다.

## 1. 이슈 내용

### 증상

WAI-ARIA 권고에 따라 모달 다이얼로그에 `aria-modal="true"`가 있을 것으로 보고
작성한 테스트가 실패했습니다.

```
FAIL  components/ui/__tests__/dialog.test.tsx
  > 모달이 열려 있는 동안 바깥 콘텐츠는 보조기술에서 가려진다

Error: expect(element).toHaveAttribute("aria-modal", "true")

Expected the element to have attribute:
  aria-modal="true"
Received:
  null
```

### 조사 — 실제 DOM 확인

추측하지 않고 열린 다이얼로그의 속성을 직접 출력했습니다.

```
DIALOG ATTRS: {
  "role": "dialog",
  "id": "radix-_r_0_",
  "data-state": "open",
  "data-slot": "dialog-content",
  "tabindex": "-1",
  "aria-describedby": "radix-_r_2_",
  "aria-labelledby": "radix-_r_1_",
  "style": "pointer-events: auto;"
}

BODY CHILDREN:
  SPAN[aria-hidden=true] | DIV[aria-hidden=true] | DIV[aria-hidden=true]
  | DIV[aria-hidden=null] | SPAN[aria-hidden=true]
```

### 근본 원인

**Radix는 `aria-modal`을 의도적으로 사용하지 않습니다.** 대신 다이얼로그 바깥의
모든 형제 요소에 `aria-hidden="true"`를 걸어 접근성 트리에서 격리합니다.

VoiceOver에 `aria-modal="true"` 컨테이너 내부의 콘텐츠를 제대로 탐색하지 못하는
문제가 있어, 실사용 스크린리더 호환성을 우선한 선택입니다.

위 `BODY CHILDREN` 출력에서 `aria-hidden=null`인 DIV 하나만 포털(다이얼로그)이고
나머지는 전부 가려져 있어, **격리 자체는 정상 동작**함을 확인했습니다.

## 2. 대응

**제품 코드는 바꾸지 않았습니다.** `components/ui/dialog.tsx`는 문제가 없었고,
테스트의 기대가 틀렸습니다.

테스트를 실제 접근성 결과를 검증하도록 고쳤습니다 — 속성 이름을 확인하는 대신
**바깥 콘텐츠가 실제로 접근성 트리에서 사라지는지**를 봅니다.

```tsx
expect(screen.getByRole("heading", { name: "흡연구역 지도" })).toBeInTheDocument()

await user.click(screen.getByRole("button", { name: "신고" }))

// Radix는 aria-modal="true"를 붙이지 않고 다이얼로그 바깥 형제 요소에
// aria-hidden을 걸어 격리합니다. VoiceOver가 aria-modal 안의 콘텐츠를
// 제대로 읽지 못하는 문제 때문에 택한 방식입니다.
expect(screen.getByRole("dialog")).toBeInTheDocument()
expect(screen.queryByRole("heading", { name: "흡연구역 지도" })).toBeNull()
```

RTL의 `getByRole`은 `aria-hidden` 요소를 접근성 트리에서 제외하므로, 열기 전후로
같은 쿼리를 실행하는 것만으로 격리를 검증할 수 있습니다. **속성 구현 방식이 아니라
사용자가 체감하는 결과를 검증**하므로 Radix가 내부 구현을 바꿔도 테스트가 살아남습니다.

### 검증

```
npx vitest run
 Test Files  4 passed (4)
      Tests  57 passed (57)
```

포커스 트랩, Esc 닫기, 닫은 뒤 트리거로 포커스 복귀도 함께 통과했습니다.

## 3. 해결 방안 및 더 나은 방법

지금 대응이 적절합니다. `aria-modal`을 수동으로 덧붙이는 것은 **오히려 해롭습니다** —
Radix가 피하려 한 VoiceOver 문제를 다시 불러들이게 됩니다.

### 배울 점 (다음 사람을 위해)

- **ARIA 속성 이름을 단언하지 말고 접근성 결과를 단언하세요.** `toHaveAttribute`보다
  `getByRole` · `toHaveAccessibleName` · `toHaveAccessibleDescription`이 낫습니다.
  라이브러리가 같은 목적을 다른 수단으로 달성해도 테스트가 깨지지 않습니다.
- 라이브러리 동작이 예상과 다르면 **추측하지 말고 DOM을 직접 찍어 보세요.** 이번에도
  임시 테스트로 속성을 출력한 것이 결론을 냈습니다.

### 다시 볼 지점

- 실제 스크린리더(VoiceOver, NVDA) 수동 검증은 **하지 않았습니다.** jsdom은
  접근성 트리를 근사할 뿐입니다. 출시 전 실기기 확인이 필요합니다.

## 4. 남은 위험

- **jsdom 환경 검증의 한계.** `aria-hidden` 격리가 DOM 수준에서 확인됐을 뿐,
  실제 스크린리더에서의 동작은 검증하지 못했습니다.
- 이 프로젝트에는 `radix-ui`와 `@base-ui/react`가 **둘 다 설치**되어 있습니다.
  현재 Dialog·Tabs는 `radix-ui`를 쓰지만, 앞으로 컴포넌트를 추가할 때 두 라이브러리가
  섞이면 접근성 구현 방식이 서로 달라 혼란이 생길 수 있습니다. 어느 쪽을 표준으로
  삼을지 정하지 않은 상태입니다.
