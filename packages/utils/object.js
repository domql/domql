'use strict'

import { window } from './globals.js'
import {
  isFunction,
  isObjectLike,
  isObject,
  isArray,
  isString,
  is,
  isUndefined,
  isNull
} from './types.js'
import { unstackArrayOfObjects } from './array.js'
import { stringIncludesAny } from './string.js'
import { isDOMNode } from './node.js'
import { METHODS_EXL } from './keys.js'

const ENV = process.env.NODE_ENV

export const exec = (param, element, state, context) => {
  if (isFunction(param)) {
    return param.call(
      element,
      element,
      state || element.state,
      context || element.context
    )
  }
  return param
}

export const map = (obj, extention, element) => {
  for (const e in extention) {
    obj[e] = exec(extention[e], element)
  }
}

export const merge = (element, obj, excludeFrom = []) => {
  for (const e in obj) {
    const hasOwnProperty = Object.prototype.hasOwnProperty.call(obj, e)
    if (!hasOwnProperty || excludeFrom.includes(e) || e.startsWith('__')) {
      continue
    }
    const elementProp = element[e]
    const objProp = obj[e]
    if (elementProp === undefined) {
      element[e] = objProp
    }
  }
  return element
}

export const deepMerge = (element, extend, excludeFrom = METHODS_EXL) => {
  for (const e in extend) {
    const hasOwnProperty = Object.prototype.hasOwnProperty.call(extend, e)
    if (!hasOwnProperty || excludeFrom.includes(e) || e.startsWith('__')) {
      continue
    }
    const elementProp = element[e]
    const extendProp = extend[e]
    if (isObjectLike(elementProp) && isObjectLike(extendProp)) {
      deepMerge(elementProp, extendProp, excludeFrom)
    } else if (elementProp === undefined) {
      element[e] = extendProp
    }
  }
  return element
}

export const clone = (obj, excludeFrom = []) => {
  const o = {}
  for (const prop in obj) {
    const hasOwnProperty = Object.prototype.hasOwnProperty.call(obj, prop)
    if (
      !hasOwnProperty ||
      excludeFrom.includes(prop) ||
      prop.startsWith('__')
    ) {
      continue
    }
    o[prop] = obj[prop]
  }
  return o
}

/**
 * Enhanced deep clone function that combines features from multiple implementations
 * @param {any} obj - Object to clone
 * @param {Object} options - Configuration options
 * @param {string[]} options.exclude - Properties to exclude from cloning
 * @param {boolean} options.cleanUndefined - Remove undefined values
 * @param {boolean} options.cleanNull - Remove null values
 * @param {Window} options.window - Window object for cross-frame cloning
 * @param {WeakMap} options.visited - WeakMap for tracking circular references
 * @param {boolean} options.handleExtend - Whether to handle 'extends' arrays specially
 * @returns {any} Cloned object
 */
export const deepClone = (obj, options = {}) => {
  const {
    exclude = [],
    cleanUndefined = false,
    cleanNull = false,
    window: targetWindow,
    visited = new WeakMap(),
    handleExtend = false
  } = options

  // Handle non-object types and special cases
  if (!isObjectLike(obj) || isDOMNode(obj)) {
    return obj
  }

  // Handle circular references
  if (visited.has(obj)) {
    return visited.get(obj)
  }

  // Create appropriate container based on type and window context
  const clone = targetWindow
    ? isArray(obj)
      ? new targetWindow.Array()
      : new targetWindow.Object()
    : isArray(obj)
      ? []
      : {}

  // Store the clone to handle circular references
  visited.set(obj, clone)

  // Clone properties
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue

    // Skip excluded properties
    if (exclude.includes(key) || key.startsWith('__') || key === '__proto__') {
      continue
    }

    const value = obj[key]

    // Skip based on cleanup options
    if (
      (cleanUndefined && isUndefined(value)) ||
      (cleanNull && isNull(value))
    ) {
      continue
    }

    // Handle special cases
    if (isDOMNode(value)) {
      clone[key] = value
      continue
    }

    // Handle 'extends' array if enabled
    if (handleExtend && key === 'extends' && isArray(value)) {
      clone[key] = unstackArrayOfObjects(value, exclude)
      continue
    }

    // Handle functions in cross-frame scenario
    if (isFunction(value) && targetWindow) {
      clone[key] = targetWindow.eval('(' + value.toString() + ')')
      continue
    }

    // Recursively clone objects
    if (isObjectLike(value)) {
      clone[key] = deepClone(value, {
        ...options,
        visited
      })
    } else {
      clone[key] = value
    }
  }

  return clone
}

