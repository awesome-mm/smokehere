# WHY & HOW

> 상태: **구현 완료** (브라우저 확인은 #11) · 태스크 #4 · 2026-08-08

## 범위

서비스 취지 소개 2단 섹션. 여기서 **섹션 공통 껍데기**를 확정하고 이후 섹션이
재사용합니다.

## 원본

`Home.dc.html` → 첫 번째 `data-r="two"` 블록

## 구현 대상

- `components/home/about-section.tsx`
- `components/home/section-shell.tsx` — 공통 껍데기

## section-shell 규약

원본의 모든 섹션이 같은 껍데기를 반복합니다.

```html
<section style="border-top: 1px solid var(--hairline); background: var(--white);">
  <div style="max-width: 1180px; margin: 0 auto; padding: 56px 28px;">
```

이 값들이 섹션마다 흩어지면 하나를 고칠 때 나머지를 놓치므로 추출했습니다.

```tsx
<SectionShell bordered surface="page" labelledBy="about-title">
  …
</SectionShell>
```

| prop | 기본값 | 의미 |
|---|---|---|
| `labelledBy` | — | `aria-labelledby`로 연결할 제목의 `id` |
| `bordered` | `false` | 상단 1px `border-hairline` |
| `surface` | `"soft"` | `"page"` = 흰 배경, `"soft"` = 페이지 배경(surface-soft) 노출 |
| `className` | — | 추가 클래스 |

내부 컨테이너는 고정입니다: `mx-auto max-w-marketing px-5 py-14 sm:px-7`
(1180px / 세로 56px / 좌우 20px·28px)

### 이후 섹션의 사용 조합

원본 각 섹션의 배경·구분선을 그대로 옮긴 결과입니다.

| 섹션 | `bordered` | `surface` |
|---|---|---|
| WHY & HOW (#4) | ✅ | `page` |
| 배너 (#5) | — | `page` |
| GET THE APP (#6) | ✅ | `page` |
| FAQ (#7) | ✅ | `soft` |

## 결정 기록

### "WHY & HOW"를 heading으로 만들지 않음

원본은 `<span>`입니다. 시각적으로는 제목처럼 보이지만 실제 제목은 "SMOKE HERE"
하나이고, 라벨까지 heading으로 올리면 스크린리더에서 제목이 두 겹으로 읽힙니다.
`aria-labelledby`는 h2에만 연결했습니다.

### 두 번째 문단에 `font-semibold`를 쓰지 않음

원본은 `font-weight: 600` + ink입니다. 로컬 `text-title-md`가 정확히 16px/600이라
그 토큰을 그대로 씁니다. 디자인 가이드가 "타이포 토큰에 `font-*`를 덧붙이지
말라"고 한 이유가 이런 경우입니다 — 굵기는 토큰 안에 있어야 합니다.

## 원본과 의도적으로 다른 부분

| 항목 | 원본 | 구현 | 이유 |
|---|---|---|---|
| 첫 문단 개행 | `<br>` 강제 개행 | **`<br>` 유지** | "흡연자에게는 … / 비흡연자에게는 …"는 대구입니다. 개행이 그 대구를 만듭니다 — 경위는 `banner.md`의 "개행을 되돌린 이유" |
| 섹션 제목 크기 | 34px / 800 | `text-section` (34 / 800) | 동일 |
| 본문 | 15.5px / 1.8 | `text-body-md` (16 / 1.5) | 매핑표의 반올림 규칙 |
| 그리드 전환점 | 1000px | `lg` (1024px) | Tailwind 기본 브레이크포인트 |

원본에는 이 섹션에 빈 `<p>` 두 개가 남아 있습니다(주석 없이 공백만). 옮기지
않았습니다.

## 남은 과제

- **브라우저 육안 확인 미실행** (#11)
- `SectionShell`의 `surface="soft"`는 페이지 배경이 `surface-soft`라는 전제에
  의존합니다. #10에서 페이지 배경을 실제로 그렇게 설정해야 합니다.
