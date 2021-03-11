import parse from 'json-to-ast';

export function comment(json) {
  const settings = {
    loc: false,
  }

  const ast = parse(json, settings)
  let indentLevel = 0

  return prettifyObject(ast, indentLevel)
}

function prettifyObject(ast, indentLevel) {
  let pretty = "{"
  indentLevel++
  for (let i = 0; i < ast.children.length; i++) {
    const child = ast.children[i]
    pretty += '\n' + _spaces(indentLevel) + child.key.raw + ': '

    if (child.value.type === 'Literal') {
      pretty += child.value.raw
    } else if (child.value.type === 'Object') {
      pretty += prettifyObject(child.value, indentLevel)
    }

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

function _spaces(indentLevel) {
  let spaces = ''
  for (let i = 0; i < indentLevel; i++) {
    spaces += '  '
  }
  return spaces
}
