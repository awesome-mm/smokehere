# Map 데이터 모델과 필터 로직

> 상태: **완료** · 태스크 #12 · 2026-08-09

## 범위

Map 페이지의 순수 로직. UI 없이 규칙을 테스트할 수 있게 분리했습니다.

## 원본

`Map.dc.html` → 스크립트의 `SPOTS`(20건), `CITIES`, `FILTERS`, `CENTER`,
`results()`, `dist()`

## 구현 대상

| 파일 | 내용 |
|---|---|
| `lib/map/spots.ts` | 타입·상수·샘플 데이터 20건 |
| `lib/map/filter.ts` | 검색·필터·거리·정렬 순수 함수 |
| `lib/map/__tests__/filter.test.ts` | 테스트 20개 |

## 타입 설계

```ts
export const SPOT_KINDS = ["부스형", "개방형", "실내형"] as const
export type SpotKind = (typeof SPOT_KINDS)[number]

export const CITY_OPTIONS = ["전체", "서울", "부산", "인천", "대구"] as const
export type CityOption = (typeof CITY_OPTIONS)[number]
export type City = Exclude<CityOption, "전체">
```

**`City`와 `CityOption`을 나눈 이유:** "전체"는 도시 이름이 아니라 *필터를 걸지
않는다*는 선택지입니다. `SmokingSpot.city`에 "전체"가 들어갈 수 없다는 것을
타입이 막아 줍니다. 시안은 둘을 같은 문자열 배열로 다뤄 이 구분이 없습니다.

`kinds`는 `readonly SpotKind[]`로 받습니다. 필터는 읽기만 하므로 `as const`
배열을 그대로 넘길 수 있어야 합니다. (`tsc`가 이걸 잡아서 알았습니다)

## 거리 계산 — 시안에서 바꾼 부분

### 경도 보정을 위도에 따라 계산

시안은 경도 1도를 **88.9km로 고정**합니다.

```js
const dx = (p.lng - lo) * 88.9, dy = (p.lat - la) * 111;
```

88.9는 `111 × cos(37°)`로, **위도 37도(서울)에서만 맞는 값**입니다. 부산(35.1°)·
대구(35.9°)에서는 2%가량 어긋납니다. 두 지점의 평균 위도로 cos 보정을 넣었습니다.

```ts
const meanLatRad = ((from.lat + to.lat) / 2) * (Math.PI / 180)
const dx = (to.lng - from.lng) * KM_PER_DEGREE_LAT * Math.cos(meanLatRad)
```

**haversine을 쓰지 않은 이유:** 목록을 가까운 순으로 줄 세우는 용도이고, 한국
정도의 범위에서 정거리 원통 도법 근사로 충분합니다. 실제 거리와의 차이는
테스트로 확인했습니다.

| 구간 | 계산값 | 실제 |
|---|---|---|
| 서울시청 → 강남역 | 7.5~9km 범위 통과 | 약 8.3km |
| 서울시청 → 부산역 | 300~350km 범위 통과 | 약 325km |

지도에 경로를 그리거나 "몇 분 거리"를 계산하게 되면 그때 haversine이나 실제
경로 API로 바꿔야 합니다.

### 정렬을 문자열이 아니라 숫자로 — 시안의 버그

시안의 정렬입니다.

```js
rows.sort((a, b) =>
  parseFloat(a._d) * (a._d.endsWith("m") ? 0.001 : 1) -
  parseFloat(b._d) * (b._d.endsWith("m") ? 0.001 : 1))
```

**`"1.2km".endsWith("m")`은 `true`입니다.** km 항목도 미터로 판정되어
`1.2 × 0.001 = 0.0012`이 되고, 결과적으로 **먼 곳(km)이 가까운 곳(m)보다 앞으로
정렬됩니다.**

`buildSpotList`는 숫자 거리(`distanceKm`)로 정렬하고 문자열은 표시에만 씁니다.
같은 실수를 막는 테스트 2개를 넣었습니다.

- "표시 문자열이 아니라 숫자로 정렬한다" — 1km 미만/이상이 섞인 데이터로 순서 확인
- "라벨 단위 구분은 km를 먼저 판정해야 한다" — `endsWith("m")` 함정 자체를 고정

제 첫 테스트도 **같은 실수로 실패했습니다.** 라벨 접미사로 분류하려다
`"1.2km"`를 미터로 세었습니다. 함정이 그만큼 자연스럽다는 뜻이라 테스트로
남겼습니다.

## 검색 규칙

시안과 동일하게 `이름 + 주소 + 도시`를 이어 붙여 부분 일치를 봅니다.
추가한 것은 두 가지입니다.

- 검색어 `trim()` — 앞뒤 공백으로 결과가 0이 되지 않게
- `toLowerCase()` 양쪽 적용 — 한글에는 무의미하지만 "IFC몰"을 `ifc`로 찾을 수 있습니다

## 데이터에 대한 주의

`SPOTS` 20건은 **시안의 샘플 데이터**입니다. 좌표·운영시간·수용 인원·갱신일
모두 검증되지 않았고, 실제 공공데이터가 아닙니다. 파일 상단 주석에 명시했습니다.
API가 붙으면 이 파일은 통째로 대체됩니다.

## 검증

```
npm run lint      통과 (출력 없음)
npx tsc --noEmit  통과 (출력 없음)
npm test          8 files / 94 tests 통과 (Map 필터 20개 포함)
npm run build     통과
```

## 남은 과제

- `CITY_CENTERS`는 정의만 해 두고 아직 쓰이지 않습니다. 실제 지도를 붙일 때
  초기 뷰포트로 씁니다.
- 검색이 부분 문자열 일치라 "강남 역"처럼 띄어 쓰면 못 찾습니다. 초성 검색이나
  공백 무시가 필요한지는 실제 사용을 보고 판단할 일입니다.
