"use client"

import { Minus, Plus } from "lucide-react"
import { Accordion } from "radix-ui"

import { SectionShell } from "@/components/home/section-shell"

/*
 * 자주 묻는 질문
 *
 * 원본은 <div onClick>으로 토글하고 scrollHeight를 직접 재서 max-height를
 * 계산합니다. 키보드로 열 수 없고 aria-expanded도 없어 그대로 옮기지 않았습니다.
 * 이미 설치된 radix-ui의 Accordion을 씁니다 — 새 패키지가 필요 없습니다.
 */

const FAQS = [
  {
    question: "데이터는 어디서 가져오나요?",
    answer:
      "서울열린데이터광장과 공공데이터포털에 공개된 자치구별 흡연구역 현황을 내려받아 좌표를 정제한 뒤 사용합니다. 원본에 좌표가 없는 항목은 주소를 기준으로 지오코딩합니다.",
  },
  {
    question: "전국 데이터는 언제 추가되나요?",
    answer:
      "광역시부터 순차적으로 추가합니다. 자치단체마다 공개 형식과 갱신 주기가 달라, 검수를 마친 지역부터 지도에 반영하고 있습니다.",
  },
  {
    question: "표시된 곳에서 흡연해도 되나요?",
    answer:
      "지자체가 설치·지정한 구역만 표시합니다. 다만 철거되거나 위치가 바뀐 경우가 있어 현장 안내판을 우선 확인해 주세요.",
  },
  {
    question: "잘못된 정보를 발견했습니다.",
    answer:
      "지도에서 해당 마커를 열고 제보하기를 눌러주세요. 접수된 내용은 원본 데이터와 대조한 뒤 반영합니다.",
  },
]

const CONTACT_EMAIL = "smoke@smokehere.kr"

export function FaqSection() {
  return (
    <SectionShell bordered labelledBy="faq-title">
      <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="max-sm:text-center">
          <p className="text-eyebrow text-primary uppercase">FAQ</p>
          <h2 id="faq-title" className="mt-4.5 text-section text-ink">
            자주 묻는 질문
          </h2>
          <p className="mt-4.5 text-body-sm text-muted-foreground">
            더 궁금한 점은{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="rounded-xs underline underline-offset-4 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            로 보내주세요.
          </p>
        </div>

        {/* 원본과 동일하게 첫 항목이 열린 상태로 시작합니다 */}
        <Accordion.Root
          type="single"
          collapsible
          defaultValue="faq-0"
          className="flex flex-col border-b border-hairline"
        >
          {FAQS.map((faq, index) => (
            <Accordion.Item
              key={faq.question}
              value={`faq-${index}`}
              className="border-t border-hairline"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-5 py-6 text-left transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none">
                  <span className="text-title-md text-ink group-hover:text-primary">
                    {faq.question}
                  </span>
                  {/*
                    원본의 +/− 기호를 아이콘 두 개의 교체로 옮깁니다.
                    원본은 180도 회전 트랜지션도 걸지만, +와 −는 180도 돌려도
                    같은 모양이라 화면에 드러나지 않습니다.
                  */}
                  <Plus
                    aria-hidden="true"
                    className="size-5 shrink-0 text-primary group-data-[state=open]:hidden"
                  />
                  <Minus
                    aria-hidden="true"
                    className="size-5 shrink-0 text-primary group-data-[state=closed]:hidden"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <p className="max-w-[38.75rem] pb-6 text-body-sm text-prose text-pretty">
                  {faq.answer}
                </p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </SectionShell>
  )
}
