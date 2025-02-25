'use strict'

import {
  isArray,
  deepClone,
  isFunction,
  isObject,
  isString,
  removeFromArray,
  removeFromObject,
  overwriteDeep,
  createNestedObject,
  getInObjectByPath,
  removeNestedKeyByPath,
  setInObjectByPath,
  STATE_METHODS,
  addProtoToArray
} from '@domql/utils'

import { updateState } from './updateState.js'
import { createState } from './create.js'

export const parse = function () {
  const state = this
  if (isObject(state)) {
    const obj = {}
    for (const param in state) {
      if (!STATE_METHODS.includes(param)) {
        obj[param] = state[param]
      }
    }
    return obj
  } else if (isArray(state)) {
    return state.filter(item => !STATE_METHODS.includes(item))
  }
}

export const clean = function (options = {}) {
  const state = this
  for (const param in state) {
    if (
      !STATE_METHODS.includes(param) &&
      Object.hasOwnProperty.call(state, param)
    ) {
      delete state[param]
    }
  }
  if (!options.preventStateUpdate) {
    state.update(state, { replace: true, ...options })
  }
  return state
}

export const destroy = function (options = {}) {
  const state = this
  const element = state.__element

  const stateKey = element.__ref.__state
  if (isString(stateKey)) {
    element.parent.state.remove(stateKey, { isHoisted: true, ...options })
    return element.state
  }

  delete element.state
  element.state = state.parent

  if (state.parent) {
    delete state.parent.__children[element.key]
  }

  if (state.__children) {
    for (const key in state.__children) {
      const child = state.__children[key]
      if (child.state) {
        if (isArray(child.state)) {
          Object.defineProperty(child.state, 'parent', {
            value: state.parent,
            enumerable: false, // Set this to true if you want the method to appear in for...in loops
            configurable: true, // Set this to true if you want to allow redefining/removing the property later
            writable: true // Set this to true if you want to allow changing the function later
          })
        } else {
          Object.setPrototypeOf(child, { parent: state.parent })
        }
      }
    }
  }

  element.state.update({}, { isHoisted: true, ...options })
  return element.state
}

export const parentUpdate = function (obj, options = {}) {
  const state = this
  if (!state || !state.parent) return
  return state.parent.update(obj, { isHoisted: true, ...options })
}

export const rootUpdate = function (obj, options = {}) {
  const state = this
  if (!state) return
  const rootState = state.__element.__ref.root.state
  return rootState.update(obj, { isHoisted: false, ...options })
}

export const add = function (value, options = {}) {
  const state = this
  if (isArray(state)) {
    state.push(value)
    state.update(state.parse(), { overwrite: true, ...options })
  } else if (isObject(state)) {
    const key = Object.keys(state).length
    state.update({ [key]: value }, options)
  }
}

export const toggle = function (key, options = {}) {
  const state = this
  state.update({ [key]: !state[key] }, options)
}

export const remove = function (key, options = {}) {
  const state = this
  if (isArray(state)) removeFromArray(state, key)
  if (isObject(state)) removeFromObject(state, key)
  if (options.applyReset) {
    return state.set(state.parse(), { replace: true, ...options })
  }
  return state.update({}, options)
}

export const set = function (val, options = {}) {
  const state = this
  const value = deepClone(val)
  return state
    .clean({ preventStateUpdate: true, ...options })
    .update(value, { replace: true, ...options })
}

export const setByPath = function (path, val, options = {}) {
  const state = this
  const value = deepClone(val)
  setInObjectByPath(state, path, val)
  const update = createNestedObject(path, value)
  if (options.preventStateUpdate) return update
  return state.update(update, options)
}

export const setPathCollection = function (changes, options = {}) {
  const state = this
  const update = changes.reduce((acc, change) => {
    if (change[0] === 'update') {
      const result = setByPath.call(state, change[1], change[2], {
        preventStateUpdate: true
      })
      return overwriteDeep(acc, result)
    } else if (change[0] === 'delete') {
      removeByPath.call(state, change[1], options)
    }
    return acc
  }, {})
  return state.update(update, options)
}

export const removeByPath = function (path, options = {}) {
  const state = this
  removeNestedKeyByPath(state, path)
  if (options.preventUpdate) return path
  return state.update({}, options)
}

export const removePathCollection = function (changes, options = {}) {
  const state = this
  changes.forEach(item => {
    removeByPath(item, { preventUpdate: true })
  })
  return state.update({}, options)
}

export const getByPath = function (path, options = {}) {
  const state = this
  return getInObjectByPath(state, path)
}

export const reset = function (options = {}) {
  const state = this
  const value = deepClone(state.parse())
  return state.set(value, { replace: true, ...options })
}

export const apply = function (func, options = {}) {
  const state = this
  if (isFunction(func)) {
    const value = func(state)
    return state.update(value, { replace: true, ...options })
  }
}

export const applyReplace = function (func, options = {}) {
  const state = this
  if (isFunction(func)) {
    const value = func(state)
    return state.replace(value, options)
  }
}

export const applyFunction = function (func, options = {}) {
  const state = this
  if (isFunction(func)) {
    func(state)
    return state.update(state.parse(), { replace: true, ...options })
  }
}

export const quietUpdate = function (obj, options = {}) {
  const state = this
  return state.update(obj, { preventUpdate: true, ...options })
}

export const replace = function (obj, options = {}) {
  const state = this

  for (const param in obj) {
    state[param] = obj[param]
  }

  return state.update(obj, options)
}

export const quietReplace = function (obj, options = {}) {
  const state = this
  return state.replace(obj, { preventUpdate: true, ...options })
}

export const keys = function (obj, options = {}) {
  const state = this
  return Object.keys(state)
}

export const values = function (obj, options = {}) {
  const state = this
  return Object.values(state)
}

export const applyStateMethods = element => {
  const state = element.state
  const ref = element.__ref

  const proto = {
    clean: clean.bind(state),
    parse: parse.bind(state),
    destroy: destroy.bind(state),
    update: updateState.bind(state),
    rootUpdate: rootUpdate.bind(state),
    parentUpdate: parentUpdate.bind(state),
    create: createState.bind(state),
    add: add.bind(state),
    toggle: toggle.bind(state),
    remove: remove.bind(state),
    apply: apply.bind(state),
    applyReplace: applyReplace.bind(state),
    applyFunction: applyFunction.bind(state),
    set: set.bind(state),
    quietUpdate: quietUpdate.bind(state),
    replace: replace.bind(state),
    quietReplace: quietReplace.bind(state),
    reset: reset.bind(state),
    parent: element.parent.state || state,

    setByPath: setByPath.bind(state),
    setPathCollection: setPathCollection.bind(state),
    removeByPath: removeByPath.bind(state),
    removePathCollection: removePathCollection.bind(state),
    getByPath: getByPath.bind(state),

    keys: keys.bind(state),
    values: values.bind(state),
    __element: element,
    __children: {},
    root: ref.root ? ref.root.state : state
  }

  if (isArray(state)) {
    addProtoToArray(state, proto)
  } else {
    Object.setPrototypeOf(state, proto)
  }

  if (state.parent && state.parent.__children) {
    state.parent.__children[element.key] = state
  }
}
