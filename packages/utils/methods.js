'use strict'

import { triggerEventOn } from '@domql/event'
import { DOMQ_PROPERTIES, METHODS, PARSED_DOMQ_PROPERTIES } from './keys.js'
import { isDefined, isFunction, isObject, isObjectLike } from './types.js'
import { deepClone } from './object.js'
import { isProduction } from './env.js'
import { removeValueFromArray } from './array.js'
const ENV = process.env.NODE_ENV

// TODO: update these files
export function spotByPath (path) {
  const element = this
  const { __ref: ref } = element
  const arr = [].concat(path)
  let foundelement = ref.root[arr[0]]

  if (!arr || !arr.length) {
    return console.log(arr, 'on', element.key, 'is undefined')
  }

  while (foundelement.key === arr[0]) {
    arr.shift()
    if (!arr.length) break
    foundelement = foundelement[arr[0]]
    if (!foundelement) return
  }

  return foundelement
}

// TODO: update these files
export function lookup (param) {
  const el = this
  let { parent } = el

  if (isFunction(param)) {
    if (parent.state && param(parent, parent.state, parent.context)) {
      return parent
    } else if (parent.parent) return parent.lookup(param)
    else return
  }

  if (el[param]) return el[param]

  while (parent.param !== param) {
    if (parent[param]) return parent[param]
    parent = parent.parent
    if (!parent) return
  }

  return parent
}

export function lookdown (param) {
  const el = this
  const { __ref: ref } = el
  const children = ref.__children

  for (let i = 0; i < children.length; i++) {
    const v = children[i]
    const childElem = el[v]

    if (v === param) return childElem
    else if (isFunction(param)) {
      const exec = param(childElem, childElem.state, childElem.context)
      if (childElem.state && exec) {
        return childElem
      }
    }
    const lookdown = childElem?.lookdown?.(param)
    if (lookdown) return lookdown
  }
}

export function lookdownAll (param, results = []) {
  const el = this
  const { __ref: ref } = el
  const children = ref.__children

  for (let i = 0; i < children.length; i++) {
    const v = children[i]
    const childElem = el[v]

    if (v === param) results.push(childElem)
    else if (isFunction(param)) {
      const exec = param(childElem, childElem.state, childElem.context)
      if (childElem.state && exec) results.push(childElem)
    }
    childElem?.lookdownAll?.(param, results)
  }

  return results.length ? results : undefined
}

export function setNodeStyles (params = {}) {
  const el = this
  if (!el.node?.style) return

  for (const param in params) {
    const value = params[param]
    const childElem = el[param]
    if (isObject(value) && childElem) setNodeStyles.call(childElem, value)
    else el.node.style[param] = value
  }

  return el
}

export function remove (opts) {
  const element = this
  const beforeRemoveReturns = triggerEventOn('beforeRemove', element, opts)
  if (beforeRemoveReturns === false) return element
  if (isFunction(element.node.remove)) element.node.remove()
  else if (!isProduction()) {
    console.warn('This item cant be removed')
    element.log()
  }
  delete element.parent[element.key]
  if (element.parent.__ref) {
    element.parent.__ref.__children = removeValueFromArray(
      element.parent.__ref.__children,
      element.key
    )
  }
  triggerEventOn('remove', element, opts)
}

export function get (param) {
  const element = this
  return element[param]
}

export function setProps (param, options) {
  const element = this
  if (!param || !element.props) return
  element.update({ props: param }, options)
  return element
}

export function getRef () {
  return this.__ref
}

export function getPath () {
  return this.getRef().path
}

// export function set () {
// }

// export function update () {
// }

export const defineSetter = (element, key, get, set) =>
  Object.defineProperty(element, key, { get, set })

export function keys () {
  const element = this
  const keys = []
  for (const param in element) {
    if (
      // (REGISTRY[param] && !DOMQ_PROPERTIES.includes(param)) ||
      !Object.hasOwnProperty.call(element, param) ||
      (DOMQ_PROPERTIES.includes(param) &&
        !PARSED_DOMQ_PROPERTIES.includes(param))
    ) {
      continue
    }
    keys.push(param)
  }
  return keys
}

