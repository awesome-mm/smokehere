import type { Metadata } from "next"
import { MapPin, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "컴포넌트 쇼케이스 | SmokeHere",
  description: "디자인 시스템이 적용된 UI 컴포넌트를 한눈에 확인합니다.",
}

/** 섹션 제목 + 설명을 묶어 리듬을 통일합니다 */
function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-6 border-t border-hairline py-16">
      <header className="flex flex-col gap-2">
        <h2 className="text-display-md text-ink">{title}</h2>
        <p className="text-body-sm text-muted-foreground">{description}</p>
      </header>
      {children}
    </section>
  )
}

/** 예시 하나를 라벨과 함께 감쌉니다 */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-micro-label text-muted-foreground">{label}</h3>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

export default function ShowcasePage() {
  return (
    <main className="mx-auto w-full max-w-content px-6 py-16">
      <header className="flex flex-col gap-2 pb-8">
        <h1 className="text-display-xl text-ink">컴포넌트 쇼케이스</h1>
        <p className="text-body-md text-prose">
          Airbnb 기반 디자인 시스템이 적용된 버튼 · 탭 · 인풋 · 모달입니다. 토큰
          정의는 <code>styles/globals.css</code>, 사용 규칙은{" "}
          <code>docs/design-guide.md</code>에 있습니다.
        </p>
      </header>

      <Section
        title="버튼"
        description="기본 높이 48px, 라운딩 8px. 배경 색은 brand-strong(#e00b41)이라 흰 라벨에서 4.89:1로 AA를 통과합니다."
      >
        <Row label="variant">
          <Button>가까운 흡연구역 찾기</Button>
          <Button variant="outline">지도에서 보기</Button>
          <Button variant="secondary">필터</Button>
          <Button variant="ghost">더 보기</Button>
          <Button variant="destructive">신고 삭제</Button>
          <Button variant="link">이용약관</Button>
        </Row>

        <Row label="size">
          <Button size="lg">히어로 CTA (56px)</Button>
          <Button>기본 (48px)</Button>
          <Button size="sm">보조 (40px)</Button>
          <Button size="xs">툴바 (32px)</Button>
        </Row>

        <Row label="아이콘 · pill">
          <Button size="icon" aria-label="현재 위치로 이동">
            <MapPin />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="필터 열기">
            <SlidersHorizontal />
          </Button>
          <Button pill>
            <Search />
            검색
          </Button>
          <Button variant="outline" pill size="sm">
            영업 중
          </Button>
        </Row>

        <Row label="비활성 · 링크 위임">
          <Button disabled>비활성 CTA</Button>
          <Button variant="outline" disabled>
            비활성 아웃라인
          </Button>
          <Button asChild>
            <a href="/map">asChild로 링크에 위임</a>
          </Button>
        </Row>
      </Section>

      <Section
        title="탭"
        description="활성 표시는 색이 아니라 ink 하단 바(형태)가 1차 신호입니다. 트리거 높이는 48px로 터치 타깃을 확보했습니다."
      >
        <Row label="underline (기본)">
          <Tabs defaultValue="near" className="w-full max-w-xl">
            <TabsList>
              <TabsTrigger value="near">가까운 순</TabsTrigger>
              <TabsTrigger value="rating">평점 순</TabsTrigger>
              <TabsTrigger value="open">영업 중</TabsTrigger>
              <TabsTrigger value="saved" disabled>
                저장됨
              </TabsTrigger>
            </TabsList>
            <TabsContent value="near" className="py-4 text-body-sm text-prose">
              현재 위치에서 120m · 강남역 11번 출구 흡연구역
            </TabsContent>
            <TabsContent value="rating" className="py-4 text-body-sm text-prose">
              평점이 높은 순으로 정렬된 목록입니다.
            </TabsContent>
            <TabsContent value="open" className="py-4 text-body-sm text-prose">
              지금 이용할 수 있는 흡연구역만 보여 줍니다.
            </TabsContent>
            <TabsContent value="saved" className="py-4 text-body-sm text-prose">
              저장한 흡연구역이 없습니다.
            </TabsContent>
          </Tabs>
        </Row>

        <Row label="segmented">
          <Tabs defaultValue="map">
            <TabsList variant="segmented">
              <TabsTrigger value="map">지도</TabsTrigger>
              <TabsTrigger value="list">목록</TabsTrigger>
            </TabsList>
            <TabsContent value="map" className="py-4 text-body-sm text-prose">
              지도 보기
            </TabsContent>
            <TabsContent value="list" className="py-4 text-body-sm text-prose">
              목록 보기
            </TabsContent>
          </Tabs>
        </Row>

        <Row label="vertical">
          <Tabs
            defaultValue="info"
            orientation="vertical"
            className="w-full max-w-xl"
          >
            <TabsList>
              <TabsTrigger value="info">기본 정보</TabsTrigger>
              <TabsTrigger value="hours">운영 시간</TabsTrigger>
              <TabsTrigger value="reviews">후기</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="p-4 text-body-sm text-prose">
              실외 · 지붕 있음 · 재떨이 3개
            </TabsContent>
            <TabsContent value="hours" className="p-4 text-body-sm text-prose">
              24시간 개방
            </TabsContent>
            <TabsContent value="reviews" className="p-4 text-body-sm text-prose">
              아직 등록된 후기가 없습니다.
            </TabsContent>
          </Tabs>
        </Row>
      </Section>

      <Section
        title="인풋"
        description="높이 48px로 버튼과 리듬을 맞췄고, 본문 크기를 16px로 고정해 iOS Safari의 자동 확대를 막습니다."
      >
        <div className="grid w-full max-w-xl gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-caption text-ink" htmlFor="search">
              장소 검색
            </label>
            <Input id="search" placeholder="지역이나 장소를 검색하세요" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-caption text-ink" htmlFor="nickname">
              닉네임
            </label>
            <Input id="nickname" defaultValue="흡연구역 탐험가" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-caption text-ink" htmlFor="report">
              신고 내용
            </label>
            <Input
              id="report"
              aria-invalid
              aria-describedby="report-error"
              defaultValue=""
              placeholder="무엇이 잘못되었나요?"
            />
            {/* 색상 하나에 기대지 않도록 텍스트 메시지를 함께 둡니다 */}
            <p id="report-error" className="text-body-sm text-destructive">
              신고 내용을 입력해 주세요.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-caption text-ink" htmlFor="address">
              주소 (읽기 전용)
            </label>
            <Input id="address" readOnly defaultValue="서울시 강남구 역삼동" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-caption text-ink" htmlFor="disabled-input">
              위치 (비활성)
            </label>
            <Input
              id="disabled-input"
              disabled
              placeholder="위치 권한이 필요합니다"
            />
          </div>
        </div>
      </Section>

      <Section
        title="모달"
        description="오버레이는 scrim 50%, 패널은 20px 라운딩에 단일 그림자 티어. 포커스 트랩과 Esc 닫기는 Radix가 처리합니다."
      >
        <Row label="기본">
          <Dialog>
            <DialogTrigger asChild>
              <Button>흡연구역 신고</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>흡연구역을 신고할까요?</DialogTitle>
                <DialogDescription>
                  잘못된 위치이거나 사라진 흡연구역이라면 알려 주세요. 확인 후
                  지도에서 제외합니다.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <label className="text-caption text-ink" htmlFor="reason">
                  신고 사유
                </label>
                <Input id="reason" placeholder="예: 흡연구역이 철거되었습니다" />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">취소</Button>
                </DialogClose>
                <Button>신고하기</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Row>

        <Row label="닫기 아이콘 없음 · 푸터 닫기 버튼">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">위치 권한 안내</Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>위치 권한이 필요합니다</DialogTitle>
                <DialogDescription>
                  가까운 흡연구역을 찾으려면 브라우저 설정에서 위치 접근을
                  허용해 주세요.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter showCloseButton />
            </DialogContent>
          </Dialog>
        </Row>
      </Section>
    </main>
  )
}
