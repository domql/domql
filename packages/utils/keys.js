'use strict'

export const DOMQ_PROPERTIES = [
  'attr',
  'style',
  'text',
  'html',
  'content',
  'data',
  'class',
  'state',
  'scope',
  'deps',
  'extends',
  'children',
  'childExtends',
  'childExtendsRecursive',
  'props',
  'if',
  'define',
  '__name',
  '__ref',
  '__hash',
  '__text',
  'key',
  'tag',
  'query',
  'parent',
  'node',
  'variables',
  'on',
  'component',
  'context'
]

export const PARSED_DOMQ_PROPERTIES = [
  'attr',
  'style',
  'text',
  'html',
  'content',
  'data',
  'class',
  'state',
  'scope',
  'children',
  'props',
  'if',
  'key',
  'tag',
  'query',
  'on',
  'context'
]

export const STATE_PROPERTIES = [
  'ref',
  'parent',
  '__element',
  '__depends',
  '__ref',
  '__children',
  'root'
]

export const STATE_METHODS = [
  'update',
  'parse',
  'clean',
  'create',
  'destroy',
  'add',
  'toggle',
  'remove',
  'apply',
  'set',
  'reset',
  'replace',
  'quietReplace',
  'quietUpdate',
  'applyReplace',
  'applyFunction',
  'keys',
  'values',
  'ref',
  'rootUpdate',
  'parentUpdate',
  'parent',
  '__element',
  '__depends',
  '__ref',
  '__children',
  'root',
  'setByPath',
  'setPathCollection',
  'removeByPath',
  'removePathCollection',
  'getByPath'
]

export const PROPS_METHODS = ['update', '__element']

export const METHODS = [
  'set',
  'reset',
  'update',
  'remove',
  'updateContent',
  'removeContent',
  'lookup',
  'lookdown',
  'lookdownAll',
  'getRef',
  'getPath',
  'setNodeStyles',
  'spotByPath',
  'keys',
  'parse',
  'setProps',
  'parseDeep',
  'variables',
  'if',
  'log',
  'verbose',
  'warn',
  'error',
  'call',
  'nextElement',
  'previousElement'
]

export const METHODS_EXL = [
  ...['node', 'context', 'extends', '__element', '__ref'],
  ...METHODS,
  ...STATE_METHODS,
  ...PROPS_METHODS
]
