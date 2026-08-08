"use client"

import { useLayoutEffect, useMemo, useRef, useState } from "react"

import { CityFilter } from "@/components/map/city-filter"
import { KindFilter } from "@/components/map/kind-filter"
import { MapCanvas } from "@/components/map/map-canvas"
import { MapOverlayBadge } from "@/components/map/map-overlay-badge"
import { MapSearch } from "@/components/map/map-search"
import { SpotDetailPanel } from "@/components/map/spot-detail-panel"
import { SpotList, type LocateStatus } from "@/components/map/spot-list"
import { buildSpotList } from "@/lib/map/filter"
import {
  DEFAULT_ORIGIN,
  SPOTS,
  type CityOption,
  type LatLng,
  type SpotKind,
} from "@/lib/map/spots"

/*
 * 지도 페이지의 상태를 소유하는 컴포넌트
 *
 * zustand는 설치돼 있지 않고, 상태가 이 화면 밖으로 나가지 않으므로 React
 * useState로 충분합니다. 새 패키지를 들이지 않았습니다.
 *
 * 검색어는 `useSearchParams`가 아니라 서버에서 prop으로 받습니다.
 * 그래야 초기 HTML에 목록이 담깁니다 — 경위는 app/map/page.tsx 주석.
 */

/** 위치 권한을 못 받았을 때의 대체 기준점. 시안과 같은 강남역입니다. */
const FALLBACK_ORIGIN: LatLng = { lat: 37.4979, lng: 127.0276 }

/**
 * @param initialQuery 홈 히어로에서 `/map?q=부산역`으로 넘어온 검색어.
 *   기본 도시가 "서울"인 채로 검색어를 받으면 부산 결과가 전부 걸러져
 *   "검색 결과가 없습니다"만 보입니다. 검색어를 들고 왔다면 도시 제한을
 *   걸지 않는 것이 사용자 의도에 맞습니다.
 */
export function MapView({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [city, setCity] = useState<CityOption>(initialQuery ? "전체" : "서울")
  const [kinds, setKinds] = useState<SpotKind[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [origin, setOrigin] = useState<LatLng>(DEFAULT_ORIGIN)
  const [locateStatus, setLocateStatus] = useState<LocateStatus>("idle")
  const asideRef = useRef<HTMLElement>(null)
  /** 상세 패널을 닫은 뒤 포커스를 돌려줄 목록 항목의 id */
  const restoreFocusIdRef = useRef<number | null>(null)

  const spots = useMemo(
    () => buildSpotList({ query, city, kinds }, origin),
    [query, city, kinds, origin]
  )

  const selected = useMemo(
    () => SPOTS.find((spot) => spot.id === selectedId) ?? null,
    [selectedId]
  )

  /*
   * 패널을 열 때 포커스를 패널로 옮기므로, 닫을 때는 원래 있던 목록 항목으로
   * 되돌려야 합니다. 그러지 않으면 키보드 사용자가 문서 맨 위로 튕깁니다.
   *
   * requestAnimationFrame으로 하면 패널이 DOM에서 제거되며 브라우저가 포커스를
   * <body>로 되돌리는 것과 경합해 실패합니다. useLayoutEffect는 제거가 반영된
   * **커밋 직후**에 실행되므로 확실합니다.
   */
  function handleCloseDetail() {
    restoreFocusIdRef.current = selectedId
    setSelectedId(null)
  }

  useLayoutEffect(() => {
    const restoreId = restoreFocusIdRef.current
    if (restoreId === null || selectedId !== null) return

    restoreFocusIdRef.current = null
    asideRef.current
      ?.querySelector<HTMLButtonElement>(`[data-spot-id="${restoreId}"]`)
      ?.focus()
  }, [selectedId])

  // 조건이 바뀌면 이전 선택이 목록에 없을 수 있어 함께 해제합니다 (시안과 동일)
  function handleCityChange(nextCity: CityOption) {
    setCity(nextCity)
    setSelectedId(null)
  }

  function handleKindsChange(nextKinds: SpotKind[]) {
    setKinds(nextKinds)
    setSelectedId(null)
  }

  /*
   * 현재 위치는 거리 계산에만 씁니다. 저장하거나 외부로 보내지 않습니다.
   * 실패해도 조용히 넘어가지 않고 상태를 화면에 남깁니다.
   */
  function handleLocate() {
    if (!navigator.geolocation) {
      setOrigin(FALLBACK_ORIGIN)
      setCity("서울")
      setQuery("")
      setSelectedId(null)
      setLocateStatus("unsupported")
      return
    }

    setLocateStatus("locating")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOrigin({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setQuery("")
        setSelectedId(null)
        setLocateStatus("located")
      },
      () => {
        setOrigin(FALLBACK_ORIGIN)
        setCity("서울")
        setQuery("")
        setSelectedId(null)
        setLocateStatus("denied")
      }
    )
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
      <aside
        ref={asideRef}
        className="flex min-h-0 flex-1 flex-col border-hairline bg-background lg:w-[372px] lg:flex-none lg:border-r"
      >
        <div className="flex flex-col gap-3.5 border-b border-hairline p-5">
          <MapSearch value={query} onChange={setQuery} />
          <CityFilter value={city} onChange={handleCityChange} />
          <KindFilter value={kinds} onChange={handleKindsChange} />
        </div>

        <SpotList
          spots={spots}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onLocate={handleLocate}
          locateStatus={locateStatus}
        />
      </aside>

      {/*
        자리표시자에는 아직 볼 것이 없습니다. 좁은 화면에서는 목록에 공간을
        전부 내주고 감춥니다. 실제 지도가 붙으면 이 판단을 다시 해야 합니다.
      */}
      <MapCanvas className="hidden lg:block">
        <MapOverlayBadge city={city} visibleCount={spots.length} />
      </MapCanvas>

      {selected ? (
        // key: 다른 흡연구역을 고르면 패널을 새로 마운트해 상태·포커스를 초기화합니다
        <SpotDetailPanel
          key={selected.id}
          spot={selected}
          onClose={handleCloseDetail}
        />
      ) : null}
    </div>
  )
}
