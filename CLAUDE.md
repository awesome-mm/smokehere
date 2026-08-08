@AGENTS.md

# Claude Code 작업 규칙

위 `AGENTS.md`의 **강제 규칙 3가지**가 이 문서보다 우선합니다.

## 📚 개발 가이드

필요할 때 **직접 읽으세요.** 자동으로 로드되지 않습니다.

- 🎨 **디자인 시스템**: `docs/design-guide.md` — 색상·타이포·라운딩 토큰, 접근성
  체크리스트. **UI를 만지기 전에 반드시**
- ✅ **작업 완료 체크리스트**: `docs/guides/completion-checklist.md` — 린트·타입·
  테스트·빌드·브라우저 육안 확인 순서. **완료를 보고하기 전에 반드시**
- 🤖 **서브에이전트 위임**: `docs/guides/agent-delegation.md` — 어떤 작업을 누구에게,
  issue-reporter 루프 금지 규칙
- ⚠️ **이미 겪은 함정**: `docs/issue/README.md` — 라이브러리·설정 충돌 기록과 판단 근거
- 📋 **요구사항**: `docs/prd/` — MVP 범위와 기능 명세
- 🧩 **shadcn 설정**: `components.json` (style은 `radix-nova`)
- ⚡ **Next.js 16 공식 문서**: `node_modules/next/dist/docs/`

## 작업 흐름

1. 관련 파일을 **먼저 읽습니다.** 구조를 추측하지 마세요.
2. UI 작업이면 `docs/design-guide.md`를 확인합니다.
3. 위임할 영역인지 판단합니다 → `docs/guides/agent-delegation.md`
4. 구현합니다.
5. **완료 체크리스트를 실행합니다** → `docs/guides/completion-checklist.md`
   ```bash
   npm run lint && npx tsc --noEmit && npm test && npm run build
   ```
   UI를 바꿨다면 Chrome으로 **실제 화면까지** 확인하세요
   (`claude-in-chrome` 스킬 → `npm run dev` 백그라운드 → `/showcase`).
6. 실패한 항목은 **무엇이 왜 실패했는지 그대로** 보고합니다.
   실행하지 않은 것을 통과했다고 쓰지 마세요.
7. 이슈를 발견했다면 `issue-reporter`에게 기록을 위임합니다.

## 스킬

- **커밋**: `commit` — 린트 → 스테이지 확인 → 관심사 분할 제안 → 컨벤셔널 커밋
- **PRD 작성·갱신**: `prd-writer`
- **라이브러리 문서**: Context7 (`resolve-library-id` → `query-docs`)
- **브라우저 조작**: `claude-in-chrome` (브라우저 도구 사용 전 먼저 호출)

## 임시 파일

조사용 스크립트나 probe 파일은 **작업이 끝나기 전에 지우세요.**
