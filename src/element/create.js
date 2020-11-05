'use strict'

import tree from './tree'
import createNode from './createNode'
import { assignNode } from './assign'
import { applyPrototype } from './proto'
import ID from './id'
import nodes from './nodes'
import set from './set'
import update from './update'
import remove from './remove'
import lookup from './lookup'
import * as on from '../event/on'
// import { overwrite, clone, fillTheRest } from '../utils'

/**
 * Creating a domQL element using passed parameters
 */
const create = (element, parent, key) => {
  // If parent is not given
  if (!parent) parent = tree

  // If element is not given
  if (element === undefined) element = {}
  if (element === null) return

  // run onInit
  if (element.on && typeof element.on.init === 'function') {
    on.init(element.on.init, element)
  }

  // define key
  const assignedKey = element.key || key || ID.next().value

  // If element is string
  if (typeof element === 'string' || typeof element === 'number') {
    element = {
      text: element,
      tag: (!element.proto && parent.childProto && parent.childProto.tag) ||
      ((nodes.body.indexOf(key) > -1) && key) || 'string'
    }
  }

  // Assign parent reference to the element
  element.parent = parent

  // cache params
  applyPrototype(element)

  // Set the path
  if (!parent.path) parent.path = []
  element.path = parent.path.concat(assignedKey)

  // if it already has a node
  if (element.node) {
    return assignNode(element, parent, assignedKey)
  }

  // generate a class name
  if (element.class === true) element.class = assignedKey
  else if (!element.class && typeof assignedKey === 'string' && assignedKey.charAt(0) === '_' && assignedKey.charAt(1) !== '_') {
    element.class = assignedKey.slice(1)
  }

  // create and assign a key
  element.key = assignedKey

  if (typeof element.if === 'function' && !element.if(element)) return

  // enable caching in data
  if (!element.data) element.data = {}

  // create Element class
  createNode(element)

  // Assign methods
  element.set = set
  element.update = update
  element.remove = remove
  element.lookup = lookup

  assignNode(element, parent, key)

  // run onRender
  if (element.on && typeof element.on.render === 'function') {
    on.render(element.on.render, element)
  }

  return element
}

export default create
