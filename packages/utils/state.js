'use strict'

import { addProtoToArray } from './array.js'
import { STATE_METHODS } from './keys.js'
import {
  deepClone,
  deepMerge,
  exec,
  overwriteDeep,
  overwriteShallow
} from './object.js'
import { is, isFunction, isObject, isObjectLike, isUndefined } from './types.js'

export const checkForStateTypes = async element => {
  const { state: orig, props, __ref: ref } = element
  const state = props?.state || orig
  if (isFunction(state)) {
    ref.__state = state
    return await exec(state, element)
  } else if (is(state)('string', 'number')) {
    ref.__state = state
    return { value: state }
  } else if (state === true) {
    ref.__state = element.key
    return {}
  } else if (state) {
    ref.__hasRootState = true
    return state
  } else {
    return false
  }
}

export const getRootStateInKey = (stateKey, parentState) => {
  if (!stateKey.includes('~/')) return
  const arr = stateKey.split('~/')
  if (arr.length > 1) return parentState.root
}

export const getParentStateInKey = (stateKey, parentState) => {
  if (!stateKey.includes('../')) return
  const arr = stateKey.split('../')
  const arrLength = arr.length - 1
  for (let i = 0; i < arrLength; i++) {
    if (!parentState.parent) return null
    parentState = parentState.parent
  }
  return parentState
}

export const getChildStateInKey = (stateKey, parentState, options = {}) => {
  const arr = stateKey.split('/')
  const arrLength = arr.length - 1
  for (let i = 0; i < arrLength; i++) {
    const childKey = arr[i]
    const grandChildKey = arr[i + 1]

    if (childKey === '__proto__' || grandChildKey === '__proto__') return

    let childInParent = parentState[childKey]
    if (!childInParent) childInParent = parentState[childKey] = {} // check for array
    if (!childInParent[grandChildKey]) childInParent[grandChildKey] = {} // check for array

    stateKey = grandChildKey
    parentState = childInParent
  }
  if (options.returnParent) return parentState
  return parentState[stateKey]
}

export const findInheritedState = (element, parent, options = {}) => {
  const ref = element.__ref
  let stateKey = ref.__state
  if (!checkIfInherits(element)) return

  const rootState = getRootStateInKey(stateKey, parent.state)
  let parentState = parent.state

  if (rootState) {
    parentState = rootState
    stateKey = stateKey.replaceAll('~/', '')
  } else {
    const findGrandParentState = getParentStateInKey(stateKey, parent.state)
    if (findGrandParentState) {
      parentState = findGrandParentState
      stateKey = stateKey.replaceAll('../', '')
    }
  }

  if (!parentState) return
  return getChildStateInKey(stateKey, parentState, options)
}

export const createInheritedState = (element, parent) => {
  const ref = element.__ref
  const inheritedState = findInheritedState(element, parent)
  if (isUndefined(inheritedState)) return element.state

  if (is(inheritedState)('object', 'array')) {
    return deepClone(inheritedState, { exclude: STATE_METHODS })
  } else if (is(inheritedState)('string', 'number', 'boolean')) {
    ref.__stateType = typeof inheritedState
    return { value: inheritedState }
  }

  console.warn(ref.__state, 'is not present. Replacing with', {})
}

export const checkIfInherits = element => {
  const { __ref: ref } = element
  const stateKey = ref.__state
  if (stateKey && is(stateKey)('number', 'string', 'boolean')) return true
  return false
}

export const isState = function (state) {
  if (!isObjectLike(state)) return false
  return Boolean(
    state.update &&
      state.parse &&
      state.clean &&
      state.create &&
      state.parent &&
      state.destroy &&
      state.rootUpdate &&
      state.parentUpdate &&
      state.keys &&
      state.values &&
      state.toggle &&
      state.replace &&
      state.quietUpdate &&
      state.quietReplace &&
      state.add &&
      state.apply &&
      state.applyReplace &&
      state.setByPath &&
      state.setPathCollection &&
      state.removeByPath &&
      state.removePathCollection &&
      state.getByPath &&
      state.applyFunction &&
      state.__element &&
      state.__children
  )
}

export const createNestedObjectByKeyPath = (path, value) => {
  if (!path) {
    return value || {}
  }
  const keys = path.split('/')
  const obj = {}
  let ref = obj
  keys.forEach((key, index) => {
    ref[key] = index === keys.length - 1 ? value || {} : {}
    ref = ref[key]
  })
  return obj
}

export const applyDependentState = (element, state) => {
  const { __element } = state //
  const origState = exec(__element?.state, element)
  if (!origState) return
  const dependentState = deepClone(origState, STATE_METHODS)
  const newDepends = { [element.key]: dependentState }

  const __depends = isObject(origState.__depends)
    ? { ...origState.__depends, ...newDepends }
    : newDepends

  if (Array.isArray(origState)) {
    addProtoToArray(origState, {
      ...Object.getPrototypeOf(origState),
      __depends
    })
  } else {
    Object.setPrototypeOf(origState, {
      ...Object.getPrototypeOf(origState),
      __depends
    })
  }

  return dependentState
}

export const overwriteState = (state, obj, options = {}) => {
  const { overwrite } = options
  if (!overwrite) return

  const shallow = overwrite === 'shallow'
  const merge = overwrite === 'merge'

  if (merge) {
    deepMerge(state, obj, STATE_METHODS)
    return
  }

  const overwriteFunc = shallow ? overwriteShallow : overwriteDeep
  overwriteFunc(state, obj, STATE_METHODS)
}
