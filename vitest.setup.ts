import "@testing-library/jest-dom/vitest"

import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

// globals: false라 RTL의 자동 cleanup이 걸리지 않습니다.
// 직접 등록하지 않으면 이전 테스트의 DOM이 남아 쿼리가 중복 매칭됩니다.
afterEach(() => {
  cleanup()
})
