# SmokeHere 디자인 가이드

Airbnb 디자인 시스템을 기반으로 SmokeHere에 적용한 토큰과 사용 규칙입니다.
실제 정의는 `styles/globals.css` 한 곳에 있으며, 이 문서는 "왜 그렇게 정했는지"와
"어떤 상황에 무엇을 쓰는지"를 다룹니다.

## 기본 전제

| 항목 | 결정 | 이유 |
|---|---|---|
| 테마 | 라이트 전용 | Airbnb 공개 웹은 다크모드가 없습니다. `.dark` 블록을 제거했습니다. |
| 폰트 | Inter | Airbnb Cereal VF는 유료 라이선스입니다. 가이드가 명시한 대체 폰트를 씁니다. |
| 그림자 | 단일 티어 | 깊이는 사진과 라운딩이 만듭니다. 단계형 elevation을 만들지 마세요. |
| 하드 코너 | 없음 | 모든 인터랙티브 요소가 둥급니다. `rounded-none`을 쓰지 마세요. |

`dark:` variant는 `.dark` 클래스에 묶여 있습니다(`@custom-variant`). 이 클래스를
어디에도 붙이지 않으므로 사실상 꺼져 있지만, 제거하지는 않았습니다. 제거하면
shadcn 컴포넌트에 딸려 오는 `dark:` 클래스가 OS 다크모드에서 제멋대로 발동합니다.

## 색상

### Rausch를 두 개로 쪼갠 이유 — 가장 중요한 규칙

원본 Airbnb는 CTA 배경에 `#ff385c`(Rausch)를 씁니다. 그런데 **흰 텍스트를 얹으면
대비가 3.52:1**로, WCAG AA 일반 텍스트 기준(4.5:1)에 미달합니다. CTA 라벨이
16px/500이라 "큰 텍스트" 예외(3:1)도 받지 못합니다. 프로젝트 규약이 WCAG 준수를
필수로 걸고 있어 두 토큰으로 분리했습니다.

| 토큰 | 값 | 흰 텍스트 대비 | 용도 |
|---|---|---|---|
| `brand` | `#ff385c` | 3.52:1 ⚠ | **비텍스트 전용** — 로고, 지도 마커, 아이콘, 하트 fill, 장식 |
| `brand-strong` | `#e00b41` | 4.89:1 ✅ | **텍스트를 얹는 모든 면** — CTA 배경, 배지 |
| `brand-subtle` | `#ffd1da` | 1.37:1 ❌ | 비활성 CTA 배경. 라벨은 반드시 `text-ink` |

`--primary`는 `brand-strong`을 가리킵니다. 즉 `bg-primary text-primary-foreground`는
그냥 써도 AA를 통과합니다.

```tsx
// ✅ 텍스트가 올라가는 면
<Button>가까운 흡연구역 찾기</Button>          // bg-primary = #e00b41

// ✅ 텍스트가 없는 브랜드 순간
<MapPin className="fill-brand text-brand" />
<Heart className="fill-brand" />

// ❌ 절대 금지 — 3.52:1
<div className="bg-brand text-white">저장됨</div>
```

`brand`를 텍스트 색으로 쓰는 것도 같은 이유로 금지입니다(흰 배경 위 3.52:1).
브랜드 컬러 텍스트가 필요하면 `text-primary`를 쓰세요.

### 텍스트 위계

| 토큰 | 값 | 대비 | 용도 |
|---|---|---|---|
| `foreground` / `ink` | `#222222` | 15.91:1 | 제목, 기본 본문, 내비 링크. 순수 검정은 쓰지 않습니다 |
| `prose` | `#3f3f3f` | 10.53:1 | 장문 running text. ink가 무거울 때만 |
| `muted-foreground` | `#6a6a6a` | 5.41:1 | 부제목, 메타 정보, 거리/시간 |
| `muted-soft` | `#929292` | 3.11:1 ⚠ | 비활성 텍스트 **전용**. 읽혀야 하는 정보에 쓰지 마세요 |
| `legal-link` | `#428bff` | 3.30:1 ⚠ | 약관·개인정보 문구 내 링크 한정. 밑줄을 함께 쓰세요 |

