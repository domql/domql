'use strict'

import {
  window,
  exec,
  isArray,
  isFunction,
  isNumber,
  isObject,
  isString,
  isUndefined,
  merge,
  overwriteDeep,
  createSnapshotId,
  deepClone,
  propertizeElement,
  isMethod,
  findInheritedState,
  deepMerge,
  OPTIONS,
  updateProps
} from '@domql/utils'

import { applyEvent, triggerEventOn, triggerEventOnUpdate } from '@domql/event'
import { createState } from '@domql/state'

import { create } from './create.js'
import {
  throughExecProps,
  throughUpdatedDefine,
  throughUpdatedExec
} from './iterate.js'
import { REGISTRY } from './mixins/index.js'
import { applyParam } from './utils/applyParam.js'
import { METHODS_EXL } from './utils/index.js' // old utils (current)

const snapshot = {
  snapshotId: createSnapshotId
}

const UPDATE_DEFAULT_OPTIONS = {
  stackChanges: false,
  cleanExec: true,
  preventRecursive: false,
  currentSnapshot: false,
  calleeElement: false,
  exclude: METHODS_EXL
}

export const update = async function (params = {}, opts) {
  const calleeElementCache = opts?.calleeElement
  const options = deepClone(
    isObject(opts)
      ? deepMerge(opts, UPDATE_DEFAULT_OPTIONS)
      : UPDATE_DEFAULT_OPTIONS,
    { exclude: ['calleeElement'] }
  )
  options.calleeElement = calleeElementCache
  const element = this
  const { parent, node, key } = element
  const { exclude, preventInheritAtCurrentState } = options

  let ref = element.__ref
  if (!ref) ref = element.__ref = {}
  const [snapshotOnCallee, calleeElement, snapshotHasUpdated] = captureSnapshot(
    element,
    options
  )
  if (snapshotHasUpdated) return

  if (!options.preventListeners) {
    await triggerEventOnUpdate('startUpdate', params, element, options)
  }

  if (
    preventInheritAtCurrentState &&
    preventInheritAtCurrentState.__element === element
  ) {
    return
  }
  if (!exclude) merge(options, UPDATE_DEFAULT_OPTIONS)

  if (isString(params) || isNumber(params)) {
    params = { text: params }
  }

  propertizeElement(params)

  const inheritState = await inheritStateUpdates(element, options)
  if (inheritState === false) return

  const ifFails = checkIfOnUpdate(element, parent, options)
  if (ifFails) return

  if (ref.__if && !options.preventPropsUpdate) {
    const hasParentProps =
      parent.props && (parent.props[key] || parent.props.childProps)
    const hasFunctionInProps = ref.__props.filter(v => isFunction(v))
    const props = params.props || hasParentProps || hasFunctionInProps.length
    if (props) updateProps(props, element, parent)
  }

  if (!options.preventBeforeUpdateListener && !options.preventListeners) {
    const beforeUpdateReturns = await triggerEventOnUpdate(
      'beforeUpdate',
      params,
      element,
      options
    )
    if (beforeUpdateReturns === false) return element
  }

  // apply new updates
  overwriteDeep(element, params, { exclude: METHODS_EXL })

  // exec updates
  throughExecProps(element)
  throughUpdatedExec(element, { ignore: UPDATE_DEFAULT_OPTIONS })
  throughUpdatedDefine(element)

  if (!options.isForced && !options.preventListeners) {
    triggerEventOn('beforeClassAssign', element, options)
  }

  if (!ref.__if) return false
  if (!node) {
    // return createNode(element, options)
    return
  }

  const {
    preventUpdate,
    preventDefineUpdate,
    preventContentUpdate,
    preventStateUpdate,
    preventRecursive,
    preventUpdateListener,
    preventUpdateAfter,
    preventUpdateAfterCount
  } = options

  if (preventUpdateAfter) {
    if (
      isNumber(preventUpdateAfterCount) &&
      preventUpdateAfter <= preventUpdateAfterCount
    ) {
      return
    } else if (options.preventUpdateAfterCount === undefined) {
      options.preventUpdateAfterCount = 1
    } else options.preventUpdateAfterCount++
  }

  for (const param in element) {
    const prop = element[param]

    if (!Object.hasOwnProperty.call(element, param)) continue

    const isInPreventUpdate =
      isArray(preventUpdate) && preventUpdate.includes(param)
    const isInPreventDefineUpdate =
      isArray(preventDefineUpdate) && preventDefineUpdate.includes(param)

    const hasCollection =
      element.$collection ||
      element.$stateCollection ||
      element.$propsCollection

    if (
      isUndefined(prop) ||
      isInPreventUpdate ||
      isInPreventDefineUpdate ||
      preventDefineUpdate === true ||
      preventDefineUpdate === param ||
      (preventContentUpdate && param === 'content' && !hasCollection) ||
      (preventStateUpdate && param) === 'state' ||
      isMethod(param, element) ||
      isObject(REGISTRY[param])
    ) {
      continue
    }

    if (preventStateUpdate === 'once') options.preventStateUpdate = false

    const isElement = applyParam(param, element, options)
    if (isElement) {
      const { hasDefine, hasContextDefine } = isElement
      const canUpdate =
        isObject(prop) && !hasDefine && !hasContextDefine && !preventRecursive
      if (!canUpdate) continue

      const lazyLoad = element.props.lazyLoad || options.lazyLoad

      if (options.onEachUpdate) {
        options.onEachUpdate(param, element, element.state, element.context)
      }

      const childUpdateCall = () =>
        update.call(prop, params[prop], {
          ...options,
          currentSnapshot: snapshotOnCallee,
          calleeElement
        })

      if (lazyLoad) {
        window.requestAnimationFrame(() => {
          // eslint-disable-line
          childUpdateCall()
          // handle lazy load
          if (!options.preventUpdateListener) {
            triggerEventOn('lazyLoad', element, options)
          }
        })
      } else childUpdateCall()
    }
  }

  if (!preventUpdateListener) triggerEventOn('update', element, options)
}

