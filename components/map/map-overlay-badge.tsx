import type { CityOption } from "@/lib/map/spots"

/*
 * 지도 좌측 상단에 떠 있는 지역·개수 배지
 *
 * 시안은 `top: 18px; left: 62px`인데, 62px는 Leaflet 줌 컨트롤을 피한 값입니다.
 * 지도 라이브러리를 쓰지 않는 지금은 그 여백의 근거가 없으므로 좌측 여백을
 * 상세 패널과 같은 리듬(16px)으로 맞췄습니다.
 */

/*
 * 시안은 `st.city.toUpperCase()`로 라벨을 만드는데 **한글에는 효과가 없습니다.**
 * "전체"만 "KOREA"로 따로 처리해 둔 걸 보면 로마자 대문자를 의도한 것이라,
 * 나머지 도시도 로마자 표기를 붙였습니다.
 * 눈에는 로마자를, 보조기술에는 한글을 전달합니다.
 */
const CITY_ROMAN_LABEL: Record<CityOption, string> = {
  전체: "KOREA",
  서울: "SEOUL",
  부산: "BUSAN",
  인천: "INCHEON",
  대구: "DAEGU",
}

export function MapOverlayBadge({
  city,
  visibleCount,
}: {
  city: CityOption
  visibleCount: number
}) {
  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-3.5 rounded-md border border-control bg-background/95 px-3.5 py-2.5">
      <span className="text-eyebrow text-muted-foreground">
        <span aria-hidden="true">{CITY_ROMAN_LABEL[city]}</span>
        <span className="sr-only">{city}</span>
      </span>
      <span aria-hidden="true" className="h-3.5 w-px bg-hairline" />
      {/*
        개수 변화는 사이드바의 "N개 결과"가 aria-live로 이미 알립니다.
        같은 수치를 두 번 읽으면 수다스러워지므로 여기는 live로 두지 않습니다.
      */}
      <span className="text-caption-sm font-bold text-ink">
        {visibleCount}개 표시 중
      </span>
    </div>
  )
}
