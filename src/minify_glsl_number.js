export default (literal) => {

  // int oct
  if (
    literal[0] === '0'
    && literal[1] !== '.'
  ) {
    return literal
  }

  // int hex
  if (literal.startsWith('0x')) {
    return literal
  }

  const i_dot = literal.indexOf('.')
  const i_exp = literal.indexOf('e')
  const chars = []

  // float
  if (~i_dot) {
    const int_part = literal.substring(0, i_dot)
    const fr_part = ~i_exp
      ? literal.substring(i_dot + 1, i_exp)
      : literal.substring(i_dot + 1)

    if (int_part.length === 0) { // .thing
      chars.push('.', fr_part)
    } else {
      if (int_part === '0') { // 0.thing
        if (
          fr_part.length === 0 // thing is empty
          || is_all_zeros(fr_part) // thing is all zeros
        ) {
          chars.push('0.')
        } else {
          chars.push('.', fr_part)
        }
      } else { // i.thing
        if (
          fr_part.length === 0 // thing is empty
          || is_all_zeros(fr_part) // thing is all zeros
        ) {
          chars.push(int_part, '.')
        } else { // i.thing
          chars.push(int_part, '.', fr_part)
        }
      }
    }
  } else { // int - dec
    const int_part = ~i_exp
      ? literal.substring(0, i_exp)
      : literal
    chars.push(int_part)
  }

  // scientific notation part
  if (~i_exp) {
    chars.push('e')
    const exp_part = literal.substring(i_exp + 1)
    if (exp_part[0] === '+') {
      chars.push(exp_part.slice(1)) // eat plus sign
    } else {
      chars.push(exp_part)
    }
  }

  return chars.join('')
}



function is_all_zeros(str) {
  return Array.from(str).every(ch => ch === '0')
}