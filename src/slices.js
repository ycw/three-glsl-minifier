export function s_block_comment(start, end) {
  return { type: 'block_comment', start, end }
}

export function s_line_comment(start, end) {
  return { type: 'line_comment', start, end }
}

export function s_macro(start, end) {
  return { type: 'macro', start, end }
}

export function s_spaces(start, end) {
  return { type: 'spaces', start, end }
}

export function s_number(start, end) {
  return { type: 'number', start, end }
}
