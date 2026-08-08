import { describe, expect, it } from "vitest"

import {
  buildSpotList,
  distanceKm,
  filterSpots,
  formatDistance,
} from "@/lib/map/filter"
import { DEFAULT_ORIGIN, SPOTS, type SmokingSpot } from "@/lib/map/spots"

/*
 * 필터·거리·정렬 규칙을 화면 없이 고정합니다.
 * 경위: docs/design-import/map/data-model.md
 */

const 강남역 = SPOTS.find((s) => s.id === 1) as SmokingSpot
const 부산역 = SPOTS.find((s) => s.id === 14) as SmokingSpot

const 전체조회 = { query: "", city: "전체", kinds: [] } as const

describe("filterSpots", () => {
  it("기본값은 아무것도 거르지 않는다", () => {
    expect(filterSpots(전체조회)).toHaveLength(SPOTS.length)
  })

  it("도시로 거른다", () => {
    const result = filterSpots({ ...전체조회, city: "부산" })

    expect(result).toHaveLength(3)
    expect(result.every((s) => s.city === "부산")).toBe(true)
  })

  it('"전체"는 도시를 거르지 않는다', () => {
    expect(filterSpots({ ...전체조회, city: "전체" })).toHaveLength(SPOTS.length)
  })

  it("형태는 복수 선택이며 OR로 동작한다", () => {
    const 부스형만 = filterSpots({ ...전체조회, kinds: ["부스형"] })
    const 부스와실내 = filterSpots({ ...전체조회, kinds: ["부스형", "실내형"] })

    expect(부스형만.every((s) => s.kind === "부스형")).toBe(true)
    expect(부스와실내.length).toBeGreaterThan(부스형만.length)
    expect(부스와실내.every((s) => ["부스형", "실내형"].includes(s.kind))).toBe(
      true
    )
  })

  it("이름·주소·도시 어디에 있어도 검색된다", () => {
    expect(filterSpots({ ...전체조회, query: "강남역" })).toContain(강남역)
    // 주소에만 있는 낱말
    expect(filterSpots({ ...전체조회, query: "테헤란로" }).length).toBe(2)
    // 도시 이름
    expect(filterSpots({ ...전체조회, query: "대구" }).length).toBeGreaterThan(0)
  })

  it("검색어 앞뒤 공백을 무시한다", () => {
    expect(filterSpots({ ...전체조회, query: "  강남역  " })).toContain(강남역)
  })

  it("로마자는 대소문자를 가리지 않는다", () => {
    expect(filterSpots({ ...전체조회, query: "ifc" }).length).toBe(1)
    expect(filterSpots({ ...전체조회, query: "IFC" }).length).toBe(1)
  })

  it("도시와 형태와 검색어가 함께 걸린다", () => {
    const result = filterSpots({
      query: "역",
      city: "서울",
      kinds: ["부스형"],
    })

    expect(result.every((s) => s.city === "서울")).toBe(true)
    expect(result.every((s) => s.kind === "부스형")).toBe(true)
    expect(result.every((s) => s.name.includes("역"))).toBe(true)
  })

  it("일치하는 것이 없으면 빈 배열을 준다", () => {
    expect(filterSpots({ ...전체조회, query: "제주" })).toEqual([])
  })
})

describe("distanceKm", () => {
  it("같은 좌표는 0이다", () => {
    expect(distanceKm(DEFAULT_ORIGIN, DEFAULT_ORIGIN)).toBe(0)
  })

  it("서울시청에서 강남역까지 실제 거리(약 8.3km)에 근접한다", () => {
    const km = distanceKm(DEFAULT_ORIGIN, { lat: 강남역.lat, lng: 강남역.lng })

    expect(km).toBeGreaterThan(7.5)
    expect(km).toBeLessThan(9)
  })

  it("서울시청에서 부산역까지 실제 거리(약 325km)에 근접한다", () => {
    const km = distanceKm(DEFAULT_ORIGIN, { lat: 부산역.lat, lng: 부산역.lng })

    expect(km).toBeGreaterThan(300)
    expect(km).toBeLessThan(350)
  })

  it("방향이 바뀌어도 같은 거리다", () => {
    const a = { lat: 강남역.lat, lng: 강남역.lng }
    const b = { lat: 부산역.lat, lng: 부산역.lng }

    expect(distanceKm(a, b)).toBeCloseTo(distanceKm(b, a), 6)
  })
})

describe("formatDistance", () => {
  it("1km 미만은 미터로 반올림한다", () => {
    expect(formatDistance(0.32)).toBe("320m")
    expect(formatDistance(0.9994)).toBe("999m")
  })

  it("1km 이상은 소수 한 자리 km로 표시한다", () => {
    expect(formatDistance(1)).toBe("1.0km")
    expect(formatDistance(12.34)).toBe("12.3km")
  })
})

describe("buildSpotList", () => {
  it("가까운 순으로 정렬한다", () => {
    const list = buildSpotList(전체조회, DEFAULT_ORIGIN)
    const distances = list.map((s) => s.distanceKm)

    expect(distances).toEqual([...distances].sort((a, b) => a - b))
  })

  it("표시 문자열이 아니라 숫자로 정렬한다", () => {
    /*
     * 시안의 정렬은 이렇습니다.
     *   parseFloat(d) * (d.endsWith("m") ? 0.001 : 1)
     * "1.2km"도 "m"으로 끝나므로 1.2 * 0.001 = 0.0012이 되어, km 항목이
     * 미터 항목보다 **앞으로** 정렬됩니다. 같은 실수를 하지 않는지 확인합니다.
     */
    const 가까운곳 = { ...강남역, id: 901, lat: 37.5670, lng: 126.9785 }
    const 먼곳 = { ...강남역, id: 902, lat: 37.6100, lng: 127.0300 }
    const list = buildSpotList(전체조회, DEFAULT_ORIGIN, [먼곳, 가까운곳])

    expect(list[0].distanceKm).toBeLessThan(1)
    expect(list[0].distanceLabel.endsWith("km")).toBe(false)
    expect(list[1].distanceKm).toBeGreaterThan(1)
    expect(list[1].distanceLabel.endsWith("km")).toBe(true)
    expect(list.map((s) => s.id)).toEqual([901, 902])
  })

  it("라벨 단위 구분은 km를 먼저 판정해야 한다", () => {
    // "1.2km".endsWith("m") === true — 단위 판정 순서를 틀리면 조용히 깨집니다
    expect(formatDistance(1.2).endsWith("m")).toBe(true)
    expect(formatDistance(1.2).endsWith("km")).toBe(true)
    expect(formatDistance(0.32).endsWith("km")).toBe(false)
  })

  it("기준점이 바뀌면 순서도 바뀐다", () => {
    const 서울기준 = buildSpotList(전체조회, DEFAULT_ORIGIN)
    const 부산기준 = buildSpotList(전체조회, {
      lat: 부산역.lat,
      lng: 부산역.lng,
    })

    expect(서울기준[0].city).toBe("서울")
    expect(부산기준[0].city).toBe("부산")
  })

  it("필터 결과에만 거리를 붙인다", () => {
    const list = buildSpotList(
      { ...전체조회, city: "대구" },
      DEFAULT_ORIGIN
    )

    expect(list).toHaveLength(2)
    expect(list.every((s) => typeof s.distanceKm === "number")).toBe(true)
    expect(list.every((s) => s.distanceLabel.length > 0)).toBe(true)
  })
})
