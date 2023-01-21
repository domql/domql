'use strict'

import { can } from '../event'
import { exec, isString, isTagRegistered, report } from '../utils'

const cachedElements = {}

const createNode = (element) => {
  const { tag } = element
  if (tag) {
    if (tag === 'string') return global.createTextNode(element.text)
    else if (tag === 'fragment') {
      return global.createDocumentFragment()
    } else if (tag === 'svg' || tag === 'path') { // change that
      return global.createElementNS('http://www.w3.org/2000/svg', tag)
    } else return global.createElement(tag)
  } else {
    return global.createElement('div')
  }
}

const detectTag = element => {
  let { tag, key } = element
  tag = exec(tag, element)

  if (tag === true) tag = key

  if (isString(tag)) {
    const tagExists = isTagRegistered(tag) > -1
    if (tagExists) return tag
  } else {
    const isKeyATag = isTagRegistered(key) > -1
    if (isKeyATag) return key
  }

  return 'div'
}

export default (element) => {
  const tag = element.tag = detectTag(element)

  if (!can.render(element)) {
    return report('HTMLInvalidTag')
  }

  let cachedTag = cachedElements[tag]
  if (!cachedTag) cachedTag = cachedElements[tag] = createNode(element)

  const clonedNode = cachedTag.cloneNode(true)
  if (tag === 'string') clonedNode.nodeValue = element.text
  return clonedNode
}
