import minify_glsl from './minify_glsl.js'

export default (code) => {
  const m = code.match(/^#[ \t]*(?<dir>[^ \t]+)[ \t]*(?<args>.*)/)
  if (m === null) { // macro w/o directive at all
    return ''
  }
  const { dir, args } = m.groups
  if (dir === 'define') {
    const i_space = args.indexOf(' ')
    const i_lbrace = args.indexOf('(')
    if (i_space === -1) {
      if (i_lbrace === -1) { // #define ident
        return `#${dir} ${args}`
      } else { // #define ident(..)
        return `#${dir} ${minify_glsl(args)}`
      }
    } else {
      if (i_lbrace === -1) { // #define ident thing
        const ident = args.substring(0, i_space)
        const thing = args.substring(i_space)
        return `#${dir} ${ident} ${minify_glsl(thing)}`
      } else {
        if (i_space < i_lbrace) { // #define ident (thing...
          const ident = args.substring(0, i_space)
          const thing = args.substring(i_lbrace)
          return `#${dir} ${ident} ${minify_glsl(thing)}`
        } else { // #define ident(... thing
          const i_rbrace = args.indexOf(')', i_lbrace)
          const ident = args.substring(0, i_rbrace + 1)
          const thing = args.substring(i_rbrace + 2)
          return `#${dir} ${minify_glsl(ident)} ${minify_glsl(thing)}`
        }
      }
    }
  }

  if (args.length === 0) {
    return `#${dir}`
  }

  if (
    args.startsWith('//')
    || args.startsWith('/*')
  ) {
    return `#${dir}`
  }

  return `#${dir} ${minify_glsl(args)}`
}