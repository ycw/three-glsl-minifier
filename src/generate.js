import minify_glsl_macro from './minify_glsl_macro.js'
import minify_glsl_number from './minify_glsl_number.js'

export default (slices, code) => {
  const chars = []

  let offset = 0
  for (const [i, slice] of slices.entries()) {
    chars.push(code.substring(offset, slice.start))
    offset = slice.end

    if (slice.type === 'line_comment') {
      chars.push('\n')
      continue
    }

    if (slice.type === 'block_comment') {
      continue
    }

    if (slice.type === 'macro') {
      if (is_macro_at_head(slice, code)) {
        chars.push('\n')
      }
      chars.push(
        minify_glsl_macro(
          code.substring(slice.start, slice.end)
        )
      )
      continue
    }

    if (slice.type === 'number') {
      chars.push(
        minify_glsl_number(
          code.substring(slice.start, slice.end)
        )
      )
      continue
    }

    const prev = slices[i - 1]
    const next = slices[i + 1]
    const seps = '[]()+-~!*/%<>=&^|;,{}'

    if (slice.type === 'spaces') {

      if (slice.start === 0) {
        continue
      }

      if (
        next?.type === 'macro'
        && next?.start === slice.end
      ) {
        continue
      }

      if (
        prev?.type === 'macro'
        && prev?.end === slice.start
        && is_macro_has_directive(prev, code)
      ) {
        chars.push('\n')
        continue
      }

      if (slice.end === code.length) {
        continue
      }

      if (seps.includes(code[slice.start - 1])) {
        continue
      }

      if (seps.includes(code[slice.end])) {
        continue
      }

      chars.push(' ')
      continue
    }
  }

  chars.push(code.substring(offset))

  return chars.join('')
}



function is_macro_has_directive(slice, code) {
  return code.substring(slice.start, slice.end).trim().length > 1
}

function is_macro_at_head(slice, code) {
  return code.substring(0, slice.start).trim().length > 0
}