### 표면과 경계

`background`(#fff) · `surface-soft`(#f7f7f7, 호버/비활성 필) ·
`surface-strong`(#f2f2f2, 원형 아이콘 버튼 배경)

`border`/`hairline`(#dddddd, 기본 1px) · `hairline-soft`(#ebebeb, 장문 구분선) ·
`border-strong`(#c1c1c1, 비활성 아웃라인)

`scrim`은 모달 backdrop용이며 **렌더 시점에 50% 불투명도**로 씁니다: `bg-scrim/50`.

## 타이포그래피

크기·행간·굵기·자간이 토큰 하나에 묶여 있습니다. `text-display-xl`만 쓰면
28px/700/1.43이 한 번에 적용되므로 `font-bold`나 `leading-*`를 덧붙이지 마세요.

| 토큰 | 스펙 | 용도 |
|---|---|---|
| `text-rating-display` | 64/700 | 대표 수치 하나. 페이지당 한 번만 |
| `text-display-xl` | 28/700 | 페이지 h1 |
| `text-display-lg` | 22/500 | 상세 페이지 h1 |
| `text-display-md` | 21/700 | 섹션 제목 |
| `text-display-sm` | 20/600 | 서브섹션 제목 |
| `text-title-md` | 16/600 | 카드 제목 |
| `text-title-sm` | 16/500 | 푸터 컬럼 헤드 |
| `text-body-md` | 16/400 | 기본 본문 (`body`에 이미 적용) |
| `text-body-sm` | 14/400 | 카드 메타, 거리, 운영시간 |
| `text-caption` | 14/500 | 폼 필드 라벨 |
| `text-caption-sm` | 13/400 | 법적 문구 |
| `text-badge` | 11/600 | 플로팅 배지 |
| `text-micro-label` | 12/700 | 카드 마이크로 라벨 |
| `text-uppercase-tag` | 8/700 | NEW 태그. `uppercase`를 함께 쓰세요 |
| `text-button-md` / `text-button-sm` | 16/500 · 14/500 | 버튼 라벨 |
| `text-link` | 14/400 | 인라인 링크 |
| `text-nav-link` | 16/600 | 상단 내비 |

### `cn()`이 타이포 토큰을 알아야 하는 이유

tailwind-merge는 기본 스케일(`text-sm`, `text-lg` …)만 font-size로 알고, 나머지
`text-*`는 전부 **색상**으로 분류합니다. 그대로 두면 `text-body-md text-ink`처럼
크기와 색을 함께 쓸 때 둘이 같은 그룹으로 취급돼 **뒤에 온 쪽이 앞의 것을 지웁니다.**
실제로 Input의 `text-body-md`가 `text-ink`에 먹혀 사라지는 버그가 있었습니다.

그래서 `lib/utils.ts`의 `cn()`은 `extendTailwindMerge`로 위 표의 토큰 18개를
`font-size` 그룹에 등록합니다. **타이포 토큰을 새로 추가하면 `globals.css`와
`lib/utils.ts` 양쪽을 같이 고쳐야 합니다.** 한쪽만 고치면 조용히 사라집니다.

**디스플레이 굵기를 올리지 마세요.** h1이 28px인 것은 의도된 것입니다. 이 시스템은
타이포그래피 근육이 아니라 지도·사진·여백으로 위계를 만듭니다.

`text-rating-display`는 원본에서 별점 자리였습니다. SmokeHere에서는 "가장 가까운
흡연구역까지 120m" 같은 **핵심 수치 한 개**에 씁니다. 이 시스템에서 타입 하나로
위계를 만드는 유일한 지점입니다.

## 라운딩

Tailwind 기본 스케일을 Airbnb 값으로 재정의했습니다.

| 클래스 | 값 | 용도 |
|---|---|---|
| `rounded-xs` | 4px | 아주 작은 칩 |
| `rounded-sm` | 8px | **버튼, 인풋** |
| `rounded-md` | 14px | **카드** |
| `rounded-lg` | 20px | 큰 패널, 바텀시트 |
| `rounded-xl` | 32px | 카테고리 스트립 |
| `rounded-full` | — | 검색바, 필터 칩, 아이콘 버튼, 지도 컨트롤 |

shadcn 컴포넌트를 새로 추가하면 기본값이 `rounded-lg`(20px)인 경우가 많습니다.
버튼류는 `rounded-sm`, 카드류는 `rounded-md`로 내려 주세요.

## 간격 · 레이아웃

Tailwind 기본 4px 스케일이 Airbnb 스케일과 일치해서 별도 토큰을 만들지 않았습니다.
`p-2`=8 · `p-3`=12 · `p-4`=16 · `p-6`=24 · `p-8`=32 · `p-12`=48 · `p-16`=64

- 섹션 세로 여백: `py-16` (64px)
- 카드 내부 패딩: `p-6` (24px), 메타 블록은 `p-4` (16px)
- 카드 그리드 간격: `gap-4` (16px)
- 컨테이너: `max-w-content` (1280px) / `max-w-detail` (1080px)

**여백 철학**: 히어로와 섹션은 넉넉하게, 카드 그리드는 촘촘하게. "열린 상단,
조밀한 목록"이 마켓플레이스의 리듬입니다.

## 그림자

시스템 전체에 티어가 하나뿐입니다.

```tsx
<article className="rounded-md shadow-float">…</article>
```

카드 호버 부양, 검색바 기본 상태, 드롭다운/시트에만 씁니다. 다른 그림자를
새로 정의하지 마세요.

## 버튼

`components/ui/button.tsx`에 적용된 스펙입니다.

| size | 높이 | 용도 |
|---|---|---|
| `default` | 48px | 기본 CTA. 터치 타깃 44px 기준을 넘습니다 |
| `lg` | 56px | 히어로 CTA |
| `sm` | 40px | 보조 액션 |
| `xs` | 32px | **밀집 툴바 전용.** 터치 UI에서 쓰지 마세요 (44px 미달) |

`pill` prop으로 완전 원형을 만듭니다: `<Button pill>필터</Button>`

### 원본에서 의도적으로 벗어난 부분

1. **CTA 기본 배경을 `#e00b41`로** — 위의 대비 문제 때문입니다.
2. **호버는 밝게가 아니라 어둡게** (`color-mix`로 12% 어둡게). `#ff385c`로 밝히면
   호버 상태에서 대비가 3.52:1로 떨어집니다.
3. **비활성 라벨은 흰색이 아니라 ink** — 흰 텍스트는 `brand-subtle` 위에서
   1.37:1로 읽히지 않습니다. 비활성 요소가 WCAG 대비 요구에서 면제되더라도
   읽을 수 없는 것을 만들 이유는 없습니다.
4. **포커스는 링 + offset** — 원본은 "2px ink 테두리, 글로우 없음"이지만
   키보드 포커스 가시성(WCAG 2.4.11)을 위해 offset 링을 씁니다.

## 접근성 체크리스트

새 컴포넌트를 만들 때 확인하세요.

- [ ] 텍스트 대비 4.5:1 이상 (큰 텍스트 18.66px+ bold는 3:1)
- [ ] 배경에 `brand`(#ff385c)를 쓰고 그 위에 텍스트를 얹지 않았는가
- [ ] 터치 타깃 44×44px 이상 (`size="xs"`는 마우스 전용)
- [ ] 키보드 포커스가 눈에 보이는가 — `focus-visible:ring-2 ring-ring ring-offset-2`
- [ ] 클릭 가능 요소에 `cursor-pointer`, 비활성에 `cursor-not-allowed`
- [ ] 아이콘 단독 버튼에 `aria-label`
- [ ] 색상만으로 정보를 전달하지 않는가 (아이콘·텍스트 병행)
- [ ] `prefers-reduced-motion` — 전역으로 처리돼 있으나 JS 애니메이션은 별도 확인

## 참고

- 원본 분석 문서: Airbnb design analysis (세션 입력)
- 색상 변환·대비 검증은 sRGB → OKLab 직접 변환으로 계산했습니다.
  빌드 시 Lightning CSS가 oklch를 hex + `lab()` 폴백으로 컴파일하며,
  `--primary`가 정확히 `#e00b41`로 라운드트립되는 것을 확인했습니다.
