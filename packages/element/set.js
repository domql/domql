'use strict'

import {
  deepContains,
  OPTIONS,
  removeContent,
  setContentKey
} from '@domql/utils'

import { create } from './create.js'
import { triggerEventOn, triggerEventOnUpdate } from '@domql/event'

export const resetElement = async (params, element, options) => {
  if (!options.preventRemove) removeContent(element, options)
  const { __ref: ref } = element
  await create(params, element, ref.contentElementKey || 'content', {
    ignoreChildExtends: true,
    ...OPTIONS.defaultOptions,
    ...OPTIONS.create,
    ...options
  })
}

export const reset = options => {
  const element = this
  create(element, element.parent, undefined, {
    ignoreChildExtends: true,
    ...OPTIONS.defaultOptions,
    ...OPTIONS.create,
    ...options
  })
}

export const set = async function (params, options = {}, el) {
  const element = el || this
  const { __ref: ref } = element

  const content = setContentKey(element, options)
  const __contentRef = content && content.__ref
  const lazyLoad = element.props && element.props.lazyLoad

  const hasChildren = element.children
  if (options.preventContentUpdate === true && !hasChildren) return

  if (
    ref.__noCollectionDifference ||
    (__contentRef && __contentRef.__cached && deepContains(params, content))
  ) {
    if (!options.preventBeforeUpdateListener && !options.preventListeners) {
      const beforeUpdateReturns = await triggerEventOnUpdate(
        'beforeUpdate',
        params,
        element,
        options
      )
      if (beforeUpdateReturns === false) return element
    }
    if (content?.update) await content.update()
    if (!options.preventUpdateListener) {
      await triggerEventOn('update', element, options)
    }
    return
  }

  if (params) {
    let { childExtends, props } = params
    if (!props) props = params.props = {}
    if (!childExtends && element.childExtends) {
      params.childExtends = element.childExtends
      props.ignoreChildExtends = true
    }
    if (!props?.childProps && element.props?.childProps) {
      props.childProps = element.props.childProps
      props.ignoreChildProps = true
    }

    if (lazyLoad) {
      window.requestAnimationFrame(() => {
        resetElement(params, element, options)
        // handle lazy load
        if (!options.preventUpdateListener) {
          triggerEventOn('lazyLoad', element, options)
        }
      })
    } else await resetElement(params, element, options)
  }

  return element
}

export default set
