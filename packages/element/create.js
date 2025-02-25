'use strict'

import { createNode } from './node.js'
import { ROOT } from './tree.js'

import {
  isObject,
  exec,
  isUndefined,
  detectInfiniteLoop,
  propertizeElement,
  createElement,
  applyExtends,
  createScope,
  isMethod,
  OPTIONS,
  initProps
} from '@domql/utils'

import { applyAnimationFrame, triggerEventOn } from '@domql/event'
import { assignNode } from '@domql/render'
import { createState } from '@domql/state'

import { REGISTRY } from './mixins/index.js'
import { addMethods } from './methods/set.js'
import { assignKeyAsClassname } from './mixins/classList.js'
import { throughInitialExec, throughInitialDefine } from './iterate.js'
import { createIfConditionFlag } from '../utils/if.js'

const ENV = process.env.NODE_ENV

/**
 * Creating a DOMQL element using passed parameters
 */
export const create = async (
  props,
  parentEl,
  passedKey,
  options = OPTIONS.create || {},
  attachOptions
) => {
  cacheOptions(options)

  const element = createElement(props, parentEl, passedKey, options, ROOT)
  if (!element) return

  const { key, parent, __ref: ref } = element

  applyExtends(element, parent, options)

  propertizeElement(element, parent)

  await triggerEventOn('start', element, options)

  if (options.onlyResolveExtends) {
    return onlyResolveExtends(element, parent, key, options)
  }

  switchDefaultOptions(element, parent, options)

  addMethods(element, parent, options)

  createScope(element, parent)

  await createState(element, parent)
  if (element.scope === 'state') element.scope = element.state

  createIfConditionFlag(element, parent)

  // apply props settings
  initProps(element, parent, options)
  if (element.scope === 'props' || element.scope === true) {
    element.scope = element.props
  }

  // recatch if it passess props again
  createIfConditionFlag(element, parent)

  // if it already HAS a NODE
  if (element.node) {
    if (ref.__if) return assignNode(element, parent, key, attachOptions)
  }

  // apply variants
  // applyVariant(element, parent)

  const onInit = await triggerEventOn('init', element, options)
  if (onInit === false) return element

  triggerEventOn('beforeClassAssign', element, options)

  // generate a CLASS name
  assignKeyAsClassname(element)

  await renderElement(element, parent, options, attachOptions)

  addElementIntoParentChildren(element, parent)

  await triggerEventOn('complete', element, options)

  return element
}

const cacheOptions = options => {
  if (options && !OPTIONS.create) {
    OPTIONS.create = options
    OPTIONS.create.context = options.context
  }
}

const switchDefaultOptions = (element, parent, options) => {
  if (Object.keys(options).length) {
    OPTIONS.defaultOptions = options
    if (options.ignoreChildExtends) delete options.ignoreChildExtends
  }
}

const addElementIntoParentChildren = (element, parent) => {
  if (parent.__ref && parent.__ref.__children) {
    parent.__ref.__children.push(element.key)
  }
}

const visitedElements = new WeakMap()
const renderElement = async (element, parent, options, attachOptions) => {
  if (visitedElements.has(element)) {
    if (ENV === 'test' || ENV === 'development') {
      console.warn('Cyclic rendering detected:', element.__ref.path)
    }
  }

  visitedElements.set(element, true)

  const { __ref: ref, key } = element

  const createNestedChild = async () => {
    const isInfiniteLoopDetected = detectInfiniteLoop(ref.path)
    if (ref.__uniqId || isInfiniteLoopDetected) return
    // console.log(element)
    await createNode(element, options)
    ref.__uniqId = Math.random()
  }

  // CREATE a real NODE
  if (ENV === 'test' || ENV === 'development') {
    await createNestedChild()
  } else {
    try {
      await createNestedChild()
    } catch (e) {
      const path = ref.path
      if (path.includes('ComponentsGrid')) {
        path.splice(0, path.indexOf('ComponentsGrid') + 2)
      }
      if (path.includes('demoComponent')) {
        path.splice(0, path.indexOf('demoComponent') + 1)
      }
      const isDemoComponent = element.lookup(el => el.state.key)?.state?.key
      element.warn(
        'Error happened in:',
        isDemoComponent ? isDemoComponent + ' ' : '' + path.join('.')
      )
      element.verbose()
      element.error(e, options)
      if (element.on?.error) {
        element.on.error(e, element, element.state, element.context, options)
      }
      if (element.props?.onError) {
        element.props.onError(
          e,
          element,
          element.state,
          element.context,
          options
        )
      }
    }
  }

  if (!ref.__if) {
    parent[key || element.key] = element
    return element
  }

  // assign NODE
  assignNode(element, parent, key, attachOptions)

  // apply events
  applyAnimationFrame(element, options)

  // run `on.render`
  await triggerEventOn('render', element, options)
  // triggerEventOn('render', element, options).then(() => {})

  // run `on.renderRouter`
  await triggerEventOn('renderRouter', element, options)

  // run `on.done`
  await triggerEventOn('done', element, options)

  // run `on.done`
  await triggerEventOn('create', element, options)
}

const onlyResolveExtends = (element, parent, key, options) => {
  const { __ref: ref } = element

  addMethods(element, parent, options)

  createScope(element, parent)

  createState(element, parent)
  if (element.scope === 'state') element.scope = element.state

  createIfConditionFlag(element, parent)

  // apply props settings
  initProps(element, parent, options)
  if (element.scope === 'props' || element.scope === true) {
    element.scope = element.props
  }

  if (element.node && ref.__if) {
    parent[key || element.key] = element
  } // Borrowed from assignNode()

  if (!element.props) element.props = {}
  // applyVariant(element, parent)

  addElementIntoParentChildren(element, parent)

  if (element.tag !== 'string' && element.tag !== 'fragment') {
    throughInitialDefine(element)
    throughInitialExec(element)

    for (const k in element) {
      if (
        isUndefined(element[k]) ||
        isMethod(k, element) ||
        isObject(REGISTRY[k])
      ) {
        continue
      }

      const hasDefine = element.define && element.define[k]
      const contextHasDefine =
        element.context && element.context.define && element.context.define[k]
      const optionsHasDefine = options.define && options.define[k]

      if (!ref.__skipCreate && REGISTRY[k] && !optionsHasDefine) {
        continue
      } else if (
        element[k] &&
        !hasDefine &&
        !optionsHasDefine &&
        !contextHasDefine
      ) {
        create(exec(element[k], element), element, k, options)
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

  return element
}

// const checkIfMedia = (key) => key.slice(0, 1) === '@'

// const applyMediaProps = (element, parent, key) => {
//   const { props } = element
//   if (props) {
//     props.display = 'none'
//     if (props[key]) props[key].display = props.display
//     else props[key] = { display: props.display || 'block' }
//     return element
//   } else {
//     return {
//       ...element,
//       props: {
//         display: 'none',
//         [key]: { display: 'block' }
//       }
//     }
//   }
// }

export default create
