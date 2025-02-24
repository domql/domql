'use strict'

import { inheritParentProps } from '@domql/utils'
import { syncProps } from './create.js'

export const updateProps = (newProps, element, parent) => {
  const { __ref } = element
  let propsStack = __ref.__props

  const parentProps = inheritParentProps(element, parent)
  if (parentProps.length) propsStack = __ref.__props = [].concat(parentProps, propsStack)
  if (newProps) propsStack = __ref.__props = [].concat(newProps, propsStack)

  if (propsStack) syncProps(propsStack, element)

  return element
}