/**
 * Stringify object
 */
export const deepStringify = (obj, stringified = {}) => {
  if (obj.node || obj.__ref || obj.parent || obj.__element || obj.parse) {
    ;(obj.__element || obj.parent?.__element).warn(
      'Trying to clone element or state at',
      obj
    )
    obj = obj.parse?.()
  }

  for (const prop in obj) {
    const objProp = obj[prop]
    if (isFunction(objProp)) {
      stringified[prop] = objProp.toString()
    } else if (isObject(objProp)) {
      stringified[prop] = {}
      deepStringify(objProp, stringified[prop])
    } else if (isArray(objProp)) {
      stringified[prop] = []
      objProp.forEach((v, i) => {
        if (isObject(v)) {
          stringified[prop][i] = {}
          deepStringify(v, stringified[prop][i])
        } else if (isFunction(v)) {
          stringified[prop][i] = v.toString()
        } else {
          stringified[prop][i] = v
        }
      })
    } else {
      stringified[prop] = objProp
    }
  }
  return stringified
}

export const objectToString = (obj = {}, indent = 0) => {
  // Handle empty object case
  if (obj === null || typeof obj !== 'object') {
    return String(obj)
  }

  // Handle empty object case
  if (Object.keys(obj).length === 0) {
    return '{}'
  }

  const spaces = '  '.repeat(indent)
  let str = '{\n'

  for (const [key, value] of Object.entries(obj)) {
    const keyNotAllowdChars = stringIncludesAny(key, [
      '&',
      '*',
      '-',
      ':',
      '%',
      '{',
      '}',
      '>',
      '<',
      '@',
      '.',
      '/',
      '!',
      ' '
    ])
    const stringedKey = keyNotAllowdChars ? `'${key}'` : key
    str += `${spaces}  ${stringedKey}: `

    if (isArray(value)) {
      str += '[\n'
      for (const element of value) {
        if (isObjectLike(element) && element !== null) {
          str += `${spaces}    ${objectToString(element, indent + 2)},\n`
        } else if (isString(element)) {
          str += `${spaces}    '${element}',\n`
        } else {
          str += `${spaces}    ${element},\n`
        }
      }
      str += `${spaces}  ]`
    } else if (isObjectLike(value)) {
      str += objectToString(value, indent + 1)
    } else if (isString(value)) {
      str += stringIncludesAny(value, ['\n', "'"])
        ? `\`${value}\``
        : `'${value}'`
    } else {
      str += value
    }

    str += ',\n'
  }

  str += `${spaces}}`
  return str
}

