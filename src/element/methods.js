'use strict'

import { isFunction, isObjectLike } from '../utils'
import { registry, parseFilters } from './mixins'
import root from './root'

const ENV = process.env.NODE_ENV

// TODO: update these files
export const lookup = function (key) {
  const element = this
  let { parent } = element

  while (parent.key !== key) {
    if (parent[key]) return parent[key]
    parent = parent.parent
    if (!parent) return
  }

  return parent
}

// TODO: update these files
export const spotByPath = function (path) {
  const element = this
  const arr = [].concat(path)
  let active = root[arr[0]]

  if (!arr || !arr.length) return console.log(arr, 'on', element.key, 'is undefined')

  while (active.key === arr[0]) {
    arr.shift()
    if (!arr.length) break
    active = active[arr[0]]
    if (!active) return
  }

  return active
}

export const remove = function (params) {
  const element = this
  if (isFunction(element.node.remove)) element.node.remove()
  else if (ENV === 'test' || ENV === 'development') {
    console.warn('This item cant be removed')
    element.log()
  }
  delete element.parent[element.key]
}

export const get = function (param) {
  const element = this
  return element[param]
}

export const set = function () {
}

export const update = function () {
}

export const setProps = function (param, options) {
  const element = this
  if (!param || !element.props) return
  element.update({ props: param }, options)
  return element
}

export const defineSetter = (element, key, get, set) =>
  Object.defineProperty(element, key, { get, set })

export const keys = function () {
  const element = this
  const keys = []
  for (const param in element) {
    if (registry[param] && !parseFilters.elementKeys.includes(param)) { continue }
    keys.push(param)
  }
  return keys
}

export const parse = function () {
  const element = this
  const obj = {}
  const keyList = keys.call(element)
  keyList.forEach(v => (obj[v] = element[v]))
  return obj
}

export const parseDeep = function () {
  const element = this
  const obj = parse.call(element)
  for (const k in obj) {
    if (isObjectLike(obj[k])) { obj[k] = parseDeep.call(obj[k]) }
  }
  return obj
}

export const log = function (...args) {
  const element = this
  console.group(element.key)
  if (args.length) {
    args.forEach(v => console.log(`%c${v}:\n`, 'font-weight: bold', element[v]))
  } else {
    console.log(element.path)
    const keys = element.keys()
    keys.forEach(v => console.log(`%c${v}:\n`, 'font-weight: bold', element[v]))
  }
  console.groupEnd(element.key)
  return element
}

export const isMethod = function (param) {
  return param === 'set' ||
    param === 'update' ||
    param === 'remove' ||
    param === 'removeContent' ||
    param === 'lookup' ||
    param === 'spotByPath' ||
    param === 'keys' ||
    param === 'parse' ||
    param === 'setProps' ||
    param === 'parseDeep' ||
    param === 'if' ||
    param === 'log' ||
    param === 'nextElement' ||
    param === 'previousElement'
}

export const nextElement = function () {
  const element = this
  const { key, parent } = element
  const { __children } = parent

  const currentIndex = __children.indexOf(key)
  const nextChild = __children[currentIndex + 1]
  console.log(nextChild)

  return parent[nextChild]
}

export const previousElement = function (el) {
  const element = el || this
  const { key, parent } = element
  const { __children } = parent

  if (!__children) return

  const currentIndex = __children.indexOf(key)
  return parent[__children[currentIndex - 1]]
}
