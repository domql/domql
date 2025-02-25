'use strict'

import { isFunction } from './types'

export const setContentKey = (el, opts = {}) => {
  const { __ref: ref } = el
  const contentElementKey = opts.contentElementKey
  if (
    (contentElementKey !== 'content' &&
      contentElementKey !== ref.contentElementKey) ||
    !ref.contentElementKey
  ) {
    ref.contentElementKey = contentElementKey || 'content'
  } else ref.contentElementKey = 'content'
  if (contentElementKey !== 'content') opts.contentElementKey = 'content'
  return ref.contentElementKey
}

export const removeContent = function (el, opts = {}) {
  const element = el || this
  const { __ref: ref } = element
  const contentElementKey = setContentKey(element, opts)
  if (opts.contentElementKey !== 'content') {
    opts.contentElementKey = 'content'
  }

  if (element[contentElementKey]) {
    if (element[contentElementKey].node && element.node) {
      if (element[contentElementKey].tag === 'fragment') {
        element.node.innerHTML = ''
      } else {
        const contentNode = element[contentElementKey].node
        if (contentNode.parentNode === element.node) {
          element.node.removeChild(element[contentElementKey].node)
        }
      }
    }

    const { __cached } = ref
    if (__cached && __cached[contentElementKey]) {
      const cachedContent = __cached[contentElementKey]
      if (cachedContent.tag === 'fragment') {
        cachedContent.parent.node.innerHTML = ''
      } else if (cachedContent && isFunction(cachedContent.remove)) {
        cachedContent.remove()
      }
    }

    delete element[contentElementKey]
  }
}
