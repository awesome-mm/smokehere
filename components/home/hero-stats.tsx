/*
 * 히어로 우측 통계 카드 4개
 *
 * 수치가 먼저 읽히고 라벨이 뒤따르는 것이 시각 순서지만, <dl>은 <dt>가 <dd>보다
 * 앞에 와야 유효합니다. DOM 순서는 규격대로 두고 flex-col-reverse로 화면 순서만
 * 뒤집었습니다.
 */

const HERO_STATS = [
  { value: "6,418", label: "등록된 흡연구역" },
  { value: "25", label: "서울시 자치구 전역" },
  { value: "4", label: "검수 중인 광역시" },
  { value: "매주", label: "공공데이터 갱신 주기" },
] as const

export function HeroStats() {
  return (
    <dl className="grid grid-cols-2 gap-3.5">
      {HERO_STATS.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col-reverse gap-2 rounded-md border border-hairline bg-background p-5"
        >
          <dt className="text-caption-sm text-muted-foreground">
            {stat.label}
          </dt>
          <dd className="text-stat text-ink">{stat.value}</dd>
        </div>
      ))}
    </dl>
  )
}
