# SmokeHere 기준 컨텍스트

이 문서는 SmokeHere 서비스에 대해 이미 확정되었거나 사용자가 명시적으로 밝힌 사실만 담습니다. PRD를 새로 쓸 때마다 이 내용을 다시 물어볼 필요는 없습니다. 대화 중 여기 없는 새로운 결정이 나오면 이 파일도 함께 갱신하세요.

## 한 줄 정의

빠르게 흡연구역을 찾을 수 있는 서비스. 회원가입 없이 누구나 즉시 쓸 수 있어야 한다.

## 설계 철학

처음부터 기술을 많이 넣는 것이 좋은 설계는 아니다. 이 프로젝트의 기술적 재미는 라이브러리 개수가 아니라 다음 흐름에 있다:

> 공공데이터 정규화 → 위치 기반 탐색 → 지역 단위 캐싱 → 로그인 없는 LocalStorage 개인화 → SEO/QR 접근 → 외부 지도에 길찾기 책임 위임


## 확정된 아키텍처 결정 (뒤집지 말 것)

- **Next.js 16 App Router 기반 Web-First 구조**: 앱 설치 없이 즉시 접근 가능해야 하고, 지역별 흡연구역 페이지를 서버 렌더링해 SEO에 대응.
- **공공데이터는 Route Handler에서 정규화·캐싱**: 클라이언트가 공공 API를 직접 호출하지 않음 — API 키 보호 + 서로 다른 공공데이터 형식을 공통 `SmokingArea` 모델로 정규화.
- **캐싱 정책**: 공공 API 데이터는 24시간마다 갱신되는 것을 인지하고 Next.js Data Cache로 24시간 단위 캐싱. 기존 검색어(쿼리)도 캐싱.
- **로그인/회원가입 없음**: 진입 장벽 제거가 핵심 가치. 북마크와 최근 검색어는 LocalStorage에 저장.
- **길찾기는 Google Maps 딥링크로 위임**: 자체 경로 계산/렌더링을 만들지 않음 (아래 "명시적으로 하지 않는 것" 참고).
- **DB는 MVP에서 없음**: 필요해지면(2차, 사용자 제보 기능) Supabase PostgreSQL 도입.
- **오픈소스로 공개**: 누구나 수정할 수 있도록 개방.
- **PWA로 배포, 네이티브 앱은 추후**: Web App Manifest + Service Worker로 홈 화면 설치까지만 MVP 범위. Capacitor(iOS/Android 네이티브 래핑)는 사용자가 많아진 이후(4차)에 검토.

## 기술 스택

| 영역 | 기술 | 용도 |
| --- | --- | --- |
| Framework | Next.js 16 App Router | 웹앱, SEO, 서버 API |
| Language | TypeScript | 타입 안정성, 공공 API 응답을 공통 모델로 정규화 |
| UI | Tailwind CSS + shadcn/ui | 반응형 UI, 접근성을 고려한 컴포넌트 재사용 |
| Icon | Lucide React | 아이콘 |
| Map | Google Maps JavaScript API | 지도 및 흡연구역 Marker 시각화 |
| 장소 검색 | Google Places API | 강남역, 호텔, 건물 등 장소명 검색 |
| 현재 위치 | Browser Geolocation API | 사용자 현재 위치(위도/경도) |
| 흡연구역 데이터 | 공공데이터 API (지자체 흡연구역 데이터셋, data.go.kr 계열) | 실제 흡연구역 정보 |
| 서버 API | Next.js Route Handler | 공공 API Proxy 및 데이터 정규화 |
| 캐싱 | Next.js Data Cache | 공공데이터 24시간 캐싱 |
| 개인 데이터 저장 | LocalStorage | 북마크, 최근 검색어 |
| 상태관리 | React State → 필요 시 Zustand | 지도/검색 UI 상태 |
| URL 상태 | URL Search Params | 검색 위치/좌표를 URL로 표현, QR·링크 공유 시 특정 지역 화면으로 바로 진입 |
| 길찾기 | Google Maps Deep Link | 외부 지도 앱/웹으로 길찾기 위임 |
| 앱화 | PWA (Web App Manifest + Service Worker) → 추후 Capacitor | 웹앱 설치, 이후 네이티브 확장 |
| 배포 | Vercel | Server Rendering / Route Handler / 캐싱을 별도 인프라 없이 배포 |
| DB | 없음 (MVP) → 추후 Supabase PostgreSQL | 사용자 제보 기능이 필요해질 때 도입 |

