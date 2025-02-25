'use strict'

import { exec, isObject, isString } from '@domql/utils'

export const assignKeyAsClassname = element => {
  const { key } = element
  if (element.class === true) element.class = key
  else if (
    !element.class &&
    typeof key === 'string' &&
    key.charAt(0) === '_' &&
    key.charAt(1) !== '_'
  ) {
    element.class = key.slice(1)
  }
}

// stringifies class object
export const classify = (obj, element) => {
  let className = ''
  for (const item in obj) {
    const param = obj[item]
    if (typeof param === 'boolean' && param) className += ` ${item}`
    else if (typeof param === 'string') className += ` ${param}`
    else if (typeof param === 'function') {
      className += ` ${exec(param, element)}`
    }
  }
  return className
}

export const classList = (params, element) => {
  if (!params) return
  const { key } = element
  if (params === true) params = element.class = { key }
  if (isString(params)) params = element.class = { default: params }
  if (isObject(params)) params = classify(params, element)
  // TODO: fails on string
  const className = params.replace(/\s+/g, ' ').trim()
  if (element.ref) element.ref.class = className // TODO: this check is NOT needed in new DOMQL
  return className
}

// LEGACY (still needed in old domql)
export const applyClassListOnNode = (params, element, node) => {
  const className = classList(params, element)
  node.classList = className
  return className
}

export function applyClasslist (params, element, node) {
  applyClassListOnNode(params, element, node)
}

export default applyClasslist
