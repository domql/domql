'use strict'

import { createExtends } from './extends.js'
import { createKey } from './key.js'
import { isNode } from './node.js'
import { createProps } from './props.js'
import { HTML_TAGS } from './tags.js'
import { is, isFunction } from './types.js'

const ENV = process.env.NODE_ENV

export const returnValueAsText = (element, parent, key) => {
  const childExtendsTag = parent.childExtends && parent.childExtends.tag
  const childPropsTag = parent.props.childProps && parent.props.childProps.tag
  const isKeyValidHTMLTag = HTML_TAGS.body.indexOf(key) > -1 && key
  return {
    text: element,
    tag: childExtendsTag || childPropsTag || isKeyValidHTMLTag || 'string'
  }
}

export const createBasedOnType = (element, parent, key) => {
  // if ELEMENT is not given
  if (element === undefined) {
    if (ENV === 'test' || ENV === 'development') {
      console.warn(
        key,
        'element is undefined in',
        parent && parent.__ref && parent.__ref.path
      )
    }
    return {}
  }

  if (element === null) return
  if (element === true) return {}

  if (is(element)('string', 'number')) {
    return returnValueAsText(element, parent, key)
  }

  if (isFunction(element)) {
    return { props: element }
  }

  return element
}

export const addRef = (element, parent) => {
  const ref = {}
  ref.origin = element
  ref.parent = parent
  return ref
}

export const createParent = (element, parent, key, options, root) => {
  if (!parent) return root
  if (isNode(parent)) {
    const parentNodeWrapper = { key: ':root', node: parent }
    root[`${key}_parent`] = parentNodeWrapper
    return parentNodeWrapper
  }
  return parent
}

export const createRoot = (element, parent) => {
  const { __ref: ref } = element
  const { __ref: parentRef } = parent

  const hasRoot = parent && parent.key === ':root'
  if (!ref?.root) {
    return hasRoot ? element : parentRef?.root
  }
}

export const createPath = (element, parent, key) => {
  let { __ref: parentRef } = parent
  // set the PATH array
  if (!parentRef) parentRef = parent.ref = {}
  if (!parentRef.path) parentRef.path = []
  return parentRef.path.concat(key)
}

export const addContext = (element, parent, key, options, root) => {
  const forcedOptionsContext =
    options.context && !root.context && !element.context
  if (forcedOptionsContext) root.context = options.context

  // inherit from parent or root
  return options.context || parent.context || root.context || element.context
}

export const addCaching = (element, parent, key) => {
  const ref = addRef(element, parent)

  element.__ref = ref

  // enable CACHING
  if (!ref.__cached) ref.__cached = {}
  if (!ref.__defineCache) ref.__defineCache = {}

  // enable EXEC
  if (!ref.__exec) ref.__exec = {}
  if (!ref.__execProps) ref.__execProps = {}

  // enable CLASS CACHING
  if (!ref.__class) ref.__class = {}
  if (!ref.__classNames) ref.__classNames = {}

  // enable CLASS CACHING
  if (!ref.__attr) ref.__attr = {}

  // enable CHANGES storing
  if (!ref.__changes) ref.__changes = []

  // enable CHANGES storing
  if (!ref.__children) ref.__children = []

  ref.__extends = createExtends(element, parent, key)
  ref.path = createPath(element, parent, key)
  ref.root = createRoot(element, parent) // Call createRoot after addCaching

  return ref
}

export const createElement = (passedProps, parentEl, passedKey, opts, root) => {
  const hashed = passedProps?.__hash
  const element = hashed
    ? { extends: [passedProps] }
    : createBasedOnType(passedProps, parentEl, passedKey)
  if (!element) return

  const parent = createParent(element, parentEl, passedKey, opts, root)
  const key = createKey(element, parent, passedKey)

  addCaching(element, parent, key)

  const props = createProps(element, parent, key)
  const context = addContext(element, parent, key, opts, root)
  const on = element.on || {}

  return {
    ...element,
    key,
    props,
    parent,
    context,
    on
  }
}