export const hasFunction = str => {
  if (!str) return false

  const trimmed = str.trim().replace(/\n\s*/g, ' ').trim()

  if (trimmed === '') return false
  if (trimmed === '{}') return false
  if (trimmed === '[]') return false

  const patterns = [
    /^\(\s*\{[^}]*\}\s*\)\s*=>/,
    /^(\([^)]*\)|[^=]*)\s*=>/,
    /^function[\s(]/,
    /^async\s+/,
    /^\(\s*function/,
    /^[a-zA-Z_$][a-zA-Z0-9_$]*\s*=>/
  ]

  const isFunction = patterns.some(pattern => pattern.test(trimmed))
  const isObjectLiteral = trimmed.startsWith('{') && !trimmed.includes('=>')
  const isArrayLiteral = trimmed.startsWith('[')
  const isJSONLike = /^["[{]/.test(trimmed) && !trimmed.includes('=>')

  return isFunction && !isObjectLiteral && !isArrayLiteral && !isJSONLike
}

export const deepDestringify = (obj, destringified = {}) => {
  for (const prop in obj) {
    const hasOwnProperty = Object.prototype.hasOwnProperty.call(obj, prop)
    if (!hasOwnProperty) continue

    const objProp = obj[prop]

    if (isString(objProp)) {
      if (hasFunction(objProp)) {
        try {
          const evalProp = window.eval(`(${objProp})`)
          destringified[prop] = evalProp
        } catch (e) {
          if (e) destringified[prop] = objProp
        }
      } else {
        destringified[prop] = objProp
      }
    } else if (isArray(objProp)) {
      destringified[prop] = []
      objProp.forEach(arrProp => {
        if (isString(arrProp)) {
          if (hasFunction(arrProp)) {
            try {
              const evalProp = window.eval(`(${arrProp})`)
              destringified[prop].push(evalProp)
            } catch (e) {
              if (e) destringified[prop].push(arrProp)
            }
          } else {
            destringified[prop].push(arrProp)
          }
        } else if (isObject(arrProp)) {
          destringified[prop].push(deepDestringify(arrProp))
        } else {
          destringified[prop].push(arrProp)
        }
      })
    } else if (isObject(objProp)) {
      destringified[prop] = deepDestringify(objProp, destringified[prop])
    } else {
      destringified[prop] = objProp
    }
  }
  return destringified
}

export const stringToObject = (str, opts = { verbose: true }) => {
  try {
    return str ? window.eval('(' + str + ')') : {} // eslint-disable-line
  } catch (e) {
    if (opts.verbose) console.warn(e)
  }
}

export const hasOwnProperty = (o, ...args) =>
  Object.prototype.hasOwnProperty.call(o, ...args)

export const isEmpty = o => Object.keys(o).length === 0

export const isEmptyObject = o => isObject(o) && isEmpty(o)

export const makeObjectWithoutPrototype = () => Object.create(null)

/**
 * Overwrites object properties with another
 */
export const overwrite = (element, params, opts = {}) => {
  const { __ref: ref } = element
  const excl = opts.exclude || []
  const allowUnderscore = opts.preventUnderscore
  const preventCaching = opts.preventCaching

  for (const e in params) {
    if (excl.includes(e) || (!allowUnderscore && e.startsWith('__'))) continue

    const elementProp = element[e]
    const paramsProp = params[e]

    if (paramsProp !== undefined) {
      element[e] = paramsProp
      if (ref && !preventCaching) {
        ref.__cache[e] = elementProp
      }
    }
  }

  return element
}

export const overwriteShallow = (obj, params, excludeFrom = []) => {
  for (const e in params) {
    if (excludeFrom.includes(e) || e.startsWith('__')) continue
    obj[e] = params[e]
  }
  return obj
}

/**
 * Overwrites DEEPLY object properties with another
 */
export const overwriteDeep = (
  obj,
  params,
  opts = {},
  visited = new WeakMap()
) => {
  const excl = opts.exclude || []
  const forcedExclude = opts.preventForce ? [] : ['node', 'window']

  if (
    !isObjectLike(obj) ||
    !isObjectLike(params) ||
    isDOMNode(obj) ||
    isDOMNode(params)
  ) {
    return params
  }

  if (visited.has(obj)) return visited.get(obj)
  visited.set(obj, obj)

  for (const e in params) {
    if (!Object.hasOwnProperty.call(params, e)) continue
    if (excl.includes(e) || (forcedExclude && e.startsWith('__'))) continue

    const objProp = obj[e]
    const paramsProp = params[e]

    if (isDOMNode(paramsProp)) {
      obj[e] = paramsProp
    } else if (isObjectLike(objProp) && isObjectLike(paramsProp)) {
      obj[e] = overwriteDeep(objProp, paramsProp, opts, visited)
    } else if (paramsProp !== undefined) {
      obj[e] = paramsProp
    }
  }

  return obj
}

/**
 * Recursively compares two values to determine if they are deeply equal.
 *
 * This function checks for deep equality between two values, including
 * objects, arrays, and nested structures. It handles circular references to
 * prevent infinite loops.
 *
 * @param {*} param - The first value to compare.
 * @param {*} element - The second value to compare.
 * @param {Set} [visited] - (Optional) A set to track visited objects during recursion
 *   to handle circular references. You can omit this parameter when calling
 *   the function; it is used internally for tracking visited objects.
 *
 * @returns {boolean} Returns `true` if the values are deeply equal, `false` otherwise.
 *
 * @example
 * // Comparing primitive values
 * isEqualDeep(42, 42); // true
 * isEqualDeep('hello', 'hello'); // true
 * isEqualDeep(true, true); // true
 * isEqualDeep(42, '42'); // false
 *
 * // Comparing simple objects
 * const obj1 = { a: 1, b: { c: 2 } };
 * const obj2 = { a: 1, b: { c: 2 } };
 * isEqualDeep(obj1, obj2); // true
 *
 * // Handling circular references
 * const circularObj = { prop: null };
 * circularObj.prop = circularObj;
 * const anotherObj = { prop: null };
 * anotherObj.prop = anotherObj;
 * isEqualDeep(circularObj, anotherObj); // true
 */
export const isEqualDeep = (param, element, visited = new Set()) => {
  // Check if both values are non-null objects
  if (
    typeof param !== 'object' ||
    typeof element !== 'object' ||
    param === null ||
    element === null
  ) {
    return param === element // Compare non-object values directly
  }

  // Check for circular references
  if (visited.has(param) || visited.has(element)) {
    return true // Assume equality to break the circular reference
  }

  visited.add(param)
  visited.add(element)

  const keysParam = Object.keys(param)
  const keysElement = Object.keys(element)

  // Check if both objects have the same number of properties
  if (keysParam.length !== keysElement.length) {
    return false
  }

  // Check if all properties in param also exist in element
  for (const key of keysParam) {
    if (!keysElement.includes(key)) {
      return false
    }

    const paramProp = param[key]
    const elementProp = element[key]

    // Recursively check property values
    if (!isEqualDeep(paramProp, elementProp, visited)) {
      return false
    }
  }

  return true
}

export const deepContains = (obj1, obj2, ignoredKeys = ['node', '__ref']) => {
  if (obj1 === obj2) return true
  if (!isObjectLike(obj1) || !isObjectLike(obj2)) return obj1 === obj2
  if (isDOMNode(obj1) || isDOMNode(obj2)) return obj1 === obj2

  const visited = new WeakSet()

  function checkContains (target, source) {
    if (visited.has(source)) return true
    visited.add(source)

    // Check each property in source
    for (const key in source) {
      if (!Object.prototype.hasOwnProperty.call(source, key)) continue
      if (ignoredKeys.includes(key)) continue

      // If key doesn't exist in target, return false
      if (!Object.prototype.hasOwnProperty.call(target, key)) return false

      const sourceValue = source[key]
      const targetValue = target[key]

      if (isDOMNode(sourceValue) || isDOMNode(targetValue)) {
        if (sourceValue !== targetValue) return false
      } else if (isObjectLike(sourceValue) && isObjectLike(targetValue)) {
        if (!checkContains(targetValue, sourceValue)) return false
      } else if (sourceValue !== targetValue) {
        return false
      }
    }

    return true
  }

  return checkContains(obj1, obj2)
}

export const removeFromObject = (obj, props) => {
  if (props === undefined || props === null) return obj
  if (is(props)('string', 'number')) {
    delete obj[props]
  } else if (isArray(props)) {
    props.forEach(prop => delete obj[prop])
  } else {
    throw new Error(
      'Invalid input: props must be a string or an array of strings'
    )
  }
  return obj
}

export const createObjectWithoutPrototype = obj => {
  if (obj === null || typeof obj !== 'object') {
    return obj // Return the value if obj is not an object
  }

  const newObj = Object.create(null) // Create an object without prototype

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = createObjectWithoutPrototype(obj[key]) // Recursively copy each property
    }
  }

  return newObj
}

