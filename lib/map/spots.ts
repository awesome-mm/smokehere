/*
 * 흡연구역 데이터
 *
 * Claude Design 시안 `Map.dc.html`의 SPOTS 배열을 그대로 옮긴 **샘플 데이터**입니다.
 * 실제 공공데이터 연동 전까지 화면을 채우는 용도이며, 좌표·운영시간·수용 인원은
 * 검증되지 않았습니다. API가 붙으면 이 파일은 통째로 대체됩니다.
 */

/** 흡연구역의 형태. 사이드바 필터 칩과 배지가 이 값을 그대로 씁니다. */
export const SPOT_KINDS = ["부스형", "개방형", "실내형"] as const
export type SpotKind = (typeof SPOT_KINDS)[number]

/** "전체"는 필터를 걸지 않는다는 뜻이라 도시 이름이 아니라 선택지입니다. */
export const CITY_OPTIONS = ["전체", "서울", "부산", "인천", "대구"] as const
export type CityOption = (typeof CITY_OPTIONS)[number]
export type City = Exclude<CityOption, "전체">

export type LatLng = { lat: number; lng: number }

export type SmokingSpot = {
  id: number
  city: City
  name: string
  address: string
  lat: number
  lng: number
  kind: SpotKind
  /** 실내 여부. 상세 패널에서 형태와 함께 표기합니다. */
  indoor: boolean
  hours: string
  /** 수용 인원. "8명"처럼 단위가 붙은 표시용 문자열입니다. */
  cap: string
  /** 관리 주체 (지자체 또는 민간) */
  agency: string
  /** 데이터 갱신일 `YYYY.MM.DD` */
  updated: string
}

/** 도시별 지도 중심 좌표. 실제 지도를 붙일 때 초기 뷰포트로 씁니다. */
export const CITY_CENTERS: Record<CityOption, LatLng> = {
  전체: { lat: 36.5, lng: 127.9 },
  서울: { lat: 37.5525, lng: 126.9905 },
  부산: { lat: 35.14, lng: 129.07 },
  인천: { lat: 37.42, lng: 126.55 },
  대구: { lat: 35.872, lng: 128.595 },
}

/** 위치 권한이 없을 때 쓰는 기본 기준점 (서울 시청) */
export const DEFAULT_ORIGIN: LatLng = { lat: 37.5665, lng: 126.978 }

