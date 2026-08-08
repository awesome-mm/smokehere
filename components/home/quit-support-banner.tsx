import { SectionShell } from "@/components/home/section-shell"

/*
 * 금연 지원 캠페인 배너
 *
 * brand-strong(#e00b41) 배경 위 흰 텍스트로 4.89:1을 확보합니다.
 * 원본이 보조 문구에 걸어 둔 opacity: 0.9는 대비를 4.13:1로 떨어뜨려 제거했습니다.
 * 경위는 docs/design-import/sections/banner.md
 */

const QUIT_LINE = "1544-9030"

export function QuitSupportBanner() {
  return (
    <SectionShell surface="page" labelledBy="quit-support-title">
      <p className="text-eyebrow text-primary uppercase">금연 지원 캠페인</p>

      <div className="mt-4.5 grid items-center gap-10 rounded-md bg-primary px-6 py-8 text-primary-foreground sm:px-10 lg:grid-cols-[1fr_auto]">
        <div className="max-sm:text-center">
          <p className="flex items-center gap-2 text-body-sm max-sm:justify-center">
            <span
              aria-hidden="true"
              className="size-4.5 shrink-0 rounded-full border-2 border-current"
            />
            보건복지부 금연지원센터
          </p>
          {/*
            조건절과 주절을 나누는 의도적인 조판입니다. 시안의 <br> 위치를
            그대로 지킵니다. 좁은 화면에서 각 줄이 더 접히는 것은
            word-break: keep-all이 어절 단위로 처리합니다.
          */}
          <h2 id="quit-support-title" className="mt-3.5 text-section">
            끊기로 마음먹었다면,
            <br />
            혼자 하지 않아도 됩니다.
          </h2>
        </div>

        <div className="flex flex-col gap-2.5 max-sm:items-center max-sm:text-center lg:items-end lg:text-right">
          <p className="text-body-sm">
            전국 보건소 금연클리닉 · 상담과 금연보조제 무료 지원
          </p>

          {/*
            원본은 번호가 그냥 텍스트라 모바일에서 누를 수 없습니다.
            배너의 목적이 전화 연결이므로 tel: 링크로 만들고,
            모바일의 주 액션이므로 터치 타깃 44px를 확보합니다.
          */}
          <a
            href={`tel:${QUIT_LINE.replace("-", "")}`}
            className="inline-flex min-h-11 items-center gap-3 rounded-sm hover:underline focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none"
          >
            <span className="rounded-sm bg-background px-3.5 py-1.5 text-caption text-primary">
              금연상담
            </span>
            <span className="text-stat">{QUIT_LINE}</span>
          </a>

          <p className="text-caption-sm">평일 09:00 – 22:00 · 무료</p>
        </div>
      </div>
    </SectionShell>
  )
}