const captureSnapshot = (element, options) => {
  const ref = element.__ref

  const { currentSnapshot, calleeElement } = options
  const isCallee = calleeElement === element
  if (!calleeElement || isCallee) {
    const createdStanpshot = snapshot.snapshotId()
    ref.__currentSnapshot = createdStanpshot
    return [createdStanpshot, element]
  }

  const snapshotOnCallee = calleeElement.__ref.__currentSnapshot

  if (currentSnapshot < snapshotOnCallee) {
    return [snapshotOnCallee, calleeElement, true]
  }

  return [snapshotOnCallee, calleeElement]
}

const checkIfOnUpdate = (element, parent, options) => {
  if ((!isFunction(element.if) && !isFunction(element.props?.if)) || !parent) {
    return
  }

  const ref = element.__ref
  const ifPassed = (element.if || element.props?.if)(
    element,
    element.state,
    element.context,
    options
  )
  const itWasFalse = ref.__if !== true

  if (ifPassed) {
    ref.__if = true
    if (itWasFalse) {
      delete element.__hash
      delete element.__text
      delete element.extends
      if (!ref.__hasRootState) {
        delete element.state
      }

      if (ref.__state) {
        element.state = ref.__state
      } else if (!ref.__hasRootState) {
        delete element.state
      }

      if (element.node) {
        element.node.remove()
        delete element.node
      }

      const contentKey = ref.contentElementKey

      if (
        element.$collection ||
        element.$stateCollection ||
        element.$propsCollection
      ) {
        element.removeContent()
      } else if (element[contentKey]?.parseDeep) {
        element[contentKey] = element[contentKey].parseDeep()
      }

      const previousElement = element.previousElement()
      const previousNode = previousElement?.node // document.body.contains(previousElement.node)
      const hasPrevious = previousNode?.parentNode // document.body.contains(previousElement.node)

      const nextElement = element.nextElement()
      const nextNode = nextElement?.node // document.body.contains(previousElement.node)
      const hasNext = nextNode?.parentNode // && document.body.contains(nextElement.node)
      // const hasNext = nextElement && document.body.contains(nextElement.node)

      const attachOptions = (hasPrevious || hasNext) && {
        position: hasPrevious ? 'after' : hasNext ? 'before' : null,
        node: (hasPrevious && previousNode) || (hasNext && nextNode)
      }

      delete element.__ref
      delete element.parent
      const createdElement = create(
        element,
        parent,
        element.key,
        OPTIONS.create,
        attachOptions
      )
      // check preventUpdate for an array (Line: 87)
      if (
        options.preventUpdate !== true &&
        element.on &&
        isFunction(element.on.update)
      ) {
        applyEvent(element.on.update, createdElement, createdElement.state)
      }
      return createdElement
    }
  } else if (element.node && !ifPassed) {
    element.node.remove()
    delete ref.__if
  }
}

