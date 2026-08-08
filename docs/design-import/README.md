# Claude Design 임포트 기록

Claude Design 프로젝트 **"SmokeHere 웹앱 설계"** 의 화면을 이 저장소의 Next.js
코드로 옮기면서 내린 결정과 검증 결과를 남기는 곳입니다.

## 원본

| 항목 | 값 |
|---|---|
| 프로젝트 | SmokeHere 웹앱 설계 |
| projectId | `04db054a-96f3-461f-a132-5a01ce27d59f` |
| 디자인 시스템 | `_ds/airbnb-design-system-c5f0d1d4-8e7d-49a8-831f-c4786d65b498/` |
| 읽는 방법 | `DesignSync` 도구의 `get_file` (원본은 저장소에 복사하지 않습니다) |

원본 파일은 **읽기 전용 참조**입니다. 이 저장소로 복사해 두지 않으므로, 확인이
필요하면 위 projectId로 다시 읽으세요.

## 작업 순서

1. **Home** (`Home.dc.html`) — **완료** (2026-08-08)
2. **Map** (`Map.dc.html`) — **완료** (2026-08-09) → [map/README.md](map/README.md)
3. **지도 연동** — 미착수. 퍼블리싱·기능이 붙은 뒤 마지막 단계입니다

### ⚠ 지도는 아직 붙어 있지 않습니다

Google Maps API 키도 Leaflet도 쓰지 않습니다. 지도 자리는 회색 자리표시자이고,
보류한 범위의 전체 목록은 [map/map-placeholder.md](map/map-placeholder.md)에
있습니다.

새 화면을 시작하기 전에 [token-map.md](token-map.md)를 먼저 읽으세요. 같은
디자인 시스템을 참조하므로 **토큰 이름 충돌과 액션 variant 함정이 그대로
재현됩니다.**

## 문서

| 문서 | 내용 |
|---|---|
| [token-map.md](token-map.md) | 디자인 토큰 → 로컬 Tailwind 클래스 매핑. **모든 화면 작업의 기준** |
| [verification.md](verification.md) | Home 검증 결과 |
| [map/README.md](map/README.md) | **Map 페이지 기록** (하위 문서 7개) |

### 섹션별 기록

| 문서 | 섹션 | 태스크 |
|---|---|---|
| [sections/header.md](sections/header.md) | 상단 sticky 헤더 | #2 |
| [sections/hero.md](sections/hero.md) | 히어로 (검색 + 통계) | #3 |
| [sections/about.md](sections/about.md) | WHY & HOW | #4 |
| [sections/banner.md](sections/banner.md) | 금연 지원 캠페인 배너 | #5 |
| [sections/app-features.md](sections/app-features.md) | GET THE APP | #6 |
| [sections/faq.md](sections/faq.md) | 자주 묻는 질문 | #7 |
| [sections/footer.md](sections/footer.md) | 푸터 | #8 |
| [sections/reveal.md](sections/reveal.md) | 스크롤 리빌 애니메이션 | #9 |

## 서버 / 클라이언트 경계

`app/page.tsx`는 서버 컴포넌트이고, **상태가 필요한 세 곳만** 클라이언트로
격리했습니다. 랜딩 첫 화면에 불필요한 JS를 싣지 않기 위해서입니다.

| 컴포넌트 | 경계 | 이유 |
|---|---|---|
| `HeroSection` | `"use client"` | 검색어 입력 상태 |
| `FaqSection` | `"use client"` | 아코디언 열림 상태 (Radix) |
| `Reveal` | `"use client"` | IntersectionObserver |
| `SiteHeader` | 서버 | 현재 페이지를 `usePathname`이 아니라 `current` prop으로 받음 |
| `AboutSection` · `QuitSupportBanner` · `AppFeaturesSection` · `SiteFooter` | 서버 | 상호작용 없음 |

`/`는 여전히 **정적 프리렌더**됩니다 (`npm run build` 출력의 `○ /`).

### 조립 순서

```
SiteHeader
  ↓
HeroSection          animate-rise-in — 스크롤을 기다리지 않음
AboutSection         ┐
QuitSupportBanner    │ 각각 <Reveal>로 감싸 스크롤 진입 시 등장
AppFeaturesSection   │
FaqSection           ┘
  ↓
SiteFooter
```

## 기록 원칙

- **원본과 다르게 만들었다면 반드시 이유를 적습니다.** 특히 접근성 때문에 바꾼
  부분은 나중에 "디자인과 다르다"는 지적을 받으므로 근거를 남겨야 합니다.
- **실행하지 않은 검증을 통과했다고 쓰지 않습니다.** 명령 출력이 근거입니다.
- 라이브러리·설정 충돌은 `docs/issue/`에 별도로 기록합니다.
