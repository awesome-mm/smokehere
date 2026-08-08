# 이슈 기록

라이브러리 충돌 · 설정 충돌 · 원인이 규명된 에러를 남기는 곳입니다.
작성은 `issue-reporter` 에이전트가 담당합니다 (`.claude/agents/issue-reporter.md`).

위험도 내림차순으로 정렬합니다. **빌드가 통과하는데 결과가 틀린 이슈일수록 높습니다.**
즉시 터지는 에러는 발견이 쉬워 오히려 낮게 매깁니다.

| 위험도 | 이슈 | 분류 | 상태 | 발견일 |
|---|---|---|---|---|
| **8** | [tailwind-merge가 커스텀 타이포 토큰을 색상으로 오인해 클래스를 조용히 삭제](2026-08-08-tailwind-merge-typography-collision.md) | 설정 충돌 | 해결됨 | 2026-08-08 |
| **7** | [Input 테두리가 WCAG 비텍스트 대비 3:1에 미달](2026-08-08-input-border-nontext-contrast.md) | 접근성 규약 위반 | 해결됨 | 2026-08-08 |
| **6** | [Claude Design의 `_ds` 토큰과 로컬 토큰이 같은 이름에 다른 값](2026-08-08-design-system-token-name-collision.md) | 설정 충돌 | 차단 장치 마련 | 2026-08-08 |
| **6** | [Tailwind v4의 `translate-y-*`는 `transform`이 아니라 `translate` 속성](2026-08-08-tailwind-v4-translate-not-transform.md) | 동작 불일치 | 해결됨 | 2026-08-08 |
| **4** | [@vitejs/plugin-react 설치가 @babel/core 7↔8 peer 충돌로 실패](2026-08-08-vitejs-plugin-react-babel-core-conflict.md) | 라이브러리 충돌 | 해결됨 | 2026-08-08 |
| **3** | [Radix Dialog에 aria-modal이 없어 접근성 테스트가 실패](2026-08-08-radix-dialog-aria-modal-absent.md) | 동작 불일치 | 해결됨 | 2026-08-08 |

## 위험도 기준

| 점수 | 기준 |
|---|---|
| 9~10 | 프로덕션 사용자에게 이미 영향. 데이터 손실, 보안 취약점, 서비스 중단 |
| 7~8 | **조용한 실패.** 빌드·린트·타입 검사를 모두 통과하는데 동작이나 화면이 잘못됨 |
| 5~6 | 개발이 막히지만 에러 메시지가 명확함. 우회책이 있으나 부작용이 있음 |
| 3~4 | 설치·설정 단계에서 즉시 실패. 원인이 로그에 그대로 드러남 |
| 1~2 | 경고 수준. 지금은 동작하나 향후 메이저 버전에서 깨질 수 있음 |

가감: 광범위하게 퍼져 있으면 **+1**, 반복 재발하기 쉬우면 **+1**,
테스트·타입으로 재발이 자동 차단되면 **−1**.

## 아직 정리되지 않은 관찰

이슈로 확정하기엔 근거가 부족하지만 지켜볼 것들입니다.

- `radix-ui`와 `@base-ui/react`가 **둘 다 설치**되어 있습니다. 현재 UI 컴포넌트는
  `radix-ui`만 쓰지만 표준을 정해 두지 않으면 접근성 구현이 섞일 수 있습니다.
- 타이포 외의 커스텀 토큰(`border-hairline`, `shadow-float`, `max-w-content`)이
  tailwind-merge에서 올바른 그룹으로 분류되는지 렌더 결과로 검증하지 않았습니다.
