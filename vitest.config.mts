import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

/*
 * Vitest 설정
 *
 * @vitejs/plugin-react를 쓰지 않습니다. 이 플러그인이 끌어오는
 * @babel/plugin-transform-runtime@8이 @babel/core@^8을 요구하는데,
 * Next.js 경유로 트리에 이미 @babel/core@7이 있어 peer 충돌이 납니다.
 * Vitest는 esbuild로 JSX를 변환할 수 있고 tsconfig의 jsx: "react-jsx"
 * (automatic runtime)를 그대로 따르므로 Babel이 필요하지 않습니다.
 * Fast Refresh는 테스트 환경에서 의미가 없습니다.
 */
export default defineConfig({
  resolve: {
    // tsconfig의 paths(@/* -> ./*)와 동일하게 맞춥니다
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**"],
    // globals를 켜지 않고 각 테스트에서 명시적으로 import합니다.
    // tsconfig에 "vitest/globals" 타입을 추가하지 않아도 되고, 어디서 온
    // 헬퍼인지 파일만 보고 알 수 있습니다.
    globals: false,
  },
})
