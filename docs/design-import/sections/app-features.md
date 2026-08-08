# GET THE APP

> 상태: **구현 완료** (브라우저 확인은 #11) · 태스크 #6 · 2026-08-08

## 범위

앱 기능 소개 카드 6개 (3열 × 2행). 각 카드는 아이콘 + 제목 + 보조 문구.

## 원본

`Home.dc.html` → `data-r="three"` 블록, 데이터는 스크립트의 `appPoints` 배열

## 구현 대상

`components/home/app-features-section.tsx`

## lucide-react 아이콘 대체 매핑

원본은 Material Symbols 이름을 씁니다. **설치된 패키지에서 실제로 존재하는지
확인**한 뒤 확정했습니다.

```bash
node -e "const i=require('lucide-react'); …"
# lucide-react 버전: 1.30.0
```

| 원본 (Material) | lucide-react | 존재 확인 | 근거 |
|---|---|---|---|
| `LocationOn` | `MapPin` | ✅ | 위치 핀, 의미 동일 |
| `Bookmark` | `Bookmark` | ✅ | 이름까지 동일 |
| `GetApp` | `Download` | ✅ | Material의 GetApp이 곧 다운로드 화살표 |
| `Search` | `Search` | ✅ | 이름까지 동일 |
| `Verified` | `BadgeCheck` | ✅ | 체크가 든 인증 배지 |
| `Campaign` | `Megaphone` | ✅ | Material Campaign이 확성기 모양 |

`package.json`은 `^1.29.0`을 명시하지만 실제 설치본은 **1.30.0**입니다
(`require('lucide-react/package.json').version`으로 확인).

## 결정 기록

### 한 덩어리 텍스트를 제목/본문으로 분리

원본은 제목과 본문을 `<br>`로 이어 붙인 하나의 `<div>`입니다.

```html
<div style="font-size: 15.5px; …">{{ a.title }}<br>
  <span style="font-weight: 400; …">{{ a.body }}</span>
</div>
```

스크린리더에서는 두 문장이 이어져 읽히고, 검색엔진에도 하나의 텍스트로 보입니다.
`<p>` 두 개로 분리하고 카드 전체를 `<ul>/<li>`로 감쌌습니다 — 6개 항목의 목록은
목록으로 표현되어야 합니다.

### 아이콘은 `aria-hidden`

의미는 전부 텍스트가 전달합니다. 아이콘에 라벨을 붙이면 "위치 핀, 열자마자
반경 500m"처럼 중복해서 읽힙니다.

### `strokeWidth={1.75}`

lucide 기본값은 2입니다. 28px 크기에서 기본 굵기는 원본의 Material 채움형
아이콘보다 무겁게 보여 살짝 낮췄습니다.

## 원본과 의도적으로 다른 부분

| 항목 | 원본 | 구현 | 이유 |
|---|---|---|---|
| 마크업 | `<div>` 나열 + `<br>` | `<ul>/<li>` + `<p>` 2개 | 목록이자 제목/본문 구조입니다 |
| 카드 제목 | 15.5px / 500 | `text-title-md` (16 / 600) | 매핑표의 반올림. 제목/본문 구분이 더 또렷해집니다 |
| 카드 본문 | 15.5px / 400 | `text-body-md` (16 / 400) | 매핑표의 반올림 |
| 섹션 제목 | 40px 고정 | `text-section-lg` = clamp(30 → 40px) | 375px에서 40px/800 한국어 제목은 줄바꿈이 심합니다 (#5에서 토큰 변경) |
| 제목 개행 | `<br>` 강제 개행 | **`<br>` 유지** + `max-w-2xl` | 경위는 `banner.md`의 "개행을 되돌린 이유" |
| 카드 라운딩 | `--radius-xl` 12px | `rounded-md` 14px | 토큰 이름 충돌 (매핑표) |
| 아이콘 | Material Symbols (채움형) | lucide (선형) | 프로젝트 아이콘 세트가 lucide입니다 |
| 그리드 | 3열 → 2열 (1000px) | `grid-cols-2 lg:grid-cols-3` | 원본과 동일한 단계, 브레이크포인트만 1024px |

## 검증

```
npm run lint      통과 (출력 없음)
npx tsc --noEmit  통과 (출력 없음)
```

## 남은 과제

- **브라우저 육안 확인 미실행** (#11). 특히 375px에서 2열 카드가 좁아지는데
  제목이 두 줄로 넘치지 않는지 확인이 필요합니다.
- 카드 배경 `surface-soft`(#f7f7f7) 위 `muted-foreground`(#6a6a6a) 본문의
  대비는 **5.05:1**로 계산됐습니다(#1). 렌더 결과로 재확인하지는 않았습니다.