export const createNestedObject = (arr, lastValue) => {
  const nestedObject = {}

  if (arr.length === 0) {
    return lastValue
  }

  arr.reduce((obj, value, index) => {
    if (!obj[value]) {
      obj[value] = {}
    }
    if (index === arr.length - 1 && lastValue) {
      obj[value] = lastValue
    }
    return obj[value]
  }, nestedObject)

  return nestedObject
}

export const removeNestedKeyByPath = (obj, path) => {
  if (!Array.isArray(path)) {
    throw new Error('Path must be an array.')
  }

  let current = obj

  for (let i = 0; i < path.length - 1; i++) {
    if (current[path[i]] === undefined) {
      return // Path does not exist, so nothing to remove.
    }
    current = current[path[i]]
  }

  const lastKey = path[path.length - 1]
  if (current && Object.hasOwnProperty.call(current, lastKey)) {
    delete current[lastKey]
  }
}

export const setInObjectByPath = (obj, path, value) => {
  if (!Array.isArray(path)) {
    throw new Error('Path must be an array.')
  }

  let current = obj

  for (let i = 0; i < path.length - 1; i++) {
    // If the current path segment doesn't exist or isn't an object, create it
    if (!current[path[i]] || typeof current[path[i]] !== 'object') {
      current[path[i]] = {}
    }
    current = current[path[i]]
  }

  const lastKey = path[path.length - 1]
  current[lastKey] = value

  return obj
}

