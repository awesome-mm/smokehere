# tailwind-merge가 커스텀 타이포 토큰을 색상으로 오인해 클래스를 조용히 삭제

| 항목 | 내용 |
|---|---|
| 위험도 | **8 / 10** |
| 분류 | 설정 충돌 (라이브러리 기본 동작 ↔ 커스텀 디자인 토큰) |
| 발견일 | 2026-08-08 |
| 상태 | 해결됨 |
| 관련 파일 | `lib/utils.ts`, `styles/globals.css`, `components/ui/*.tsx` |

위험도 근거: 빌드·린트·타입 검사를 **모두 통과하는데** 화면의 글자 크기만 조용히
틀리는 silent failure(기준 7~8). 4개 컴포넌트 전체에 퍼져 있어 **+1**, 타이포 토큰을
새로 추가할 때마다 재발하는 구조라 **+1**, 회귀 테스트로 자동 차단되도록 조치해 **−1**.

## 1. 이슈 내용

### 증상

`components/ui/input.tsx`는 `text-body-md`(16px 고정)를 지정하고 있는데, 실제 렌더
결과의 `className`에 **그 클래스가 존재하지 않았습니다.**

### 재현 방법

```tsx
render(<Input aria-label="검색어" />)
expect(screen.getByRole("textbox")).toHaveClass("text-body-md")
```

### 실제 출력

```
Error: expect(element).toHaveClass("text-body-md")

Expected the element to have class:
  text-body-md
Received:
  h-12 w-full min-w-0 rounded-sm border border-hairline bg-background px-4
  text-ink transition-colors outline-none placeholder:text-muted-soft
  file:inline-flex file:h-8 file:cursor-pointer file:border-0 file:bg-transparent
  file:text-ink focus-visible:border-ink ...
```

소스에는 `text-body-md text-ink`, `file:text-button-sm file:text-ink`가 있었는데
출력에는 `text-ink`, `file:text-ink`만 남았습니다. **크기 클래스만 사라졌습니다.**

### 근본 원인

`lib/utils.ts`의 `cn()`이 순정 `twMerge`를 씁니다.

```ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

tailwind-merge는 기본 스케일(`text-sm`, `text-lg` …)만 `font-size` 그룹으로 알고,
**나머지 `text-*`는 전부 색상(`text-color`)으로 분류합니다.** 이 프로젝트의
타이포 토큰 18개는 전부 커스텀 이름이라 색상으로 취급됐고, 결과적으로
`text-body-md`와 `text-ink`가 같은 그룹이 되어 **뒤에 온 쪽이 앞의 것을 지웠습니다.**

### 영향 범위 — Input만의 문제가 아니었음

| 파일 | 충돌 쌍 | 사라진 쪽 |
|---|---|---|
| `components/ui/input.tsx` | `text-body-md` ↔ `text-ink` | 크기 |
| `components/ui/button.tsx` | `text-button-md` ↔ `text-primary-foreground` | cva 병합 순서에 따라 달라짐 |
| `components/ui/tabs.tsx` | `text-title-sm` ↔ `text-muted-foreground` | 크기 |
| `components/ui/dialog.tsx` | `text-display-sm` ↔ `text-ink` | 크기 |

브라우저에서는 상속된 기본 크기로 렌더되기 때문에 **눈으로 봐서는 "조금 이상한데"
정도로만 보입니다.** 테스트를 작성하지 않았다면 발견하지 못했을 가능성이 높습니다.

## 2. 대응

`lib/utils.ts`에서 `extendTailwindMerge`로 타이포 토큰 18개를 `font-size` 그룹에
명시적으로 등록했습니다.

```ts
const fontSizeTokens = [
  "text-rating-display", "text-display-xl", "text-display-lg", "text-display-md",
  "text-display-sm", "text-title-md", "text-title-sm", "text-body-md",
  "text-body-sm", "text-caption", "text-caption-sm", "text-badge",
  "text-micro-label", "text-uppercase-tag", "text-button-md", "text-button-sm",
  "text-link", "text-nav-link",
] as const

