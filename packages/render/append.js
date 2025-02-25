'use strict'

/**
 * Receives child and parent nodes as parametes
 * and assigns them into real DOM tree
 */
export const appendNode = (node, parentNode) => {
  try {
    parentNode.appendChild(node)
    return node
  } catch (e) {
    console.error('Does not support to append', parentNode, node)
  }
}

export const insertNodeAfter = (node, siblingNode, parentNode) => {
  if (!node) {
    throw new Error('Node is required')
  }
  const parent = parentNode || siblingNode?.parentNode
  if (siblingNode?.nextSibling) {
    parent && parent.insertBefore(node, siblingNode.nextSibling)
  } else if (siblingNode?.insertAdjacentElement) {
    siblingNode.insertAdjacentElement('afterend', node)
  } else {
    parent && parent.insertBefore(node, siblingNode)
  }
}

export const insertNodeBefore = (node, siblingNode, parentNode) => {
  if (!node) {
    throw new Error('Node is required')
  }
  const parent = parentNode || siblingNode.parentNode
  parent && parent.insertBefore(node, siblingNode)
}

/**
 * Receives elements and assigns the first
 * parameter as a child of the second one
 */
export const assignNode = (element, parent, key, attachOptions) => {
  if (!element) {
    throw new Error('Element is required')
  }
  if (!parent) {
    throw new Error('Element is required')
  }
  parent[key || element.key] = element
  if (element.tag !== 'shadow') {
    if (attachOptions && attachOptions.position) {
      ;(attachOptions.position === 'before'
        ? insertNodeBefore
        : insertNodeAfter)(element.node, attachOptions.node || parent.node)
    } else {
      appendNode(element.node, parent.node)
    }
  }
  return element
}
