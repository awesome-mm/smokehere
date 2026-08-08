# @vitejs/plugin-react 설치가 @babel/core 7↔8 peer 충돌로 실패

| 항목 | 내용 |
|---|---|
| 위험도 | **4 / 10** |
| 분류 | 라이브러리 충돌 (peer dependency) |
| 발견일 | 2026-08-08 |
| 상태 | 해결됨 (의존성 제거 방식) |
| 관련 파일 | `package.json`, `vitest.config.mts` |

위험도 근거: 설치 단계에서 즉시 실패하고 원인이 로그에 그대로 드러납니다(기준 3~4).
빌드된 결과물이 조용히 잘못되는 종류가 아니라 발견이 쉽습니다. 다만 `--force`로
넘기면 나중에 원인 불명의 런타임 오류로 번질 수 있어 4로 매겼습니다.

## 1. 이슈 내용

### 증상

vitest 테스트 환경을 구성하려고 표준 조합을 설치하는 중 `npm install`이 실패했습니다.

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react \
  @testing-library/user-event @testing-library/jest-dom vite-tsconfig-paths
```

### 실제 에러 메시지

```
npm error While resolving: smokehere@0.1.0
npm error Found: @babel/core@7.29.7
npm error node_modules/@babel/core
npm error   peer @babel/core@"^7.0.0" from @babel/helper-create-class-features-plugin@7.29.7
npm error   node_modules/@babel/helper-create-class-features-plugin
npm error     @babel/helper-create-class-features-plugin@"^7.29.7" from @babel/plugin-transform-typescript@7.29.7
npm error     node_modules/@babel/plugin-transform-typescript
npm error       @babel/plugin-transform-typescript@"^7.29.7" from @babel/preset-typescript@7.29.7

npm error Could not resolve dependency:
npm error dev @vitejs/plugin-react@"*" from the root project

npm error Conflicting peer dependency: @babel/core@8.0.1
npm error node_modules/@babel/core
npm error   peer @babel/core@"^8.0.0" from @babel/plugin-transform-runtime@8.0.1
npm error   node_modules/@babel/plugin-transform-runtime
npm error     peerOptional @babel/plugin-transform-runtime@"^7.29.0 || ^8.0.0-rc.1" from @rolldown/plugin-babel@0.2.3
npm error     node_modules/@rolldown/plugin-babel
npm error       peerOptional @rolldown/plugin-babel@"^0.1.7 || ^0.2.0" from @vitejs/plugin-react@6.0.5
```

### 근본 원인

의존성 사슬이 서로 다른 Babel 메이저를 요구합니다.

```
Next.js 16.3.0 계열
  └─ @babel/preset-typescript@7.29.7
       └─ @babel/core@7.29.7          ← 트리에 이미 고정된 버전

@vitejs/plugin-react@6.0.5
  └─ @rolldown/plugin-babel@0.2.3      (peerOptional)
       └─ @babel/plugin-transform-runtime@8.0.1
            └─ @babel/core@^8.0.0      ← 충돌
```

`@vitejs/plugin-react` 6은 내부 번들러가 rolldown으로 넘어가면서 Babel 8 계열
플러그인을 끌어옵니다. 반면 이 프로젝트 트리에는 Next.js 경유로 `@babel/core@7`이
이미 자리잡고 있어 npm이 해소할 수 없는 상태가 됩니다.

## 2. 대응

**`@vitejs/plugin-react`를 설치하지 않기로 했습니다.** 충돌을 우회한 것이 아니라
그 의존성이 애초에 필요 없다고 판단했습니다.

- Vitest는 **esbuild로 JSX를 변환**할 수 있고, `tsconfig.json`의
  `"jsx": "react-jsx"`(automatic runtime)를 그대로 따릅니다. React 컴포넌트를
  렌더링하는 데 Babel 플러그인이 필요하지 않습니다.
- 이 플러그인의 주요 가치인 **Fast Refresh는 테스트 환경에서 의미가 없습니다.**

같은 판단으로 `vite-tsconfig-paths`도 뺐습니다. 경로 별칭은 설정 한 줄로 충분합니다.

### 최종 설치 목록

```bash
npm install -D vitest jsdom @testing-library/react \
  @testing-library/user-event @testing-library/jest-dom