const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [...fontSizeTokens] } },
})
```

토큰 목록은 `styles/globals.css`의 `--text-*` 정의에서 추출했습니다:

```bash
grep -o -- "--text-[a-z0-9-]*" styles/globals.css | sort -u
```

### 택하지 않은 대안

| 대안 | 기각 이유 |
|---|---|
| `cn()` 대신 `clsx`만 사용 | 병합 기능을 잃습니다. `className` prop으로 스타일을 덮어쓰는 shadcn 패턴 전체가 깨집니다 |
| 토큰 이름을 `text-` 대신 `type-` 등으로 변경 | Tailwind v4의 `--text-*` 네임스페이스가 곧 유틸리티 이름이라 CSS 쪽을 바꿀 수 없습니다 |
| 컴포넌트마다 크기와 색을 분리해 배치 | 근본 원인이 남아 다음 사람이 같은 함정에 빠집니다 |

### 검증

```
npx vitest run
 Test Files  4 passed (4)
      Tests  57 passed (57)
```

수정 전에는 `input.test.tsx`의 해당 케이스가 실패했고, 수정 후 통과했습니다.
`npx tsc --noEmit`, `npm run lint`, `npm run build` 모두 통과했습니다.

## 3. 해결 방안 및 더 나은 방법

**근본 해결입니다.** tailwind-merge에 프로젝트의 실제 토큰 체계를 알려 준 것이라
증상이 아니라 원인을 고쳤습니다.

다만 **토큰 목록이 `globals.css`와 `lib/utils.ts` 두 곳에 중복**되는 약점이 남습니다.
새 타이포 토큰을 추가하면서 `lib/utils.ts`를 빠뜨리면 그 토큰만 조용히 사라집니다.

### 더 나은 방법 (비용 대비 지금은 보류)

1. **빌드 타임에 CSS에서 토큰을 추출해 자동 동기화** — `globals.css`를 파싱해
   `--text-*` 목록을 생성하는 스크립트를 두면 중복이 사라집니다. 다만 빌드 파이프라인이
   하나 늘고, 토큰이 18개에서 자주 바뀌지 않아 지금은 과합니다.
2. ~~**토큰 목록 일치를 검사하는 테스트**~~ → **2026-08-08 적용 완료.**
   `lib/__tests__/typography-tokens.test.ts`가 `globals.css`에서 `--text-*`를
   추출해 `fontSizeTokens`와 정확히 일치하는지 비교합니다. 마케팅 스케일 토큰
   7개를 추가하면서 함께 넣었습니다 (`docs/design-import/token-map.md`).

### 재발 방지 장치 (적용 완료)

- 회귀 테스트 2개 — `components/ui/__tests__/button.test.tsx`
  - "타이포 토큰과 색상 토큰이 서로를 지우지 않는다"
  - "className으로 타이포 크기만 덮어써도 색상은 유지된다"
- 각 컴포넌트 테스트에서 크기 토큰 존재를 직접 단언
- `docs/design-guide.md`의 타이포그래피 절에 경고 문단 추가
- `lib/utils.ts` 상단에 원인과 주의사항을 주석으로 명시

## 4. 남은 위험

- ~~**토큰 목록 이중 관리.**~~ → 동기화 테스트로 차단됐습니다. 두 곳에 중복되는
  구조 자체는 그대로지만, 한쪽만 고치면 테스트가 실패합니다.
- **같은 부류의 다른 커스텀 토큰은 아직 점검하지 않았습니다.** `border-hairline`,
  `shadow-float`, `max-w-content` 등은 tailwind-merge의 기존 그룹에 자연스럽게
  들어가 문제가 없어 보이지만, 실제로 렌더 결과를 확인해 검증하지는 않았습니다.
