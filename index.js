import parse from 'json-to-ast';

export function comment(json, rule) {
  const settings = {
    loc: false,
  }
  const ast = parse(json, settings)
  let indentLevel = 0
  return _prettify(ast, indentLevel, [], rule)
}

function _prettify(ast, indentLevel, path = [], rule) {
  if (ast.type === 'Literal') {
    // TODO: add comment
    return ast.raw
  } else if (ast.type === 'Array') {
    return _prettifyArray(ast, indentLevel, path, rule)
  } else if (ast.type === 'Object') {
    return _prettyObject(ast, indentLevel, path, rule)
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

function _prettifyArray(ast, indentLevel, path, rule) {
  let pretty = "["

  const comment = rule(path, ast.value)
  if (comment != null) {
    pretty += ' // ' + comment
  }

  indentLevel++
  for (let i = 0; i < ast.children.length; i++) {
    const child = ast.children[i]
    pretty += '\n' + _spaces(indentLevel)
    let currentPath = [...path, i];
    pretty += _prettify(child, indentLevel, currentPath, rule)

    const isLast = i === ast.children.length - 1
    if (!isLast) {
      pretty += ','
    }

    // TODO: extract comment
    if (rule != null) {
      let comment = rule(currentPath, child.value);
      if (comment != null) {
        if (child.type === 'Literal') {
          pretty += ' // ' + comment
        }
      }
    }
  }
  if (ast.children.length !== 0) {
    pretty += "\n"
  }
  indentLevel--
  pretty += _spaces(indentLevel) + ']'
  return pretty
}

function _prettyObject(ast, indentLevel, path, rule) {
  let pretty = '{'

  const comment = rule(path, ast.value)
  if (comment != null) {
    pretty += ' // ' + comment
  }

  indentLevel++
  for (let i = 0; i < ast.children.length; i++) {
    const child = ast.children[i]
    pretty += '\n' + _spaces(indentLevel) + child.key.raw + ': '
    let currentPath = [...path, child.key.value];
    pretty += _prettify(child.value, indentLevel, currentPath, rule)

    const isLast = i === ast.children.length - 1
    if (!isLast) {
      pretty += ','
    }

    // TODO: add comment
    if (rule != null) {
      const comment = rule(currentPath, child.value)
      if (comment != null) {
        if (child.type === 'Literal' || child.type === 'Property') {
          pretty += ' // ' + comment
        }
      }
    }
  }
  if (ast.children.length !== 0) {
    pretty += "\n"
  }
  indentLevel--
  pretty += _spaces(indentLevel) + '}'
  return pretty
}
