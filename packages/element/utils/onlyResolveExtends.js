'use strict'

import {
  exec,
  initProps,
  isFunction,
  isMethod,
  isObject,
  isUndefined
} from '@domql/utils'
import { create } from '..'
import { REGISTRY } from '../mixins/index.js'
import { addMethods } from '../methods/set'
import { createState } from '@domql/state'
import { detectTag } from '@domql/render'
import { throughInitialDefine, throughInitialExec } from '../iterate'

export const onlyResolveExtends = (element, parent, key, options) => {
  const { __ref } = element
  element.tag = detectTag(element)

  // if (!element.props) element.props = {}

  // Copy-paste of addCaching()
  {
    const { __ref: ref } = element
    // const { __ref: parentRef } = parent

    // enable TRANSFORM in data
    // TODO: do we need this at all?

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

    // Add root element property
    // const hasRoot = parent && parent.key === ':root'
    // if (!ref.root) ref.root = hasRoot ? element : parentRef.root
  }

  addMethods(element, parent, options)

  createState(element, parent)

  // Borrowed from createIfConditionFlag()
  const ref = __ref
  if (isFunction(element.if)) {
    const ifPassed = element.if(element, element.state, element.context)
    if (!ifPassed) {
      // const ifFragment = cacheNode({ tag: 'fragment' })
      // ref.__ifFragment = appendNode(ifFragment, parent.node)
      delete ref.__if
    } else ref.__if = true
  } else ref.__if = true
  /// ///

  if (element.node && ref.__if) {
    parent[key || element.key] = element
  } // Borrowed from assignNode()

  initProps(element, parent, options)

  if (element.tag !== 'string' && element.tag !== 'fragment') {
    throughInitialDefine(element)
    throughInitialExec(element)

    for (const param in element) {
      const prop = element[param]
      if (
        isUndefined(prop) ||
        isMethod(param, element) ||
        isObject(REGISTRY[param])
      ) {
        continue
      }

      const hasDefine = element.define && element.define[param]
      const contextHasDefine =
        element.context &&
        element.context.define &&
        element.context.define[param]
      const optionsHasDefine = options.define && options.define[param]

      if (REGISTRY[param] && !optionsHasDefine) {
        continue
      } else if (
        element[param] &&
        !hasDefine &&
        !optionsHasDefine &&
        !contextHasDefine
      ) {
        create(exec(prop, element), element, param, options)
      }
    }
  }

  parent[key || element.key] = element // Borrowed from assignNode()

  delete element.update
  delete element.__element

  // added by initProps
  if (element.props) {
    delete element.props.update
    delete element.props.__element
  }

  // added by createState
  if (!options.keepRef) delete element.__ref

  return element
}
