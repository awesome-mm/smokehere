import { SectionShell } from "@/components/home/section-shell"

/*
 * 서비스 취지 소개
 *
 * "WHY & HOW"는 장식 라벨이라 heading으로 만들지 않습니다.
 * 이 섹션의 제목은 "SMOKE HERE" 하나입니다.
 */

export function AboutSection() {
  return (
    <SectionShell bordered surface="page" labelledBy="about-title">
      <div className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="max-sm:text-center">
          <p className="text-eyebrow text-primary uppercase">WHY &amp; HOW</p>
          <h2 id="about-title" className="mt-4.5 text-section text-ink">
            SMOKE HERE
          </h2>
        </div>

        <div className="flex max-w-[38.75rem] flex-col gap-4 max-sm:text-center">
          {/* 두 대구를 나누는 의도적인 조판이라 시안의 <br>을 그대로 둡니다 */}
          <p className="text-body-md text-prose">
            흡연자에게는 지정된 흡연 공간을 쉽게 찾을 수 있는 편리함을,
            <br />
            비흡연자에게는 보다 쾌적한 거리 환경을.
          </p>
          <p className="text-title-md text-ink">
            서로의 공간을 존중하는 작은 배려를 위해.
          </p>
        </div>
      </div>
    </SectionShell>
  )
}
