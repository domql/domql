'use strict'

export const registerFrameListener = el => {
  if (!el || !el.__ref) {
    throw new Error('Element reference is invalid')
  }

  const { __ref: ref } = el

  if (!ref.root) {
    throw new Error('Root reference is invalid')
  }

  if (!ref.root.data) {
    throw new Error('Data are undefined')
  }

  const { frameListeners } = ref.root.data

  // Check if frameListeners exists and the element is not already in the Set
  if (frameListeners && !frameListeners.has(el)) {
    frameListeners.add(el) // Add the element to the Set
  }
}

export const applyAnimationFrame = element => {
  if (!element) {
    throw new Error('Element is invalid')
  }
  const { props, on, __ref: ref } = element
  if (!ref.root || !ref.root.data) return
  const { frameListeners } = ref.root.data
  if (frameListeners && (on?.frame || props?.onFrame)) {
    registerFrameListener(element)
  }
}

export const initAnimationFrame = () => {
  const frameListeners = new Set()

  function requestFrame () {
    // Iterate over frameListeners
    for (const element of frameListeners) {
      if (!element.parent.node.contains(element.node)) {
        frameListeners.delete(element) // Remove if node has no parent
      } else {
        try {
          ;(element.on?.frame || element.props.onFrame)(
            element,
            element.state,
            element.context
          )
        } catch (e) {
          console.warn(e)
        }
      }
    }
    window.requestAnimationFrame(requestFrame)
  }

  requestFrame()

  return frameListeners
}
