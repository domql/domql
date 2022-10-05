'use strict'

import { update } from '.'
import { on } from '../event'
import { debounce, deepClone, exec, isFunction, isObject, overwriteDeep } from '../utils'

export const IGNORE_STATE_PARAMS = ['update', 'parse', 'clean', 'parent', '__element', '__depends', '__ref']

export const parseState = function () {
  const state = this
  const parseState = {}
  for (const param in state) {
    if (!IGNORE_STATE_PARAMS.includes(param)) {
      parseState[param] = state[param]
    }
  }
  return parseState
}

export const cleanState = function () {
  const state = this
  for (const param in state) {
    if (!IGNORE_STATE_PARAMS.includes(param)) {
      delete state[param]
    }
  }
  return state
}

export const updateState = function (obj, options = {}) {
  const state = this
  const element = state.__element

  // run `on.stateUpdated`
  if (element.on && isFunction(element.on.initStateUpdated)) {
    on.initStateUpdated(element.on.initStateUpdated, element, state)
  }

  overwriteDeep(state, obj, IGNORE_STATE_PARAMS)

  if (!options.preventUpdate) debounce(element, update, 150)({}, {
    preventStateUpdate: 'once',
    ...options
  })

  if (state.__depends) {
    for (const el in state.__depends) {
      // const findElement = element.spotByPath(state.__depends[el])
      const findElement = state.__depends[el]
      findElement.clean().update(state.parse(), options)
    }
  }

  // run `on.stateUpdated`
  if (element.on && isFunction(element.on.stateUpdated)) {
    on.stateUpdated(element.on.stateUpdated, element, state)
  }
}

export default function (element, parent) {
  let { state } = element

  if (!state) {
    if (parent && parent.state) return parent.state
    return {}
  }

  if (isFunction(state)) state = exec(state, element)

  const { __ref } = state
  if (__ref) {
    state = deepClone(__ref, IGNORE_STATE_PARAMS)
    if (isObject(__ref.__depends)) {
      __ref.__depends[element.key] = state
    } else __ref.__depends = { [element.key] : state }
  } else {
    state = deepClone(state, IGNORE_STATE_PARAMS)
  }

  element.state = state
  state.__element = element
  state.clean = cleanState
  state.parse = parseState
  state.update = updateState
  state.parent = element.parent.state

  // run `on.stateCreated`
  if (element.on && isFunction(element.on.stateCreated)) {
    on.stateCreated(element.on.stateCreated, element, state)
  }

  return state
}
