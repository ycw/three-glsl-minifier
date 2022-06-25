import { test, run, onlytest } from './test-utils.js'

// ---
// line comment
// ---

test('line comment',
  '//comment',
  ''
)

test('line comment: eof',
  'a;//comment',
  'a;'
)

test('line comment: btwn stmts',
  [
    'a;//comment',
    'b;'
  ].join('\n'),
  'a;b;'
)

test('line comment: before macro',
  [
    'a;//comment',
    '#define b'
  ].join('\n'),
  [
    'a;',
    '#define b'
  ].join('\n')
)

test('line comment: in macro',
  '#endif //comment',
  '#endif'
)

// ---
// block comment
// ---

test('block comment',
  '/*comment*/',
  ''
)

test('block comment: middle',
  '[a,/*comment*/b/*comment*/]',
  '[a,b]'
)

test('block comment: in macro',
  '#endif /*comment*/',
  '#endif'
)

// ---
// macro
// ---

test('macro: #(no directive)',
  [
    'a;',
    '#  ',
    'b;'
  ].join('\n'),
  'a;b;'
)

test('macro: #define',
  '#  define  f( x ) g( x )',
  '#define f(x) g(x)'
)

test('macro: #include',
  '#   include   <   chunk  >',
  '#include <chunk>',
)

test('macro: keep newline',
  '#if defined(a)\nb;',
  '#if defined(a)\nb;'
)

// ---
// number
// ---

test('float: in range [0, 1)',
  '0.5',
  '.5'
)

test('float: 0.0 is 0.',
  '0.0',
  '0.'
)

test('float: 1.0 is 1.',
  '1.0',
  '1.'
)

test('float: whole number',
  '13.000',
  '13.'
)

test('float: e plus',
  '1.0e+6',
  '1.e6'
)

test('int: e plus',
  '1e+6',
  '1e6'
)

test('float: spacing',
  'vec4( a, 1.0 )',
  'vec4(a,1.)'
)

// ---
// mix
// ---

test('mix: #define spacing comments number',
  '# define f( a ) /*comment*/g( a, 0.0, 1.0e+3, 1e+6) //comment',
  '#define f(a) g(a,0.,1.e3,1e6)'
)

// ---
// run
// ---

run()