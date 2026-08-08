import {
  SPOTS,
  type CityOption,
  type LatLng,
  type SmokingSpot,
  type SpotKind,
} from "@/lib/map/spots"

/*
 * 흡연구역 검색·필터·거리 계산
 *
 * UI가 없는 순수 함수만 둡니다. 화면을 켜지 않고 규칙을 테스트할 수 있어야
 * 필터 조건이 바뀔 때 회귀를 잡을 수 있습니다.
 */

export type SpotQuery = {
  /** 이름·주소·도시에 대한 부분 일치 검색어 */
  query: string
  city: CityOption
  /**
   * 비어 있으면 형태로 거르지 않습니다 (복수 선택).
   * 읽기만 하므로 readonly로 받아 `as const` 배열도 그대로 넘길 수 있게 합니다.
   */
  kinds: readonly SpotKind[]
}

/** 거리를 함께 계산해 둔 목록 항목. 정렬과 표시가 같은 값을 씁니다. */
export type SpotWithDistance = SmokingSpot & {
  /** 기준점에서의 직선 거리(km) */
  distanceKm: number
  /** 화면 표시용 문자열 (`320m` / `1.2km`) */
  distanceLabel: string
}

/**
 * 두 좌표 사이의 직선 거리(km).
 *
 * 정거리 원통 도법(equirectangular) 근사입니다. 한국 정도의 범위에서 목록을
 * 가까운 순으로 줄 세우는 데는 충분하고, haversine보다 훨씬 쌉니다.
 *
 * 시안은 경도 1도를 88.9km로 **고정**했는데, 이는 위도 37도(서울)에서만 맞는
 * 값입니다. 부산·대구에서는 2%가량 어긋나므로 위도에 따라 cos 보정을 넣었습니다.
 */
export function distanceKm(from: LatLng, to: LatLng): number {
  const KM_PER_DEGREE_LAT = 111
  const meanLatRad = ((from.lat + to.lat) / 2) * (Math.PI / 180)
  const dx = (to.lng - from.lng) * KM_PER_DEGREE_LAT * Math.cos(meanLatRad)
  const dy = (to.lat - from.lat) * KM_PER_DEGREE_LAT
  return Math.sqrt(dx * dx + dy * dy)
}

/** 1km 미만은 미터로, 그 이상은 소수 한 자리 킬로미터로 표시합니다. */
export function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`
}

function matchesQuery(spot: SmokingSpot, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true

  // 시안과 동일하게 이름·주소·도시를 이어 붙여 부분 일치를 봅니다.
  // 한글은 toLowerCase가 무의미하지만 "IFC" 같은 로마자 표기를 위해 걸어 둡니다.
  return `${spot.name}${spot.address}${spot.city}`.toLowerCase().includes(needle)
}

export function filterSpots(
  { query, city, kinds }: SpotQuery,
  spots: SmokingSpot[] = SPOTS
): SmokingSpot[] {
  return spots.filter((spot) => {
    if (city !== "전체" && spot.city !== city) return false
    if (kinds.length > 0 && !kinds.includes(spot.kind)) return false
    return matchesQuery(spot, query)
  })
}

/**
 * 필터를 적용하고 기준점에서 가까운 순으로 정렬합니다.
 *
 * 시안은 `320m` / `1.2km` 같은 **표시 문자열을 parseFloat해서** 정렬합니다.
 * 단위에 따라 보정 계수를 곱하는 방식이라 포맷을 바꾸면 정렬이 조용히 깨집니다.
 * 여기서는 숫자 거리로 정렬하고 문자열은 표시에만 씁니다.
 */
export function buildSpotList(
  spotQuery: SpotQuery,
  origin: LatLng,
  spots: SmokingSpot[] = SPOTS
): SpotWithDistance[] {
  return filterSpots(spotQuery, spots)
    .map((spot) => {
      const km = distanceKm(origin, { lat: spot.lat, lng: spot.lng })
      return { ...spot, distanceKm: km, distanceLabel: formatDistance(km) }
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
}
