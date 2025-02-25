'use strict'

import { merge, overwrite, removeContent } from '@domql/utils'

import { set, reset } from '../set.js'
import { update } from '../update.js'

import { updateContent } from '../mixins/content.js'
import {
  call,
  error,
  getPath,
  getRef,
  keys,
  log,
  lookdown,
  lookdownAll,
  lookup,
  nextElement,
  parse,
  parseDeep,
  previousElement,
  remove,
  setNodeStyles,
  setProps,
  spotByPath,
  variables,
  verbose,
  warn
} from '@domql/utils/methods'

export const addMethods = (element, parent, options = {}) => {
  const proto = {
    set,
    reset,
    update,
    variables,
    remove,
    updateContent,
    removeContent,
    setProps,
    lookup,
    lookdown,
    lookdownAll,
    getRef,
    getPath,
    setNodeStyles,
    spotByPath,
    parse,
    parseDeep,
    keys,
    nextElement,
    previousElement,
    log,
    verbose,
    warn,
    error,
    call
  }
  if (element.context.methods) {
    ;(options.strict ? merge : overwrite)(proto, element.context.methods)
  }
  Object.setPrototypeOf(element, proto)
}
