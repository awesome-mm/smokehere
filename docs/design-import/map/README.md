# Map 페이지 임포트 기록

> 상태: **구현 완료** (검증은 #19) · 태스크 #18 · 2026-08-09

Claude Design `Map.dc.html`을 옮긴 기록입니다. Home 임포트 기록은
[../README.md](../README.md)에 있습니다.

## 문서

| 문서 | 내용 | 태스크 |
|---|---|---|
| [data-model.md](data-model.md) | 데이터 타입, 필터·거리·정렬 로직 | #12 |
| [map-placeholder.md](map-placeholder.md) | 지도 자리표시자, 보류한 범위 | #13 |
| [sidebar-filters.md](sidebar-filters.md) | 검색·도시·형태 필터 | #14 |
| [spot-list.md](spot-list.md) | 목록·빈 상태·위치 찾기 | #15 |
| [detail-panel.md](detail-panel.md) | 선택 상세 패널 | #16 |
| [overlay-badge.md](overlay-badge.md) | 지도 오버레이 배지 | #17 |
| [verification.md](verification.md) | 검증 결과 | #19 |

## ⚠ 지도는 아직 붙이지 않았습니다

**Google Maps API 키도, Leaflet도 쓰지 않습니다.** 지도 자리는 회색
자리표시자입니다. 퍼블리싱과 기능이 연결된 뒤 **마지막 단계**로 진행합니다.
보류한 범위의 전체 목록은 [map-placeholder.md](map-placeholder.md)에 있습니다.

## 서버 / 클라이언트 경계

| 컴포넌트 | 경계 | 이유 |
|---|---|---|
| `app/map/page.tsx` | 서버 | `searchParams`를 읽고 헤더를 렌더 |
| `MapView` | `"use client"` | 검색어·필터·선택 상태를 소유 |
| 그 아래 전부 | 클라이언트 | `MapView`의 자식 |

상태는 React `useState`입니다. **zustand는 설치돼 있지 않고, 설치하지
않았습니다.** 상태가 이 화면 밖으로 나가지 않아 필요가 없습니다.

### `useSearchParams`를 쓰지 않은 이유

처음에는 `useSearchParams` + `<Suspense>`로 만들어 `/map`을 정적 프리렌더로
유지했습니다. **그런데 사전 렌더 HTML을 열어 보니 h1과 헤더밖에 없었습니다.**

Next 문서가 그렇게 적고 있습니다.

> If a route is prerendered, calling `useSearchParams` will cause the Client
> Component tree up to the closest Suspense boundary to be client-side rendered.

흡연구역 목록은 **실제 콘텐츠**입니다. JS가 실행되기 전에 아무것도 없는 것은
검색엔진에도, 느린 회선에도 손해입니다. 서버 `searchParams` prop으로 바꿨습니다.

| 방식 | 라우트 | 초기 HTML |
|---|---|---|
| `useSearchParams` + Suspense | `○ Static` | **목록 없음** |
| `searchParams` prop (채택) | `ƒ Dynamic` | 목록 포함 |

정적을 포기하는 대신 콘텐츠를 얻었습니다. 데이터가 정적 import라 요청당 비용은
거의 없습니다.

## 홈 검색어 연결

Home 히어로가 `/map?q=강남역`으로 보내던 것을 이제 실제로 소비합니다.

### 검색어가 있으면 도시 제한을 풀어 준다

기본 도시는 "서울"입니다. `?q=부산역`을 그대로 받으면 도시 필터에 걸려
**"검색 결과가 없습니다"만 보입니다.** 검색어를 들고 온 것은 그 지역을 보겠다는
뜻이므로, 검색어가 있으면 도시를 "전체"로 시작합니다.

| 진입 | 초기 도시 | 결과 |
|---|---|---|
| `/map` | 서울 | 13개 |
| `/map?q=부산역` | 전체 | 1개 |
| `/map?q=제주` | 전체 | 0개 (빈 상태) |

## 레이아웃

```
h1 (sr-only)
SiteHeader current="map"          68px 고정
└ MapView
  ├ aside                          lg: 372px 고정 / 미만: 전체 폭
  │  ├ MapSearch · CityFilter · KindFilter
  │  └ SpotList                    내부 스크롤
  ├ MapCanvas                      lg 이상에서만 표시
  │  └ MapOverlayBadge
  └ SpotDetailPanel                선택 시. 좁은 화면은 fixed 하단 시트
```

페이지 자체는 스크롤되지 않습니다(`overflow-hidden`). 스크롤은 사이드바 목록과
상세 패널 안에서만 일어납니다.

### 반응형 — 좁은 화면에서 지도 자리표시자를 감춥니다

시안은 데스크톱 전용(고정 372px 사이드바)이라 좁은 화면 동작이 정의돼 있지
않습니다. 프로젝트 규약은 반응형 필수입니다.

**가장 단순한 방식**을 택했습니다: `lg` 미만에서는 자리표시자를 감추고 목록에
공간을 전부 내줍니다. 자리표시자에는 아직 볼 것이 없으므로 화면을 나눠 가질
이유가 없습니다.

상세 패널은 붙을 지도가 없어지므로 `fixed` 하단 시트가 되고, `lg` 이상에서만
지도 영역 우측에 `absolute`로 붙습니다.

**실제 지도가 붙으면 이 판단을 다시 해야 합니다.** 그때는 좁은 화면에서
지도와 목록을 전환하는 방식(탭·시트)이 필요할 수 있습니다.

## 접근성

- **h1을 추가했습니다.** 시안의 Map에는 제목 요소가 하나도 없습니다.
  화면에는 필요 없으므로 `sr-only`로 두었습니다.
- 도시는 라디오, 형태는 체크박스 — 동작이 다르므로 마크업도 다릅니다 (#14)
- 목록 행은 `<button>` — 시안의 `<div onClick>`은 키보드로 못 씁니다 (#15)
- 결과 개수는 `aria-live="polite"` (#15)
- 상세 패널은 비모달 `role="region"` + Esc 닫기 (#16)

## 검증 (서버 렌더 HTML 실측)

```
?q=부산역     | 결과: 1개 결과   | 빈상태: 아니오
파라미터 없음  | 결과: 13개 결과  | 빈상태: 아니오
?q=제주      | 결과: 0개 결과   | 빈상태: 예
파라미터 없을 때 서울 라디오 checked: true
```

초기 HTML에 라디오·체크박스·`fieldset`·`role="search"`·`aria-live`·
`data-map-placeholder`·h1이 모두 포함된 것을 확인했습니다.

```
npm run lint      통과 (출력 없음)
npx tsc --noEmit  통과 (출력 없음)
npm run build     통과 — ƒ /map (Dynamic)
```

## 남은 과제

- **테스트·브라우저 확인 미실행** (#19)
- **상세 패널을 닫아도 포커스가 목록으로 돌아가지 않습니다.** 열 때는 패널로
  옮기지만 닫을 때 원래 항목으로 되돌리지 않습니다.
- 지도 연동 (마지막 단계)
