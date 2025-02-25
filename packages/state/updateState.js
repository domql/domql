'use strict'

import { report } from '@domql/report'
import { triggerEventOnUpdate } from '@domql/event'
import {
  checkIfInherits,
  createNestedObjectByKeyPath,
  findInheritedState,
  getParentStateInKey,
  getRootStateInKey,
  merge,
  overwriteDeep,
  overwriteState
} from '@domql/utils'

const STATE_UPDATE_OPTIONS = {
  overwrite: true,
  preventHoistElementUpdate: false,
  updateByState: true,
  isHoisted: true,
  execStateFunction: true
}

export const updateState = async function (
  obj,
  options = STATE_UPDATE_OPTIONS
) {
  const state = this
  const element = state.__element

  if (options.onEach) options.onEach(element, state, element.context, options)

  if (!options.updateByState) merge(options, STATE_UPDATE_OPTIONS)

  if (!state.__element) report('ElementOnStateIsNotDefined')
  if (options.preventInheritAtCurrentState === true) {
    options.preventInheritAtCurrentState = state
  } else if (options.preventInheritAtCurrentState) return

  if (!options.preventBeforeStateUpdateListener) {
    const beforeStateUpdateReturns = await triggerEventOnUpdate(
      'beforeStateUpdate',
      obj,
      element,
      options
    )
    if (beforeStateUpdateReturns === false) return element
  }

  overwriteState(state, obj, options)
  const updateIsHoisted = await hoistStateUpdate(state, obj, options)
  if (updateIsHoisted) return state

  updateDependentState(state, obj, options)

  applyElementUpdate(state, obj, options)

  if (!options.preventStateUpdateListener) {
    await triggerEventOnUpdate('stateUpdate', obj, element, options)
  }

  return state
}

export const hoistStateUpdate = async (state, obj, options) => {
  const element = state.__element
  const { parent, __ref: ref } = element

  const stateKey = ref?.__state
  const stateType = ref?.__stateType
  if (!stateKey) return

  const asksForInherit = checkIfInherits(element)
  const inheritedState = findInheritedState(element, parent, {
    returnParent: true
  })
  const shouldPropagateState =
    asksForInherit && inheritedState && !options.stopStatePropagation
  if (!shouldPropagateState) return

  const isStringState =
    stateType === 'string' || stateType === 'number' || stateType === 'boolean'
  const value = isStringState ? state.value : state.parse()
  const passedValue = isStringState ? state.value : obj

  const findRootState = getRootStateInKey(stateKey, parent.state)
  const findGrandParentState = getParentStateInKey(stateKey, parent.state)
  const changesValue = createNestedObjectByKeyPath(stateKey, passedValue)
  const targetParent = findRootState || findGrandParentState || parent.state
  if (options.replace) overwriteDeep(targetParent, changesValue || value) // check with createNestedObjectByKeyPath
  targetParent.update(changesValue, {
    execStateFunction: false,
    isHoisted: true,
    preventUpdate: options.preventHoistElementUpdate,
    overwrite: !options.replace,
    ...options
  })
  const hasNotUpdated =
    options.preventUpdate !== true || !options.preventHoistElementUpdate
  if (!options.preventStateUpdateListener && hasNotUpdated) {
    await triggerEventOnUpdate('stateUpdate', obj, element, options)
  }
  return true
}

const updateDependentState = (state, obj, options) => {
  if (!state.__depends) return
  for (const el in state.__depends) {
    const dependentState = state.__depends[el]
    dependentState.clean().update(state.parse(), options)
  }
}

const applyElementUpdate = (state, obj, options) => {
  const element = state.__element
  if (options.preventUpdate !== true) {
    element.update(
      {},
      {
        ...options,
        updateByState: true
      }
    )
  } else if (options.preventUpdate === 'recursive') {
    element.update(
      {},
      {
        ...options,
        isHoisted: false,
        updateByState: true,
        preventUpdate: true
      }
    )
  }
}
