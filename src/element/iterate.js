'use strict'

import { exec } from '../utils'

export const applyDefined = (element, force) => {
  for (const param in element.define) {
    // if (!element[param]) element[param] = element.define[param](void 0, element)
    if (!element[param]) element[param] = element.define[param](undefined, element)
  }
}

export const applyEvents = element => {
  const { node, on } = element
  for (const param in on) {
    if (param === 'init' || param === 'render') continue

    const appliedFunction = element.on[param]
    if (typeof appliedFunction === 'function') {
      node.addEventListener(param, event => appliedFunction(event, element), true)
    }
  }
}

export const throughDefine = (element) => {
  const { define } = element
  for (const param in define) {
    const execParam = exec(element[param], element)
    element.data[param] = execParam
    element[param] = define[param](execParam, element)
  }
  return element
}

export const throughTransform = element => {
  const { transform } = element
  for (const param in transform) {
    let execParam = exec(element[param], element)
    if (element.data[param]) {
      execParam = exec(element.data[param], element)
    } else {
      execParam = exec(element[param], element)
      element.data[param] = execParam
    }
    element[param] = transform[param](execParam, element)
  }
}

export const throughRegisteredParams = element => {
}
