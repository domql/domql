'use strict'

export const stringIncludesAny = (str, characters) => {
  for (const char of characters) {
    if (str.includes(char)) {
      return true
    }
  }
  return false
}

export const trimStringFromSymbols = (str, characters) => {
  // Create a regular expression pattern to match the specified symbols
  const pattern = new RegExp(`[${characters.join('\\')}]`, 'g')

  // Replace matched symbols with an empty string
  return str.replace(pattern, '')
}

/**
 * Replaces placeholders in a string with corresponding {{ }} values from an object.
 *
 * @param {string} str - The string containing placeholders to replace.
 * @param {object} state - The object containing the values to substitute.
 * @returns {string} The modified string with placeholders replaced by values from the object.
 */
const brackRegex = {
  2: /{{\s*((?:\.\.\/)*)([\w\d.]+)\s*}}/g,
  3: /{{{(\s*(?:\.\.\/)*)([\w\d.]+)\s*}}}/g
}

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => {
    return acc && acc[part] !== undefined ? acc[part] : undefined
  }, obj)
}

export function replaceLiteralsWithObjectFields (str, state = {}, options = {}) {
  const { bracketsLength = 2 } = options
  const bracketPattern = bracketsLength === 3 ? '{{{' : '{{'
  if (!str.includes(bracketPattern)) return str

  const reg = brackRegex[bracketsLength]
  const obj = state || {}

  return str.replace(reg, (_, parentPath, variable) => {
    if (parentPath) {
      const parentLevels = (parentPath.match(/\.\.\//g) || []).length
      let parentState = obj

      for (let i = 0; i < parentLevels; i++) {
        if (!parentState || !parentState.parent) return ''
        parentState = parentState.parent
      }

      // If the variable is 'parent', return the value property
      const key = variable.trim()
      if (key === 'parent') {
        return parentState.value !== undefined ? String(parentState.value) : ''
      }

      const value = getNestedValue(parentState, key)
      return value !== undefined ? String(value) : ''
    } else {
      const value = getNestedValue(obj, variable.trim())
      return value !== undefined ? String(value) : ''
    }
  })
}

export const lowercaseFirstLetter = inputString => {
  return `${inputString.charAt(0).toLowerCase()}${inputString.slice(1)}`
}

export const findKeyPosition = (str, key) => {
  const lines = str.split('\n')
  let startLineNumber = -1
  let endLineNumber = -1
  let startColumn = -1
  let endColumn = -1

  const keyPattern = new RegExp(`\\b${key}\\b\\s*:\\s*`)
  let braceCount = 0
  let foundKey = false

  for (let i = 0; i < lines.length; i++) {
    if (keyPattern.test(lines[i]) && !foundKey) {
      foundKey = true
      startLineNumber = i + 1
      startColumn = lines[i].indexOf(key) + 1

      // Check if the value is an empty object
      if (lines[i].includes('{}')) {
        endLineNumber = startLineNumber
        endColumn = lines[i].indexOf('{}') + 3
        break
      }

      // Check if the value starts with '{' (object) or '[' (array)
      const line = lines[i].slice(startColumn + key.length)
      if (line.includes('{') || line.includes('[')) {
        braceCount = 1
      } else {
        endLineNumber = i + 1
        endColumn = lines[i].length + 1
        break
      }
    } else if (foundKey) {
      braceCount += (lines[i].match(/{/g) || []).length
      braceCount += (lines[i].match(/\[/g) || []).length
      braceCount -= (lines[i].match(/}/g) || []).length
      braceCount -= (lines[i].match(/]/g) || []).length

      // If braceCount is 0 and we find the end of the object/array
      if (braceCount === 0) {
        endLineNumber = i + 1
        endColumn =
          lines[i].lastIndexOf('}') !== -1
            ? lines[i].lastIndexOf('}') + 2
            : lines[i].length + 1
        break
      }
    }
  }

  return {
    startColumn,
    endColumn,
    startLineNumber,
    endLineNumber
  }
}

export const replaceOctalEscapeSequences = str => {
  // Regex to match octal escape sequences
  const octalRegex = /\\([0-7]{1,3})/g

  // Replace each match with the corresponding character
  return str.replace(octalRegex, (match, p1) => {
    // Convert the octal value to a decimal integer
    const octalValue = parseInt(p1, 8)
    // Convert the decimal value to the corresponding character
    const char = String.fromCharCode(octalValue)
    return char
  })
}

export const encodeNewlines = str => {
  return str
    .split('\n')
    .join('/////n')
    .split('`')
    .join('/////tilde')
    .split('$')
    .join('/////dlrsgn')
}

export const decodeNewlines = encodedStr => {
  return encodedStr
    .split('/////n')
    .join('\n')
    .split('/////tilde')
    .join('`')
    .split('/////dlrsgn')
    .join('$')
}

export const customEncodeURIComponent = str => {
  return str
    .split('')
    .map(char => {
      if (/[^a-zA-Z0-9\s]/.test(char)) {
        return '%' + char.charCodeAt(0).toString(16).toUpperCase()
      }
      return char
    })
    .join('')
}

export const customDecodeURIComponent = encodedStr => {
  return encodedStr.replace(/%[0-9A-Fa-f]{2}/g, match =>
    String.fromCharCode(parseInt(match.slice(1), 16))
  )
}
