'use strict'

import {
  isObject,
  exec,
  isFunction,
  isNumber,
  isString,
  matchesComponentNaming,
  isContextComponent,
  isMethod,
  overwrite
} from '@domql/utils'

export const throughInitialExec = (element, exclude = {}) => {
  const { __ref: ref } = element
  for (const param in element) {
    if (exclude[param]) continue
    const prop = element[param]
    if (isFunction(prop) && !isMethod(param, element)) {
      ref.__exec[param] = prop
      element[param] = prop(element, element.state, element.context)
    }
  }
}

export const throughUpdatedExec = (element, options = {}) => {
  const { __ref: ref } = element
  const changes = {}

  for (const param in ref.__exec) {
    const prop = element[param]

    const isDefinedParam = ref.__defineCache[param]
    if (isDefinedParam) continue

    const newExec = ref.__exec[param](element, element.state, element.context)
    const execReturnsString = isString(newExec) || isNumber(newExec)
    // if (prop && prop.node && execReturnsString) {
    if (prop && prop.node && execReturnsString) {
      overwrite(prop, { text: newExec })
    } else if (newExec !== prop) {
      if (matchesComponentNaming(param)) {
        const { extends: extend, ...newElem } = isContextComponent(
          newExec,
          element,
          param
        )
        overwrite(prop, newElem)
      } else {
        ref.__cached[param] = changes[param] = prop
        element[param] = newExec
      }
    }
  }

  return changes
}

export const throughExecProps = element => {
  const { __ref: ref } = element
  const { props } = element
  for (const k in props) {
    const isDefine =
      k.startsWith('is') || k.startsWith('has') || k.startsWith('use')
    const cachedExecProp = ref.__execProps[k]
    if (isFunction(cachedExecProp)) {
      props[k] = exec(cachedExecProp, element)
    } else if (isDefine && isFunction(props[k])) {
      ref.__execProps[k] = props[k]
      props[k] = exec(props[k], element)
    }
  }
}

export const isPropertyInDefines = (key, element) => {}

export const throughInitialDefine = element => {
  const { define, context, __ref: ref } = element

  let defineObj = {}
  const hasGlobalDefine = context && isObject(context.define)
  if (isObject(define)) defineObj = { ...define }
  if (hasGlobalDefine) defineObj = { ...defineObj, ...context.define }

  for (const param in defineObj) {
    let elementProp = element[param]

    if (isFunction(elementProp) && !isMethod(param, element)) {
      ref.__exec[param] = elementProp
      const execParam = (elementProp = exec(elementProp, element))

      if (execParam) {
        elementProp = element[param] = execParam.parse
          ? execParam.parse()
          : execParam
        ref.__defineCache[param] = elementProp
      }
    }

    const execParam = defineObj[param](
      elementProp,
      element,
      element.state,
      element.context
    )
    if (execParam) element[param] = execParam
  }
  return element
}

export const throughUpdatedDefine = element => {
  const { context, define, __ref: ref } = element
  const changes = {}

  let obj = {}
  if (isObject(define)) obj = { ...define }
  if (isObject(context && context.define)) obj = { ...obj, ...context.define }

  for (const param in obj) {
    const execParam = ref.__exec[param]
    if (execParam) {
      ref.__defineCache[param] = execParam(
        element,
        element.state,
        element.context
      )
    }
    const cached = exec(ref.__defineCache[param], element)
    const newExecParam = obj[param](
      cached,
      element,
      element.state,
      element.context
    )
    if (newExecParam) element[param] = newExecParam
  }
  return changes
}
