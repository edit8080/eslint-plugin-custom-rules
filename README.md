# eslint-plugin-custom-rules

커스텀 eslint plugin 을 구성하기 위한 프로젝트입니다

## custom rules

### require-tests-for-utils

- utils 경로 내 util 함수 파일과 대응되는 테스트 파일이 존재하는지 확인합니다.
- util 함수 파일 내 존재하는 유틸 함수에 대한 테스트 코드 블록이 존재하는지 확인합니다.
  - `describe("함수명")` 확인

```
src
  ├── __tests__
  │      └── util.test.js
  └── utils
         └── util.js
```

```js
// utils.js
const util = () => {}
function util2 = () => {}

// utils.test.js
describe("util", () => {})
describe("util2", () => {})
```
