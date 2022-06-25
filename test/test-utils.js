import minify from '../src/index.js'

const okays = []
const fails = []
const tests = []

// Add a test
export const test = (title, code, expected) =>
  tests.push({ title, code, expected })

// Add a test, marked as 'only' 
export const onlytest = (title, code, expected) =>
  tests.push({ title, code, expected, only: true })

// Run tests
export const run = () => {

  const only_mode = tests.some(t => t.only)

  const filtered_tests = only_mode
    ? tests.filter(t => t.only)
    : tests

  for (const { title, code, expected } of filtered_tests) {
    const actual = minify(code)
    if (actual === expected) {
      okays.push({ title })
    } else {
      fails.push({ title, code, expected, actual })
    }
  }

  console.log('Passed', okays.length)

  console.group('Failed', fails.length)
  if (fails.length !== 0) {
    for(const [i, fail] of fails.entries()) {
      console.log(i + 1, '|', fmt_fail(fail))
    }
  }
  console.groupEnd()
}



function raw(str) {
  return str
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')
}


function fmt_fail(fail) {
  const { title, code, expected, actual } = fail
  return [
    `"${title}"`,
    '',
    '[code]',
    code,
    '',
    '[expected]',
    raw(expected),
    '',
    '[actual]',
    raw(actual),
    ''
  ].join('\n')
}