export const getInObjectByPath = (obj, path) => {
  if (!Array.isArray(path)) {
    throw new Error('Path must be an array.')
  }

  let current = obj

  for (let i = 0; i < path.length; i++) {
    if (current === undefined || current === null) {
      return undefined
    }
    current = current[path[i]]
  }

  return current
}

export const detectInfiniteLoop = arr => {
  const maxRepeats = 10 // Maximum allowed repetitions
  let pattern = []
  let repeatCount = 0

  for (let i = 0; i < arr.length; i++) {
    if (pattern.length < 2) {
      // Build the initial pattern with two consecutive elements
      pattern.push(arr[i])
    } else {
      // Check if the current element follows the repeating pattern
      if (arr[i] === pattern[i % 2]) {
        repeatCount++
      } else {
        // If there's a mismatch, reset the pattern and repeat counter
        pattern = [arr[i - 1], arr[i]]
        repeatCount = 1 // Reset to 1 because we start a new potential pattern
      }

      // If the pattern repeats more than `maxRepeats`, throw a warning
      if (repeatCount >= maxRepeats * 2) {
        if (ENV === 'test' || ENV === 'development') {
          console.warn(
            'Warning: Potential infinite loop detected due to repeated sequence:',
            pattern
          )
        }
        return true
      }
    }
  }
}

export const isCyclic = obj => {
  const seenObjects = []

  function detect (obj) {
    if (obj && typeof obj === 'object') {
      if (seenObjects.indexOf(obj) !== -1) {
        return true
      }
      seenObjects.push(obj)
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key) && detect(obj[key])) {
          console.log(obj, 'cycle at ' + key)
          return true
        }
      }
    }
    return false
  }

  return detect(obj)
}

export const excludeKeysFromObject = (obj, excludedKeys) => {
  const result = { ...obj }
  excludedKeys.forEach(key => delete result[key])
  return result
}