export function parse (excl = []) {
  const element = this
  const { __ref: ref } = element
  const obj = {}
  const keyList = keys.call(element)
  keyList.forEach(v => {
    if (excl.includes(v)) return
    const val = element[v]
    if (v === 'state') {
      if (!ref?.__hasRootState) return
      const parsedVal = isFunction(val && val.parse) ? val.parse() : val
      obj[v] = isFunction(parsedVal)
        ? parsedVal
        : JSON.parse(JSON.stringify(parsedVal || {}))
    } else if (v === 'scope') {
      if (!ref?.__hasRootScope) return
      obj[v] = JSON.parse(JSON.stringify(val || {}))
    } else if (isDefined(val) && Object.hasOwnProperty.call(element, v)) {
      obj[v] = val
    }
  })
  return obj
}

export function parseDeep (excl = []) {
  const element = this
  const obj = parse.call(element, excl)
  for (const v in obj) {
    if (excl.includes(v)) return
    if (isObjectLike(obj[v])) {
      obj[v] = parseDeep.call(obj[v], excl)
    }
  }
  return obj
}

export function verbose (...args) {
  if (ENV !== 'test' && ENV !== 'development') return

  const element = this
  const { __ref: ref } = element
  console.groupCollapsed(element.key)
  if (args.length) {
    args.forEach(v => console.log(`%c${v}:\n`, 'font-weight: bold', element[v]))
  } else {
    console.log(ref.path)
    const keys = element.keys()
    keys.forEach(v => console.log(`%c${v}:`, 'font-weight: bold', element[v]))
  }
  console.log(element)
  console.groupEnd(element.key)
  return element
}

export function log (...params) {
  if (ENV === 'test' || ENV === 'development') {
    console.log(...params)
  }
}

export function warn (...params) {
  if (ENV === 'test' || ENV === 'development') {
    console.warn(...params)
  }
}

export function error (...params) {
  if (ENV === 'test' || ENV === 'development') {
    if (params[params.length - 1]?.debugger) debugger // eslint-disable-line
    if (params[params.length - 1]?.verbose) verbose.call(this)
    throw new Error(...params)
  }
}

export function nextElement () {
  const element = this
  const { key, parent } = element
  const { __children } = parent.__ref

  const currentIndex = __children.indexOf(key)
  const nextChild = __children[currentIndex + 1]

  return parent[nextChild]
}

export function previousElement (el) {
  const element = el || this
  const { key, parent } = element
  const { __children } = parent.__ref

  if (!__children) return

  const currentIndex = __children.indexOf(key)
  return parent[__children[currentIndex - 1]]
}

export function variables (obj = {}) {
  const element = this
  if (!element.data) element.data = {}
  if (!element.data.varCaches) element.data.varCaches = {}
  const varCaches = element.data.varCaches
  const changes = {}
  let changed
  for (const key in obj) {
    if (obj[key] !== varCaches[key]) {
      changed = true
      changes[key] = obj[key]
    }
  }
  return {
    changed: cb => {
      if (!changed) return
      const returns = cb(changes, deepClone(varCaches))
      for (const key in changes) {
        varCaches[key] = changes[key]
      }
      return returns
    },
    timeout: (cb, timeout) => {
      if (!changed) return
      const t = setTimeout(() => {
        cb(changes)
        clearTimeout(t)
      }, timeout)
    }
  }
}

export function call (fnKey, ...args) {
  const context = this.context
  return (
    context.utils[fnKey] ||
    context.functions[fnKey] ||
    context.methods[fnKey] ||
    context.snippets[fnKey]
  )?.call(this, ...args)
}

export function isMethod (param, element) {
  return Boolean(METHODS.includes(param) || element?.context?.methods?.[param])
}
