'use strict'

import { DOMQ_PROPERTIES, PROPS_METHODS } from './keys.js'
import { addEventFromProps } from './events.js'
import { deepClone, deepMerge, exec } from './object.js'
import { is, isArray, isFunction, isObject, isObjectLike } from './types.js'

export const createProps = (element, parent, key) => {
  const { props, __ref: ref } = element
  ref.__propsStack = []
  // if (props !== undefined) ref.__initialProps = props
  if (props) ref.__initialProps = props
  else return {}
  if (!isObjectLike(props)) {
    ref.__propsStack.push(props)
    return {}
  }
  return { ...props }
}

export function pickupPropsFromElement (element, opts = {}) {
  const cachedKeys = opts.cachedKeys || []

  for (const key in element) {
    const value = element[key]

    const hasDefine = isObject(element.define?.[key])
    const hasGlobalDefine = isObject(element.context?.define?.[key])
    const isElement = /^[A-Z]/.test(key) || /^\d+$/.test(key)
    const isBuiltin = DOMQ_PROPERTIES.includes(key)

    // If it's not a special case, move to props
    if (!isElement && !isBuiltin && !hasDefine && !hasGlobalDefine) {
      element.props[key] = value
      delete element[key]
      cachedKeys.push(key)
    }
  }

  return element
}

export function pickupElementFromProps (element, opts) {
  const cachedKeys = opts.cachedKeys || []

  for (const key in element.props) {
    const value = element.props[key]

    // Handle event handlers
    const isEvent = key.startsWith('on') && key.length > 2
    const isFn = isFunction(value)

    if (isEvent && isFn) {
      addEventFromProps(key, element)
      delete element.props[key]
      continue
    }

    // Skip if key was originally from element
    if (cachedKeys.includes(key)) continue

    const hasDefine = isObject(element.define?.[key])
    const hasGlobalDefine = isObject(element.context?.define?.[key])
    const isElement = /^[A-Z]/.test(key) || /^\d+$/.test(key)
    const isBuiltin = DOMQ_PROPERTIES.includes(key)

    // Move qualifying properties back to element root
    if (isElement || isBuiltin || hasDefine || hasGlobalDefine) {
      element[key] = value
      delete element.props[key]
    }
  }

  return element
}

// Helper function to maintain compatibility with original propertizeElement
export function propertizeElement (element, opts = {}) {
  const cachedKeys = []
  pickupPropsFromElement(element, { cachedKeys })
  pickupElementFromProps(element, { cachedKeys })
  return element
}

export const objectizeStringProperty = propValue => {
  if (is(propValue)('string', 'number')) {
    return { inheritedString: propValue }
  }
  return propValue
}

export const propExists = (prop, stack) => {
  if (!prop || !stack.length) return false
  const key = isObject(prop) ? JSON.stringify(prop) : prop
  return stack.some(existing => {
    const existingKey = isObject(existing) ? JSON.stringify(existing) : existing
    return existingKey === key
  })
}

export const inheritParentProps = (element, parent) => {
  const { __ref: ref } = element
  const propsStack = ref.__propsStack || []
  const parentProps = parent.props

  if (!parentProps) return propsStack

  const matchParentKeyProps = parentProps[element.key]
  const matchParentChildProps = parentProps.childProps

  // Order matters: key-specific props should be added after childProps
  const ignoreChildProps = element.props?.ignoreChildProps
  if (matchParentChildProps && !ignoreChildProps) {
    const childProps = objectizeStringProperty(matchParentChildProps)
    propsStack.unshift(childProps)
  }

  if (matchParentKeyProps) {
    const keyProps = objectizeStringProperty(matchParentKeyProps)
    propsStack.unshift(keyProps)
  }

  return propsStack
}

export function update (props, options) {
  const element = this.__element
  element.update({ props }, options)
}

export function setPropsPrototype (element) {
  const methods = { update: update.bind(element.props), __element: element }
  Object.setPrototypeOf(element.props, methods)
}

export const removeDuplicateProps = propsStack => {
  const seen = new Set()

  return propsStack.filter(prop => {
    if (!prop || PROPS_METHODS.includes(prop)) return false
    const key = isObject(prop) ? JSON.stringify(prop) : prop
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export const syncProps = (propsStack, element, opts) => {
  // Clean up duplicates from propsStack
  // const uniquePropsStack = removeDuplicateProps(propsStack)
  // element.__ref.__propsStack = propsStack // uniquePropsStack
  element.props = propsStack.reduce((mergedProps, v) => {
    if (PROPS_METHODS.includes(v)) return mergedProps
    while (isFunction(v)) v = exec(v, element)
    return deepMerge(mergedProps, deepClone(v, { exclude: PROPS_METHODS }))
  }, {})
  setPropsPrototype(element)
  return element.props
}

export const createPropsStack = (element, parent) => {
  const { props, __ref: ref } = element

  // Start with parent props
  let propsStack = ref.__propsStack || []

  // Get parent props
  if (parent && parent.props) {
    const parentStack = inheritParentProps(element, parent)
    propsStack = [...parentStack]
  }

  // Add current props
  if (isObject(props)) propsStack.push(props)
  else if (props === 'inherit' && parent?.props) propsStack.push(parent.props)
  else if (props) propsStack.push(props)

  // Add extends props
  if (isArray(ref.__extendsStack)) {
    ref.__extendsStack.forEach(_extends => {
      if (_extends.props && _extends.props !== props) {
        propsStack.push(_extends.props)
      }
    })
  }

  // Remove duplicates and update reference
  ref.__propsStack = removeDuplicateProps(propsStack)
  return ref.__propsStack
}

export const applyProps = (element, parent) => {
  const { __ref: ref } = element

  // Create a fresh props stack
  const propsStack = createPropsStack(element, parent)

  // Update the element
  if (propsStack.length) {
    syncProps(propsStack, element)
  } else {
    ref.__propsStack = []
    element.props = {}
  }
}

export const initProps = function (element, parent, options) {
  const { __ref: ref } = element

  if (ref.__if) applyProps(element, parent)
  else {
    try {
      applyProps(element, parent)
    } catch {
      element.props = {}
      ref.__propsStack = []
    }
  }

  setPropsPrototype(element)

  return element
}

export const updateProps = (newProps, element, parent) => {
  const { __ref: ref } = element
  const propsStack = ref.__propsStack || []

  // Create a new array to avoid mutating the original
  let newStack = [...propsStack]

  // Add parent props first if they exist
  const parentProps = inheritParentProps(element, parent)
  if (parentProps.length) {
    newStack = [...parentProps, ...newStack]
  }

  // Add new props if they exist
  if (newProps) {
    newStack = [newProps, ...newStack]
  }

  // Clean up duplicates
  ref.__propsStack = removeDuplicateProps(newStack)

  if (ref.__propsStack.length) {
    syncProps(ref.__propsStack, element)
  }

  return element
}
