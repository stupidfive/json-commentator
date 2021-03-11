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
  for (let i = 0; i < ast.children.length; i++) {
    const child = ast.children[i]
    pretty += '\n  ' + child.key.raw + ': ' + child.value.raw

    const isLast = i === ast.children.length - 1
    if (!isLast) {
      pretty += ','
    }
  }
  if (ast.children.length !== 0) {
    pretty += "\n"
  }
  pretty += '}'

  return pretty
}
