const path = require('path')
const fs = require('fs')

const BASE_DIR_NAME = 'src'
const UTILS_DIR_NAME = 'utils'
const TESTS_DIR_NAME = '__tests__'

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'utils 함수 테스트 파일 작성 여부 확인 규칙',
    },
    schema: [],
  },
  create(context) {
    const filePath = context.filename
    const fileDirPath = path.dirname(filePath)
    const baseDir = path.resolve(BASE_DIR_NAME)
    const utilsFromBasePath = path.relative(baseDir, fileDirPath) // src 부터 file 까지 path 를 대상으로 탐색

    if (utilsFromBasePath.includes(UTILS_DIR_NAME)) {
      const utilsFileName = path.basename(filePath)
      const utilsParentDir = path.resolve(fileDirPath, '../')

      const testsDir = path.join(utilsParentDir, TESTS_DIR_NAME)

      // utils 디렉토리와 매칭되는 __tests__ 디렉토리 유무 확인
      if (!fs.existsSync(testsDir) || !fs.lstatSync(testsDir).isDirectory()) {
        context.report({
          message: `No ${TESTS_DIR_NAME} directory in ${utilsParentDir}`,
          loc: { line: 1, column: 0 },
        })
        return {}
      }

      const testFileNamePattern = new RegExp(
        `^${utilsFileName.replace(/\.js$/, '')}\.test\.(js|ts)$`,
      )
      const testFiles = fs
        .readdirSync(testsDir)
        .filter((file) => testFileNamePattern.test(file))

      // __tests__ 디렉토리 내 utils 파일과 매칭되는 테스트 파일 유무 확인
      if (testFiles.length === 0) {
        context.report({
          message: `No corresponding test file found in ${testsDir} for ${utilsFileName}`,
          loc: { line: 1, column: 0 },
        })
        return {}
      }

      // 테스트 파일 내 util 함수 테스트 코드 작성 여부 확인
      // - describe("함수명") 체크
      const testFilePath = path.join(testsDir, testFiles[0])
      const testFileContent = fs.readFileSync(testFilePath, 'utf-8')

      // describe 에 작성된 함수명 추출
      const getDescribeArguments = (content) => {
        const describeRegex = /describe\(\s*["']([^\s"']+)["']/g
        const matches = []
        let match
        while ((match = describeRegex.exec(content)) !== null) {
          matches.push(match[1])
        }
        return matches
      }

      const describedFunctions = getDescribeArguments(testFileContent)

      const checkUtilsFunctionTestExist = (functionName, node) => {
        if (!describedFunctions.includes(functionName)) {
          context.report({
            node,
            message: `Function ${functionName} test is missing in "${utilsFileName}" test file`,
          })
        }
      }

      return {
        FunctionDeclaration: (node) => {
          const functionName = node.id.name
          checkUtilsFunctionTestExist(functionName, node)
        },
        ArrowFunctionExpression: (node) => {
          const functionName = context.sourceCode.getText(node.parent.id)
          checkUtilsFunctionTestExist(functionName, node)
        },
      }
    }

    return {}
  },
}
