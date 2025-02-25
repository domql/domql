'use strict'

import { window } from './globals.js'

export const isNode = obj => {
  return (
    (typeof Node === 'object'
      ? obj instanceof window.Node
      : obj &&
        typeof obj === 'object' &&
        typeof obj.nodeType === 'number' &&
        typeof obj.nodeName === 'string') || false
  )
}

// Returns true if it is a DOM element
export const isHtmlElement = obj => {
  return (
    (typeof HTMLElement === 'object'
      ? obj instanceof window.HTMLElement // DOM2
      : obj &&
        typeof obj === 'object' &&
        obj !== null &&
        obj.nodeType === 1 &&
        typeof obj.nodeName === 'string') || false
  )
}

export const isDOMNode = obj => {
  return (
    typeof window !== 'undefined' &&
    (obj instanceof window.Node ||
      obj instanceof window.Window ||
      obj === window ||
      obj === document)
  )
}
