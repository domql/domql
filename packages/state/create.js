'use strict'

import { triggerEventOn } from '@domql/event'
import {
  applyDependentState,
  checkForStateTypes,
  checkIfInherits,
  createInheritedState,
  isUndefined
} from '@domql/utils'

import { applyStateMethods } from './methods'

export const createState = async function (element, parent, options) {
  element.state = await applyInitialState(element, parent, options)
  return element.state
}

export const applyInitialState = async function (element, parent, options) {
  const objectizeState = await checkForStateTypes(element)
  if (objectizeState === false) return parent.state || {}
  else element.state = objectizeState

  const whatInitReturns = await triggerEventOn('stateInit', element, options)
  if (whatInitReturns === false) return element.state

  if (checkIfInherits(element)) {
    const inheritedState = createInheritedState(element, parent)
    element.state = isUndefined(inheritedState) ? {} : inheritedState
  }

  const dependentState = applyDependentState(
    element,
    element.state || parent.state || {}
  )
  if (dependentState) element.state = dependentState

  applyStateMethods(element)

  // trigger `on.stateCreated`
  await triggerEventOn('stateCreated', element)

  return element.state
}