## 전체 아키텍처 흐름

```
Browser (Next.js Client Component)
  - Geolocation API, LocalStorage, Search Params
  - 현재위치 / 북마크 / 최근검색 / 지도상태
        │
        ▼
Next.js App Router (Server Component + Route Handler)
  - Data Normalization
  - 24h Cache
        │
        ▼
Public Data API (흡연구역 데이터)

Google Maps JavaScript API는 Browser 쪽에서 지도/마커 렌더링에 별도로 연동됨.

추후(2차): 사용자 제보 → Supabase PostgreSQL
```

## 서비스 로직 (길찾기)

사용자 → 흡연구역 선택 → [길찾기] → Google Maps Deep Link → Google Maps 앱/웹 실행

이 흐름 때문에 아래 항목은 **명시적으로 만들지 않는다** (자체 길찾기 기능 구현 금지):

- Google Routes API 연동
- 경로 계산용 서버 API 구현
- 출발지 → 목적지 경로 계산
- Polyline 경로 렌더링
- 예상 도보시간 계산 API
- 경로 관련 에러 처리
- 경로 데이터 캐싱
- 길찾기 관련 상태관리

## 로드맵

### 1차 (MVP)

- 현재 위치 검색
- 장소 검색 (Google Places API)
- 흡연구역 지도 표시
- 흡연구역 거리순 정렬
- 흡연구역 상세 정보
- 도보 길찾기 연결 (Google Maps 딥링크)
- 자주 가는 장소 저장 (북마크, LocalStorage)
- 최근 검색어 (LocalStorage)
- 공공 API 24시간 캐싱
- QR 접근 (URL Search Params 기반 지역 화면 진입)
- SEO 지역 페이지
- 반응형 UI
- PWA
- 배포 (Vercel)

### 2차

- 사용자 제보 (잘못된 흡연구역 신고, 신규 흡연구역 제보)
- 공공데이터 + 사용자 데이터 조합
- Supabase 도입

### 3차

- 주변 음식점 / 카페 / 헬스장 / 클라이밍장 / 공원 등 추가 정보 제공
- 다국어 지원

### 4차

- 사용자가 많아졌을 경우 Capacitor로 iOS/Android 네이티브 앱 제공

### 로드맵과 별개로 존재하는 추후 아이디어 (우선순위 미정)

- 금연 관련 알림 팝업: 금연 사탕/캡슐 상품 팝업, 금연 상담 및 도움 서비스, 아이코스 냄새 제거 캠페인
- 데이터 정확도에 대한 사용자 투표 (예: 👍 존재해요 / 👎 없어졌어요) — 2차 "사용자 제보"와 연결될 가능성이 있음

## 타겟 사용자

- 낯선 지역(다른 지역으로 이전한 회사, 여행/외출 목적지)에서 흡연구역을 찾아야 하는 사람
- 해외에서 방문했거나 다른 지역에서 놀러온 사람 — "호텔"처럼 임시로 머무는 위치를 북마크할 필요가 있음

## MVP 서비스 지역

서울/수도권 우선 출시 (공공데이터 커버리지가 가장 두터운 지역).

## 성공지표 방향

지속 사용자/재방문 지표(예: 재방문율, 북마크 저장 사용자 비율)를 핵심으로 본다. 구체적인 목표 수치는 아직 정해지지 않았음 — PRD의 "확인 필요" 섹션에 남길 것.

## 흡연구역 데이터 소스

공공데이터포털(data.go.kr 계열)의 지자체별 흡연구역/흡연시설 데이터셋. 구체적인 데이터셋명/API 엔드포인트는 아직 미확정 — 기술 조사 단계에서 확정.

## 아직 확인되지 않은 것 (PRD 작성 시 확인할 것)

- 재방문율/활성 사용자 등 성공지표의 구체적 목표 수치
- 공공데이터포털의 정확한 데이터셋명/API 엔드포인트