/**
 * Inherit state updates for a given element based on the specified options.
 *
 * @param {Object} element - The element to inherit state updates for.
 * @param {Object} options - Configuration options for state update inheritance.
 * @param {boolean} [options.preventUpdateTriggerStateUpdate] - If true, prevent triggering state updates.
 * @param {boolean} [options.isHoisted] - Whether the state is hoisted.
 * @param {boolean} [options.execStateFunction] - Execute the state functions.
 * @param {boolean} [options.stateFunctionOverwrite] - If true, overwrite (not merge) current state with what function returns.
 * @param {boolean} [options.preventInheritedStateUpdate] - If true, prevent inheriting state updates.
 * @param {boolean} [options.preventBeforeStateUpdateListener] - If true, prevent the 'beforeStateUpdate' event listener.
 * @param {boolean} [options.preventStateUpdateListener] - If true, prevent the 'stateUpdate' event listener.
 * @returns {boolean} - If returns false, it breaks the update function
 */
const inheritStateUpdates = async (element, options) => {
  const { __ref: ref } = element
  const stateKey = ref.__state
  const { parent, state } = element
  const { preventUpdateTriggerStateUpdate, isHoisted, execStateFunction } =
    options

  if (preventUpdateTriggerStateUpdate) return

  // If does not have own state inherit from parent
  if (!stateKey && !ref.__hasRootState) {
    element.state = (parent && parent.state) || {}
    return
  }

  // If state is function, decide execution and apply setting a current state
  const shouldForceFunctionState =
    isFunction(stateKey) && !isHoisted && execStateFunction
  if (shouldForceFunctionState) {
    const execState = exec(stateKey, element)
    state.set(execState, {
      ...options,
      preventUpdate: true,
      preventStateUpdateListener: false,
      updatedByStateFunction: true
    })
    return
  }

  // If state is string, find its value in the state tree
  const keyInParentState = findInheritedState(element, element.parent)
  if (!keyInParentState || options.preventInheritedStateUpdate) return

  // Trigger on.beforeStateUpdate event
  if (!options.preventBeforeStateUpdateListener && !options.preventListeners) {
    const initStateReturns = await triggerEventOnUpdate(
      'beforeStateUpdate',
      keyInParentState,
      element,
      options
    )
    if (initStateReturns === false) return element
  }

  // Recreate the state again
  const newState = await createStateUpdate(element, parent, options)

  // Trigger on.stateUpdate event
  if (!options.preventStateUpdateListener && !options.preventListeners) {
    await triggerEventOnUpdate(
      'stateUpdate',
      newState.parse(),
      element,
      options
    )
  }
}

const createStateUpdate = (element, parent, options) => {
  const __stateChildren = element.state.__children
  const newState = createState(element, parent)
  element.state = newState
  for (const child in __stateChildren) {
    // check this for inherited states
    if (newState[child]) newState.__children[child] = __stateChildren[child]
    // __stateChildren[child].parent = newState
    Object.getPrototypeOf(__stateChildren[child]).parent = newState
  }
  return newState
}

export default update

// save updates history
// const overwriteChanges = overwriteDeep(element, params, { exclude: METHODS_EXL })
// // const overwriteChanges = overwriteDeep(element, params)
// const propsChanges = throughExecProps(element)
// const execChanges = throughUpdatedExec(element, { ignore: UPDATE_DEFAULT_OPTIONS })
// const definedChanges = throughUpdatedDefine(element)
// if (options.stackChanges && ref.__stackChanges) {
//   const stackChanges = merge(definedChanges, merge(execChanges, overwriteChanges))
//   ref.__stackChanges.push(stackChanges)
// }
