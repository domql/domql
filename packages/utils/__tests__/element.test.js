import {
  returnValueAsText,
  createBasedOnType,
  addCaching,
  addRef,
  createParent,
  addContext
} from '../element.js'

describe('returnValueAsText', () => {
  test('should return text object with default tag', () => {
    const result = returnValueAsText('hello', { props: {} }, 'div')
    expect(result).toEqual({
      text: 'hello',
      tag: 'div'
    })
  })

  test('should use childExtends tag', () => {
    const result = returnValueAsText(
      'hello',
      { childExtends: { tag: 'span' }, props: {} },
      'key'
    )
    expect(result).toEqual({
      text: 'hello',
      tag: 'span'
    })
  })
})

describe('createBasedOnType', () => {
  test('should handle undefined', () => {
    const result = createBasedOnType(undefined, {}, 'key')
    expect(result).toEqual({})
  })

  test('should handle null', () => {
    const result = createBasedOnType(null, {}, 'key')
    expect(result).toBeUndefined()
  })

  test('should handle strings', () => {
    const result = createBasedOnType('test', { props: {} }, 'key')
    expect(result).toHaveProperty('text', 'test')
  })
})

describe('addRef', () => {
  test('should create ref object with origin', () => {
    const element = { key: 'test', props: {} }
    const parent = {}
    const ref = addRef(element, parent)

    expect(ref.origin).toBe(element)
    expect(ref.parent).toBe(parent)
  })
})

describe('addCaching', () => {
  test('should initialize caching properties', () => {
    const element = { key: 'test', __ref: {} }
    const parent = { __ref: {} }

    addCaching(element, parent, 'test')

    expect(element.__ref.__cached).toBeDefined()
    expect(element.__ref.__defineCache).toBeDefined()
    expect(element.__ref.__exec).toBeDefined()
    expect(element.__ref.__class).toBeDefined()
    expect(element.__ref.path).toEqual(['test'])
  })

  test('should handle root elements', () => {
    const element = { key: 'test', __ref: {} }
    const parent = { key: ':root' }

    addCaching(element, parent, 'test')

    expect(Object.is(element.__ref.root, element)).toBe(true)
  })
})

describe('createParent', () => {
  test('should return parent if not a node', () => {
    const element = {}
    const parent = { key: 'parent' }
    const result = createParent(element, parent, 'key', {}, {})

    expect(result).toBe(parent)
  })

  test('should create parent wrapper for node', () => {
    const element = {}
    const nodeParent = document.createElement('div')
    const root = {}
    const result = createParent(element, nodeParent, 'testKey', {}, root)

    expect(result).toEqual({
      key: ':root',
      node: nodeParent
    })
    expect(root.testKey_parent).toBe(result)
  })
})

describe('addContext', () => {
  test('should use options context when forced', () => {
    const element = {}
    const parent = {}
    const options = { context: { test: true } }
    const root = {}

    const result = addContext(element, parent, 'key', options, root)

    expect(result).toEqual({ test: true })
    expect(root.context).toEqual({ test: true })
  })

  test('should inherit context from parent', () => {
    const element = {}
    const parent = { context: { fromParent: true } }
    const options = {}
    const root = {}

    const result = addContext(element, parent, 'key', options, root)

    expect(result).toEqual({ fromParent: true })
  })

  test('should prioritize parent context', () => {
    const element = { context: { fromElement: true } }
    const parent = { context: { fromParent: true } }
    const options = { context: { fromOptions: true } }
    const root = { context: { fromRoot: true } }

    const result = addContext(element, parent, 'key', options, root)

    expect(result).toEqual({ fromOptions: true })
  })
})
