import {
  s_block_comment,
  s_line_comment,
  s_macro,
  s_spaces,
  s_number
} from './slices.js'

export default (code) => {
  const re_digits = /\d/
  const re_spaces = /\s/

  const slices = []

  let at = 0
  while (at < code.length) {

    // line comment
    if (
      code[at] === '/'
      && code[at + 1] === '/'
    ) {
      const end = code.indexOf('\n', at + 2)
      if (~end) {
        slices.push(s_line_comment(at, end))
        at = end
      } else {
        slices.push(s_line_comment(at, code.length))
        at = code.length
      }
      continue
    }

    // block comment
    if (
      code[at] === '/'
      && code[at + 1] === '*'
    ) {
      const end = code.indexOf('*/', at + 2)
      if (~end) {
        slices.push(s_block_comment(at, end + 2))
        at = end + 2
      } else {
        throw `unclosed block comment, opened at ${at}`
      }
      continue
    }

    // macro
    if (code[at] === '#') {
      const end = code.indexOf('\n', at)
      if (~end) {
        slices.push(s_macro(at, end))
        at = end
      } else {
        slices.push(s_macro(at, code.length))
        at = code.length
      }
      continue
    }

    // spaces
    if (re_spaces.test(code[at])) {
      let end = at + 1
      while (
        end < code.length
        && re_spaces.test(code[end])
      ) {
        end += 1
      }
      slices.push(s_spaces(at, end))
      at = end
      continue
    }

    // number
    if (
      re_digits.test(code[at])
      || (
        code[at] === '.'
        && re_digits.test(code[at + 1])
      )
    ) {
      let dot = code[at] === '.'
      let exp = false
      let chars = [code[at]]
      let end = at + 1
      while (end < code.length) {
        const ch = code[end]
        // dot
        if (ch === '.') {
          if (dot) {
            break
          } else {
            chars.push(ch)
            dot = true
            end += 1
            continue
          }
        }
        // digit
        if (re_digits.test(ch)) {
          chars.push(ch)
          end += 1
          continue
        }
        // exp
        if ('eE'.includes(ch)) {
          if (exp) {
            break
          } else {
            exp = true
            chars.push(ch)
            end += 1
            // [sign]digit
            let sign = false
            while (end < code.length) {
              const ch = code[end]
              // sign
              if ('+-'.includes(ch)) {
                if (sign) {
                  break
                } else {
                  chars.push(ch)
                  sign = true
                  end += 1
                  continue
                }
              }
              // digit
              if (re_digits.test(ch)) {
                chars.push(ch)
                end += 1
                continue
              }
              // other
              break
            }
            continue
          }
        }
        // other
        break
      }
      slices.push(s_number(at, end))
      at = end
      continue
    }

    // other (not comment, not macro, not spaces, not number)
    at += 1
  }

  return slices
}