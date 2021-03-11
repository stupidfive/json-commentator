import parse from 'json-to-ast';

export function getOne() {
  return 1
}

export function comment(json) {
  const settings = {
    loc: false,
  }

  console.log(JSON.stringify(parse(json, settings)));

  const ast = parse(json, settings)

  let pretty = ''
  pretty += "{"
  for (const child of ast.children) {
    pretty += '\n  ' + child.key.raw + ': ' + child.value.raw
  }
  if (ast.children.length !== 0) {
    pretty += "\n"
  }
  pretty += '}'

  return pretty
}
