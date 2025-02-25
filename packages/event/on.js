'use strict'

import { isFunction } from '@domql/utils'

const getOnOrPropsEvent = (param, element) => {
  const onEvent = element.on?.[param]
  const onPropEvent =
    element.props?.['on' + param.slice(0, 1).toUpperCase() + param.slice(1)]
  return onEvent || onPropEvent
}

export const applyEvent = (param, element, state, context, options) => {
  return param.call(
    element,
    element,
    state || element.state,
    context || element.context,
    options
  )
}

export const triggerEventOn = async (param, element, options) => {
  if (!element) {
    throw new Error('Element is required')
  }
  const appliedFunction = getOnOrPropsEvent(param, element)
  if (appliedFunction) {
    const { state, context } = element
    return await applyEvent(appliedFunction, element, state, context, options)
  }
}

export const applyEventUpdate = (
  param,
  updatedObj,
  element,
  state,
  context,
  options
) => {
  return param.call(
    element,
    updatedObj,
    element,
    state || element.state,
    context || element.context,
    options
  )
}

export const triggerEventOnUpdate = async (
  param,
  updatedObj,
  element,
  options
) => {
  const appliedFunction = getOnOrPropsEvent(param, element)
  if (appliedFunction) {
    const { state, context } = element
    return await applyEventUpdate(
      appliedFunction,
      updatedObj,
      element,
      state,
      context,
      options
    )
  }
}

export const applyEventsOnNode = (element, options) => {
  const { node, on } = element
  for (const param in on) {
    if (
      param === 'init' ||
      param === 'beforeClassAssign' ||
      param === 'render' ||
      param === 'renderRouter' ||
      param === 'attachNode' ||
      param === 'stateInit' ||
      param === 'stateCreated' ||
      param === 'beforeStateUpdate' ||
      param === 'stateUpdate' ||
      param === 'beforeUpdate' ||
      param === 'done' ||
      param === 'create' ||
      param === 'complete' ||
      param === 'frame' ||
      param === 'update'
    ) {
      continue
    }

    const appliedFunction = getOnOrPropsEvent(param, element)
    if (isFunction(appliedFunction)) {
      node.addEventListener(param, async event => {
        const { state, context } = element
        await appliedFunction.call(
          element,
          event,
          element,
          state,
          context,
          options
        )
      })
    }
  }
}
