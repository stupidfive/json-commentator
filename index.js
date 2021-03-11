import parse from 'json-to-ast';

export function comment(json) {
  const settings = {
    loc: false,
  }
  const ast = parse(json, settings)
  let indentLevel = 0
  return _prettify(ast, indentLevel)
}

function _prettify(ast, indentLevel, path = []) {
  if (ast.type === 'Literal') {
    return ast.raw
  } else if (ast.type === 'Array') {
    return _prettifyArray(ast, indentLevel, path)
  } else if (ast.type === 'Object') {
    return _prettyObject(ast, indentLevel, path)
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

function _prettifyArray(ast, indentLevel, path) {
  let pretty = "["
  indentLevel++
  for (let i = 0; i < ast.children.length; i++) {
    const child = ast.children[i]
    pretty += '\n' + _spaces(indentLevel)
    let currentPath = [...path, i];
    pretty += _prettify(child, indentLevel, currentPath)

    const isLast = i === ast.children.length - 1
    if (!isLast) {
      pretty += ','
    }
    // TODO: add comment
    pretty += ' // ' + currentPath.join('.')
  }
  if (ast.children.length !== 0) {
    pretty += "\n"
  }
  indentLevel--
  pretty += _spaces(indentLevel) + ']'
  return pretty
}

function _prettyObject(ast, indentLevel, path) {
  let pretty = '{'
  indentLevel++
  for (let i = 0; i < ast.children.length; i++) {
    const child = ast.children[i]
    pretty += '\n' + _spaces(indentLevel) + child.key.raw + ': '
    let currentPath = [...path, child.key.value];
    pretty += _prettify(child.value, indentLevel, currentPath)

    const isLast = i === ast.children.length - 1
    if (!isLast) {
      pretty += ','
    }
    // TODO: add comment
    pretty += ' // ' + currentPath.join('.')
  }
  if (ast.children.length !== 0) {
    pretty += "\n"
  }
  indentLevel--
  pretty += _spaces(indentLevel) + '}'
  return pretty
}