# added 88 packages, found 0 vulnerabilities
```

### 설정 (`vitest.config.mts`)

```ts
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    globals: false,
  },
})
```

### 택하지 않은 대안

| 대안 | 기각 이유 |
|---|---|
| `npm install --force` | npm이 직접 "potentially broken"이라 경고하는 방식입니다. Babel 7과 8이 한 트리에 섞이면 나중에 원인 추적이 어려운 런타임 오류로 나타납니다 |
| `--legacy-peer-deps` | 위와 같은 위험에 더해, 이후 모든 설치에 같은 플래그를 계속 붙여야 합니다 |
| `@vitejs/plugin-react-swc`로 교체 | 충돌은 피하지만 여전히 불필요한 의존성입니다. 테스트에 Fast Refresh가 필요 없습니다 |
| `overrides`로 `@babel/core` 고정 | Next.js의 빌드 툴체인이 쓰는 버전을 강제로 바꾸는 것이라 위험이 훨씬 큽니다 |

### 검증

```
npx vitest run
 Test Files  4 passed (4)
      Tests  57 passed (57)
```

React 19 컴포넌트 57개 테스트가 Babel 없이 정상 렌더링·상호작용했습니다.
`npm run build`도 통과해 Next.js 빌드에 영향이 없음을 확인했습니다.

### 부수 이슈 — 설정 파일 확장자

첫 설정 파일을 `vitest.config.ts`로 만들자 다음 경고가 나왔습니다.

```
(!) Your Vite config uses features that are unsupported by `configLoader: 'native'`:
  - ESM syntax in a file loaded as CommonJS (vitest.config.ts:1:1).
    Use a `.mjs` extension or set `"type": "module"` in the closest package.json
```

`package.json`에 `"type": "module"`을 넣으면 Next.js 설정 파일들에 영향이 가므로,
**`vitest.config.mts`로 확장자만 바꿔** 해결했습니다. `tsconfig.json`의 `include`에
이미 `**/*.mts`가 있어 타입 검사 범위에서 빠지지 않습니다.

## 3. 해결 방안 및 더 나은 방법

**근본 해결입니다.** 충돌을 억지로 넘긴 것이 아니라 충돌의 원인이 된 의존성 자체를
제거했고, 그 결과 devDependency가 2개 줄었습니다.

### 감수한 것

- **JSX 변환기가 esbuild로 고정**됩니다. Babel 플러그인이 필요한 상황
  (예: `babel-plugin-styled-components` 같은 컴파일 타임 변환)이 생기면 재검토해야
  합니다. 현재 이 프로젝트 스택(Tailwind + CVA)에는 해당 사항이 없습니다.
- 테스트 환경과 Next.js 빌드가 **서로 다른 변환기**를 씁니다(esbuild vs Turbopack/SWC).
  이론적으로 변환 결과가 갈릴 수 있으나, JSX automatic runtime 수준에서는 차이가
  드러나지 않습니다. 실제로 57개 테스트가 통과해 실용적 문제가 없음을 확인했습니다.

### 다시 볼 지점

- **Next.js가 `@babel/core@8`로 올라가면** `@vitejs/plugin-react`를 다시 검토할 수
  있습니다. 다만 그때도 "테스트에 이 플러그인이 필요한가"를 먼저 물어야 합니다.
- Vitest가 브라우저 모드로 전환하는 등 실행 방식이 바뀌면 설정을 재검토하세요.

## 4. 남은 위험

- **esbuild와 SWC의 변환 차이를 전수 검증하지는 않았습니다.** 현재 테스트 범위
  (UI 컴포넌트 4종)에서는 문제가 없었으나, 데코레이터나 특수한 TypeScript 문법을
  쓰는 코드가 추가되면 테스트 환경에서만 다르게 동작할 가능성이 남아 있습니다.
