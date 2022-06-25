import parse from './parse.js'
import generate from './generate.js'

export default (glsl) => {
  // rpl comments w/ wsps
  const pass0 = generate(parse(glsl), glsl)
  // trims wsps in a row
  const pass1 = generate(parse(pass0), pass0)
  return pass1
}