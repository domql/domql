'use strict'

import { window } from '@domql/globals'
import { exec, isFunction, isNumber, isObject, isString, merge, overwriteDeep } from '@domql/utils'
import { applyEvent, triggerEventOn, triggerEventOnUpdate } from '@domql/event'
import { isMethod } from '@domql/methods'
import { createSnapshotId } from '@domql/key'
import { updateProps } from '@domql/props'
import { createState } from '@domql/state'

import { METHODS_EXL } from './utils'
import create from './create'
import { throughUpdatedDefine, throughUpdatedExec } from './iterate'
import { registry } from './mixins'
import { applyParam } from './applyParam'
import OPTIONS from './options'

const snapshot = {
  snapshotId: createSnapshotId
}

const UPDATE_DEFAULT_OPTIONS = {
  stackChanges: false,
  cleanExec: true,
  preventRecursive: false,
  currentSnapshot: false,
  calleeElement: false,
  excludes: METHODS_EXL
}

const update = function (params = {}, options = UPDATE_DEFAULT_OPTIONS) {
  const element = this
  const { parent, node, key } = element
  const { excludes, preventInheritAtCurrentState } = options

  if (preventInheritAtCurrentState && preventInheritAtCurrentState.__element === element) return
  if (!excludes) merge(options, UPDATE_DEFAULT_OPTIONS)

  let ref = element.__ref
  if (!ref) ref = element.__ref = {}

  const [snapshotOnCallee, calleeElement, snapshotHasUpdated] = captureSnapshot(element, options)
  if (snapshotHasUpdated) return

  if (isString(params) || isNumber(params)) {
    params = { text: params }
  }

  const ifFails = checkIfOnUpdate(element, parent, options)
  if (ifFails) return

  const inheritState = inheritStateUpdates(element, options)
  if (inheritState === false) return

  if (ref.__if && !options.preventPropsUpdate) {
    const hasParentProps = parent.props && (parent.props[key] || parent.props.childProps)
    const hasFunctionInProps = ref.__props.filter(v => isFunction(v))
    const props = params.props || hasParentProps || hasFunctionInProps.length
    if (props) updateProps(props, element, parent)
  }

  if (!options.preventInitUpdateListener) {
    const initUpdateReturns = triggerEventOnUpdate('initUpdate', params, element, options)
    if (initUpdateReturns === false) return element
  }

  triggerEventOn('beforeClassAssign', element, options)

  const overwriteChanges = overwriteDeep(element, params, METHODS_EXL)
  const execChanges = throughUpdatedExec(element, { ignore: UPDATE_DEFAULT_OPTIONS })
  const definedChanges = throughUpdatedDefine(element)

  if (options.stackChanges && element.__stackChanges) {
    const stackChanges = merge(definedChanges, merge(execChanges, overwriteChanges))
    element.__stackChanges.push(stackChanges)
  }

  if (!ref.__if) return false
  if (!node) {
    // return createNode(element, options)
    return
  }

  for (const param in element) {
    const prop = element[param]

    if (
      options.preventDefineUpdate === true ||
      options.preventDefineUpdate === param ||
      (options.preventContentUpdate && param === 'content') ||
      (options.preventStateUpdate && param) === 'state' ||
      isMethod(param) || isObject(registry[param]) || prop === undefined
    ) continue
    if (options.preventStateUpdate === 'once') options.preventStateUpdate = false

    const isElement = applyParam(param, element, options)
    if (isElement) {
      const { hasDefine, hasContextDefine } = isElement
      const canUpdate = isObject(prop) && !hasDefine && !hasContextDefine && !options.preventRecursive
      if (!canUpdate) continue

      const childUpdateCall = () => update.call(prop, params[prop], {
        ...options,
        currentSnapshot: snapshotOnCallee,
        calleeElement: calleeElement
      })

      if ((element.props && element.props.lazyLoad) || options.lazyLoad) {
        window.requestAnimationFrame(() => childUpdateCall())
      } else childUpdateCall()
    }
  }

  if (!options.preventUpdateListener) triggerEventOn('update', element, options)
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

  const snapshotOnCallee = ref.__currentSnapshot
  if (currentSnapshot < snapshotOnCallee) {
    return [snapshotOnCallee, calleeElement, true]
  }

  return [snapshotOnCallee, calleeElement]
}

const checkIfOnUpdate = (element, parent, options) => {
  if (!isFunction(element.if)) return

  const ref = element.__ref
  const ifPassed = element.if(element, element.state, element.context)
  const itWasFalse = ref.__if !== true

  if (ifPassed) {
    ref.__if = true
    if (itWasFalse) {
      delete element.__hash
      delete element.extend
      if (!ref.__hasRootState) {
        delete element.state
      }
      if (ref.__state) {
        element.state = ref.__state
      }
      const created = create(element, parent, element.key, OPTIONS.create)
      if (!options.preventUpdate && element.on && isFunction(element.on.update)) {
        applyEvent(element.on.update, created, created.state)
      }
      return created
    }
  } else if (element.node && !ifPassed) {
    element.node.remove()
    delete ref.__if
  }
}

const inheritStateUpdates = (element, options) => {
  const { __ref: ref } = element
  const stateKey = ref.__state
  const { parent, state } = element

  if (options.preventpdateTriggerStateUpdate) return

  if (!stateKey && !ref.__hasRootState) {
    element.state = (parent && parent.state) || {}
    return
  }

  const { isHoisted, execStateFunction, stateFunctionOverwrite } = options
  const shouldForceStateUpdate = isFunction(stateKey) && (!isHoisted && execStateFunction && stateFunctionOverwrite)
  if (shouldForceStateUpdate) {
    const execState = exec(stateKey, element)
    state.set(execState, {
      ...options,
      preventUpdate: true
    })
    return
  }

  const parentState = (parent && parent.state) || {}
  const keyInParentState = parentState[stateKey]

  if (!keyInParentState || options.preventInheritedStateUpdate) return

  if (!options.preventInitStateUpdateListener) {
    const initStateReturns = triggerEventOnUpdate('initStateUpdated', keyInParentState, element, options)
    if (initStateReturns === false) return element
  }

  const newState = createStateUpdate(element, parent, options)

  if (!options.preventStateUpdateListener) {
    triggerEventOnUpdate('stateUpdated', newState.parse(), element, options)
  }
}

const createStateUpdate = (element, parent, options) => {
  const __stateChildren = element.state.__children
  const newState = createState(element, parent)
  element.state = newState
  for (const child in __stateChildren) {
    // check this for inherited states
    if (newState[child]) newState.__children[child] = __stateChildren[child]
    __stateChildren[child].parent = newState
  }
  return newState
}

export default update