export const SPOTS: SmokingSpot[] = [
  { id: 1, city: "서울", name: "강남역 11번 출구 흡연부스", address: "서울 강남구 강남대로 396", lat: 37.4979, lng: 127.0276, kind: "부스형", indoor: true, hours: "24시간", cap: "8명", agency: "강남구청", updated: "2026.07.28" },
  { id: 2, city: "서울", name: "테헤란로 파이낸스센터 앞", address: "서울 강남구 테헤란로 152", lat: 37.5006, lng: 127.0366, kind: "개방형", indoor: false, hours: "24시간", cap: "12명", agency: "강남구청", updated: "2026.07.28" },
  { id: 3, city: "서울", name: "선릉역 남측 광장", address: "서울 강남구 테헤란로 340", lat: 37.5045, lng: 127.0491, kind: "개방형", indoor: false, hours: "24시간", cap: "10명", agency: "강남구청", updated: "2026.07.14" },
  { id: 4, city: "서울", name: "홍대입구역 9번 출구", address: "서울 마포구 양화로 지하 160", lat: 37.557, lng: 126.9245, kind: "부스형", indoor: true, hours: "06:00–02:00", cap: "6명", agency: "마포구청", updated: "2026.07.20" },
  { id: 5, city: "서울", name: "합정 메세나폴리스 외부", address: "서울 마포구 양화로 45", lat: 37.5497, lng: 126.9139, kind: "개방형", indoor: false, hours: "24시간", cap: "9명", agency: "마포구청", updated: "2026.06.30" },
  { id: 6, city: "서울", name: "여의도공원 동측 흡연구역", address: "서울 영등포구 여의공원로 68", lat: 37.5265, lng: 126.9243, kind: "개방형", indoor: false, hours: "05:00–24:00", cap: "15명", agency: "영등포구청", updated: "2026.07.05" },
  { id: 7, city: "서울", name: "IFC몰 지하 흡연실", address: "서울 영등포구 국제금융로 10", lat: 37.5252, lng: 126.9257, kind: "실내형", indoor: true, hours: "10:00–22:00", cap: "20명", agency: "민간 설치", updated: "2026.07.11" },
  { id: 8, city: "서울", name: "성수동 카페거리 입구", address: "서울 성동구 연무장길 7", lat: 37.5443, lng: 127.0557, kind: "개방형", indoor: false, hours: "24시간", cap: "7명", agency: "성동구청", updated: "2026.07.22" },
  { id: 9, city: "서울", name: "서울숲역 3번 출구", address: "서울 성동구 왕십리로 지하 55", lat: 37.5443, lng: 127.0374, kind: "부스형", indoor: true, hours: "24시간", cap: "5명", agency: "성동구청", updated: "2026.06.18" },
  { id: 10, city: "서울", name: "광화문광장 북측", address: "서울 종로구 세종대로 172", lat: 37.5726, lng: 126.9769, kind: "개방형", indoor: false, hours: "24시간", cap: "10명", agency: "종로구청", updated: "2026.07.30" },
  { id: 11, city: "서울", name: "종각역 종로타워 뒤", address: "서울 종로구 종로 51", lat: 37.57, lng: 126.9829, kind: "개방형", indoor: false, hours: "24시간", cap: "14명", agency: "종로구청", updated: "2026.07.30" },
  { id: 12, city: "서울", name: "명동예술극장 옆 부스", address: "서울 중구 명동길 35", lat: 37.5637, lng: 126.9857, kind: "부스형", indoor: true, hours: "08:00–23:00", cap: "6명", agency: "중구청", updated: "2026.07.09" },
  { id: 13, city: "서울", name: "서울역 서부광장", address: "서울 중구 청파로 426", lat: 37.5552, lng: 126.97, kind: "개방형", indoor: false, hours: "24시간", cap: "18명", agency: "중구청", updated: "2026.07.26" },
  { id: 14, city: "부산", name: "부산역 광장 흡연부스", address: "부산 동구 중앙대로 206", lat: 35.1151, lng: 129.0413, kind: "부스형", indoor: true, hours: "24시간", cap: "8명", agency: "동구청", updated: "2026.06.22" },
  { id: 15, city: "부산", name: "서면 롯데백화점 앞", address: "부산 부산진구 가야대로 772", lat: 35.1577, lng: 129.0563, kind: "개방형", indoor: false, hours: "24시간", cap: "12명", agency: "부산진구청", updated: "2026.06.22" },
  { id: 16, city: "부산", name: "해운대해수욕장 지정구역", address: "부산 해운대구 해운대해변로 264", lat: 35.1587, lng: 129.1604, kind: "개방형", indoor: false, hours: "24시간", cap: "10명", agency: "해운대구청", updated: "2026.05.30" },
  { id: 17, city: "인천", name: "인천공항 T1 실외 흡연구역", address: "인천 중구 공항로 272", lat: 37.4491, lng: 126.4506, kind: "개방형", indoor: false, hours: "24시간", cap: "25명", agency: "인천국제공항공사", updated: "2026.07.02" },
  { id: 18, city: "인천", name: "송도 센트럴파크 남측", address: "인천 연수구 컨벤시아대로 160", lat: 37.3928, lng: 126.639, kind: "개방형", indoor: false, hours: "06:00–24:00", cap: "8명", agency: "연수구청", updated: "2026.06.14" },
  { id: 19, city: "대구", name: "동성로 대구백화점 앞", address: "대구 중구 동성로2가 162", lat: 35.8693, lng: 128.5951, kind: "부스형", indoor: true, hours: "10:00–24:00", cap: "6명", agency: "중구청", updated: "2026.05.19" },
  { id: 20, city: "대구", name: "대구역 동편 광장", address: "대구 북구 태평로 161", lat: 35.876, lng: 128.596, kind: "개방형", indoor: false, hours: "24시간", cap: "10명", agency: "북구청", updated: "2026.05.19" },
]
