import parse from 'json-to-ast';

export function comment(json) {
  const settings = {
    loc: false,
  }
  const ast = parse(json, settings)
  let indentLevel = 0
  return _prettify(ast, indentLevel)
}

function _prettify(ast, indentLevel) {
  if (ast.type === 'Literal') {
    return ast.raw
  } else if (ast.type === 'Array') {
    return _prettifyArray(ast, indentLevel)
  } else if (ast.type === 'Object') {
    return _prettyObject(ast, indentLevel)
  }
  throw new Error(`Unrecognized type ${ast.type}`)
}

function _spaces(indentLevel) {
  let spaces = ''
  for (let i = 0; i < indentLevel; i++) {
    spaces += '  '
  }
  return spaces
}

function _prettifyArray(ast, indentLevel) {
  let pretty = "["
  indentLevel++
  for (let i = 0; i < ast.children.length; i++) {
    const child = ast.children[i]
    pretty += '\n' + _spaces(indentLevel)
    pretty += _prettify(child, indentLevel)

    const isLast = i === ast.children.length - 1
    if (!isLast) {
      pretty += ','
    }
  }
  if (ast.children.length !== 0) {
    pretty += "\n"
  }
  indentLevel--
  pretty += _spaces(indentLevel) + ']'
  return pretty
}

function _prettyObject(ast, indentLevel) {
  let pretty = "{"
  indentLevel++
  for (let i = 0; i < ast.children.length; i++) {
    const child = ast.children[i]
    pretty += '\n' + _spaces(indentLevel) + child.key.raw + ': '
    pretty += _prettify(child.value, indentLevel)

    const isLast = i === ast.children.length - 1
    if (!isLast) {
      pretty += ','
    }
  }
  if (ast.children.length !== 0) {
    pretty += "\n"
  }
  indentLevel--
  pretty += _spaces(indentLevel) + '}'
  return pretty
}
