# Header

> 상태: **구현 완료** (브라우저 확인은 #11) · 태스크 #2 · 2026-08-08

## 범위

상단 sticky 헤더. 좌측 로고 + 서비스명 2행, 우측 내비 링크 2개와 "지도 열기" pill CTA.

## 원본

`Home.dc.html` → `<header data-r-header>` 블록

## 구현 대상

`components/home/site-header.tsx`

## 결정 기록

### 서버 컴포넌트로 유지

현재 페이지 표시를 `usePathname()`으로 읽으면 헤더 전체가 클라이언트 컴포넌트가
되고, 랜딩 첫 화면에 불필요한 번들이 끼어듭니다. `current` prop을 받는 쪽을
택했습니다.

```tsx
<SiteHeader />            // 기본값 "home"
<SiteHeader current="map" />
```

Map 페이지를 만들 때 이 prop을 넘기면 됩니다.

### 로고 마크에 `brand`(#ff385c)를 씀

원본은 `var(--primary)`를 씁니다. 로컬 규약은 **텍스트가 얹히지 않는 브랜드
순간**에 `brand`를, 텍스트가 얹히는 면에 `brand-strong`(`primary`)을 쓰도록
나눠 두었습니다. 로고 링과 점은 순수 장식이므로 `brand`가 맞습니다.
(`docs/design-guide.md` "Rausch를 두 개로 쪼갠 이유")

### CTA 높이를 44px로 올림

`size="sm"`은 40px인데 디자인 가이드는 터치 타깃 44px 이상을 요구합니다.
좁은 화면에서는 다른 내비 링크가 전부 숨겨져 **이 버튼이 유일한 내비
컨트롤**이 되므로 `h-11`(44px)로 올렸습니다. 원본도 약 38px이라 같은 문제가
있었습니다.

`size="default"`(48px)는 68px 헤더 안에서 여백이 10px밖에 남지 않아 택하지
않았습니다.

## 원본과 의도적으로 다른 부분

| 항목 | 원본 | 구현 | 이유 |
|---|---|---|---|
| 서비스명 부제 | 10.5px | `text-caption-sm` (13px) | 10.5px는 읽기 어렵고, 원본의 0.02em 자간은 한글에 맞지 않습니다 |
| 내비 링크 | 14px / 600 | `text-nav-link` (16px / 600) | 매핑표의 반올림 규칙 |
| CTA 라벨 | 13.5px / 700 | `text-button-sm` (14px / 500) | 매핑표의 반올림 규칙 |
| 로고 워드마크 서체 | Lato (`--font-alt`) | Inter + `tracking-wider` | 두 번째 서체를 도입하지 않기로 함 (매핑표 "폰트") |
| 현재 페이지 표시 | 두 링크 색이 `#1c1b1b` / `#212121`로 사실상 동일 | 현재 `text-ink`, 나머지 `text-muted-foreground` + `aria-current="page"` | 원본은 **현재 위치를 알 수 없었습니다.** 색만이 아니라 `aria-current`로도 전달합니다 |
| 링크 숨김 브레이크포인트 | 680px | `sm` (640px) | Tailwind 기본 브레이크포인트를 씁니다. 40px 차이는 무의미하고, 커스텀 브레이크포인트를 늘리면 이후 섹션이 전부 따라야 합니다 |
| 마크업 | `<a>` 나열 | `<nav aria-label>` + `<ul>/<li>` | 내비게이션은 목록입니다 |
| hover 상태 | `background: var(--hairline)` | `hover:bg-surface-soft` | hairline은 경계선 토큰입니다. 면 채우기는 `surface-soft` |

포커스 표시(`focus-visible:ring-2 ring-ring ring-offset-2`)는 원본에 없던 것을
추가했습니다. 원본은 hover 상태만 정의합니다.

## 검증

```
npm run lint      통과 (출력 없음)
npx tsc --noEmit  통과 (출력 없음)
```

빌드 산출 CSS에서 새 유틸리티가 실제로 생성되는지 확인했습니다.

```
.h-17  .max-w-marketing  .size-6\.5  .px-3\.5
.text-nav-link  .text-caption-sm  .text-title-md
.border-brand  .bg-brand  .tracking-wider
```

`--container-marketing`(1180px)과 마케팅 타이포 토큰이 Tailwind 유틸리티로
정상 방출되는 것을 여기서 처음 확인했습니다.

## 남은 과제

- **브라우저 육안 확인 미실행** (#11). 특히 sticky + `z-40`이 이후 섹션과
  겹치지 않는지, 68px 높이에서 2행 로고가 넘치지 않는지 확인이 필요합니다.
- 테스트 없음. `aria-current` 동작은 #11에서 테스트 추가를 검토합니다.
