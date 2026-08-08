"use client"

import { useEffect, useId, useRef, useState } from "react"
import { ExternalLink, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { SmokingSpot } from "@/lib/map/spots"

/*
 * 선택한 흡연구역의 상세 패널
 *
 * 지도 위에 겹쳐 뜨지만 **모달이 아닙니다.** 뒤쪽 목록과 필터는 계속 쓸 수
 * 있어야 하므로 포커스를 가두지 않고 배경도 가리지 않습니다.
 *
 * ⚠ 부모는 반드시 `key={spot.id}`를 넘겨야 합니다.
 *   다른 흡연구역을 고르면 제보 안내가 초기화되고 포커스가 새 패널로 옮겨져야
 *   하는데, effect에서 setState로 되돌리는 대신 key로 새로 마운트시킵니다.
 */

function buildDirectionsUrl(spot: SmokingSpot) {
  // API 키가 필요 없는 구글 지도 길찾기 URL 스킴입니다.
  return `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`
}

export function SpotDetailPanel({
  spot,
  onClose,
}: {
  spot: SmokingSpot
  onClose: () => void
}) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const [reportNoticed, setReportNoticed] = useState(false)

  /*
   * 목록에서 항목을 활성화해 이 패널이 열리므로, 키보드 사용자가 곧바로
   * 길찾기까지 도달할 수 있게 포커스를 패널로 옮깁니다.
   * key로 다시 마운트되므로 흡연구역이 바뀔 때마다 실행됩니다.
   */
  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  // 모달이 아니라 포커스를 가두지 않으므로, Esc는 문서 수준에서 받습니다
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const facts = [
    { label: "형태", value: `${spot.kind} · ${spot.indoor ? "실내" : "실외"}` },
    { label: "운영 시간", value: spot.hours },
    { label: "수용 인원", value: `약 ${spot.cap}` },
    { label: "관리 주체", value: spot.agency },
    { label: "데이터 갱신", value: spot.updated },
  ]

  /*
   * 좁은 화면에서는 지도 자리표시자를 감추므로 패널이 붙을 곳이 없습니다.
   * fixed 하단 시트로 띄우고, lg 이상에서만 지도 영역 우측에 붙입니다.
   */
  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="region"
      aria-labelledby={titleId}
      className="fixed inset-x-4 bottom-4 z-30 flex max-h-[70%] flex-col overflow-hidden rounded-md border border-control bg-background animate-in fade-in slide-in-from-bottom-2 duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:absolute lg:inset-x-auto lg:top-4 lg:right-5 lg:bottom-5 lg:max-h-none lg:w-[330px]"
    >
      <div className="shrink-0 border-b border-hairline p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="rounded-xs bg-surface-soft px-2 py-0.5 text-caption-sm font-bold text-primary">
              {spot.kind}
            </span>
            <h2 id={titleId} className="mt-3 text-display-sm text-ink">
              {spot.name}
            </h2>
          </div>
          <Button
            variant="outline"
            size="icon-xs"
            aria-label="상세 정보 닫기"
            onClick={onClose}
            className="shrink-0 border-hairline bg-surface-soft"
          >
            <X aria-hidden="true" />
          </Button>
        </div>
        <p className="mt-3 text-body-sm text-prose">{spot.address}</p>
      </div>

      <dl className="min-h-0 flex-1 overflow-y-auto px-5">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="flex justify-between gap-4 border-b border-hairline py-3"
          >
            <dt className="shrink-0 text-caption-sm text-muted-foreground">
              {fact.label}
            </dt>
            <dd className="text-right text-body-sm font-semibold text-ink">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex shrink-0 flex-col gap-2.5 border-t border-hairline p-5">
        <Button
          asChild
          variant="ghost"
          className="bg-ink text-background hover:bg-primary hover:text-primary-foreground"
        >
          <a
            href={buildDirectionsUrl(spot)}
            target="_blank"
            rel="noopener noreferrer"
          >
            길찾기
            <ExternalLink aria-hidden="true" />
            <span className="sr-only">(구글 지도, 새 창에서 열림)</span>
          </a>
        </Button>

        {/*
          시안은 이 버튼을 누르면 라벨이 "제보가 접수되었습니다"로 바뀝니다.
          실제로는 아무것도 전송하지 않습니다 — 접수됐다고 말하면 거짓입니다.
          받을 곳이 생길 때까지는 준비 중임을 그대로 알립니다.
        */}
        <Button
          variant="outline"
          onClick={() => setReportNoticed(true)}
          className="border-hairline text-prose"
        >
          정보가 다릅니다 · 제보하기
        </Button>
        {reportNoticed ? (
          <p role="status" className="text-caption-sm text-muted-foreground">
            제보 기능은 아직 연결되지 않았습니다. 준비되면 이 화면에서 바로
            보낼 수 있습니다.
          </p>
        ) : null}
      </div>
    </div>
  )
}
