import Link from "next/link"

/*
 * 다크 배경 푸터
 *
 * 이 프로젝트에서 유일한 반전 면입니다. 흰 배경 기준으로 만들어진 텍스트
 * 위계를 그대로 쓸 수 없어 on-inverse 계열 토큰을 씁니다 —
 * muted-foreground(#6a6a6a)는 ink 배경 위에서 2.94:1로 미달합니다.
 */

/** 원본 시안에 박혀 있던 값입니다. 실제 갱신일과 연결된 데이터가 아직 없습니다. */
const LAST_UPDATED = "2026.08.01"

const SERVICE_LINKS = [
  { href: "/", label: "서비스 소개" },
  { href: "/map", label: "흡연구역 지도" },
  // 제보는 지도에서 마커를 열어 진행합니다 (원본도 지도로 보냅니다)
  { href: "/map", label: "데이터 제보" },
]

const DATA_SOURCES = [
  "서울열린데이터광장",
  "공공데이터포털",
  `최종 갱신 ${LAST_UPDATED}`,
]

export function SiteFooter() {
  return (
    <footer className="bg-ink text-on-inverse">
      <div className="mx-auto max-w-marketing px-5 pt-15 pb-11 sm:px-7">
        <div className="grid gap-10 max-sm:text-center sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-sm:flex max-sm:flex-col max-sm:items-center">
            <p className="flex items-center gap-3 text-background">
              <span
                aria-hidden="true"
                className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-current"
              >
                <span className="size-1.75 rounded-full bg-current" />
              </span>
              <span className="text-body-sm tracking-wider">SmokeHere</span>
            </p>
            <p className="mt-4.5 max-w-[21.25rem] text-caption-sm">
              공공데이터포털 및 각 지방자치단체가 공개한 흡연구역 데이터를 가공해
              제공합니다. 현장 상황에 따라 실제와 다를 수 있습니다.
            </p>
          </div>

          {/* 보이는 제목이 있으므로 aria-label로 이름을 중복해 붙이지 않습니다 */}
          <nav aria-labelledby="footer-service" className="flex flex-col gap-3">
            <h2
              id="footer-service"
              className="text-eyebrow-sm text-on-inverse-muted uppercase"
            >
              Service
            </h2>
            <ul className="flex flex-col gap-3">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="rounded-xs text-caption-sm transition-colors hover:text-background hover:underline focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3">
            <h2
              id="footer-data"
              className="text-eyebrow-sm text-on-inverse-muted uppercase"
            >
              Data
            </h2>
            <ul aria-labelledby="footer-data" className="flex flex-col gap-3">
              {DATA_SOURCES.map((source) => (
                <li key={source} className="text-caption-sm">
                  {source}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-11 flex flex-wrap justify-between gap-5 border-t border-on-inverse/20 pt-5.5 text-caption-sm text-on-inverse-muted max-sm:justify-center">
          <p>© 2026 SmokeHere</p>
          {/* 해당 문서가 아직 없어 링크로 만들지 않았습니다 */}
          <p className="tracking-wider">개인정보처리방침 · 이용약관</p>
        </div>
      </div>
    </footer>
  )
}
