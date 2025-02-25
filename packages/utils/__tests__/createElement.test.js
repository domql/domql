import { jest } from '@jest/globals'
import { createElement } from '../element.js'

describe('createElement', () => {
  it('should create basic element with props', () => {
    const result = createElement(
      { props: { foo: 'bar' } },
      {},
      'testKey',
      {},
      {}
    )

    expect(result).toMatchObject({
      props: { foo: 'bar' },
      key: 'testKey',
      __ref: expect.any(Object)
    })
  })

  it('should handle string input', () => {
    const result = createElement('Hello', { props: {} }, 'key', {}, {})

    expect(result).toMatchObject({
      text: 'Hello',
      tag: 'string',
      key: 'key'
    })
  })

  it('should handle function input', () => {
    const fn = () => {}
    const result = createElement(fn, {}, 'key', {}, {})

    expect(result).toMatchObject({
      props: {},
      key: 'key'
    })
  })

  it('should initialize caching properties', () => {
    const result = createElement({}, {}, 'key', {}, {})

    expect(result.__ref).toMatchObject({
      __cached: {},
      __defineCache: {},
      __exec: {},
      __class: {},
      path: ['key']
    })
  })

  it('should inherit context from options', () => {
    const options = { context: { theme: 'dark' } }
    const result = createElement({}, {}, 'key', options, {})

    expect(result.context).toEqual({ theme: 'dark' })
  })

  it('should inherit context from parent', () => {
    const parent = { context: { theme: 'light' } }
    const result = createElement({}, parent, 'key', {}, {})

    expect(result.context).toEqual({ theme: 'light' })
  })

  it('should handle node parent', () => {
    const nodeParent = document.createElement('div')
    const root = {}
    const result = createElement({}, nodeParent, 'key', {}, root)

    expect(result.parent.key).toBe(':root')
    expect(result.parent.node).toBe(nodeParent)
    expect(root.key_parent).toBe(result.parent)
  })

  it('should handle null input', () => {
    const result = createElement(null, {}, 'key', {}, {})

    expect(result).toBeUndefined()
  })

  it('should handle complex nested elements', () => {
    const element = {
      props: {
        className: 'parent',
        childProps: { tag: 'div' }
      },
      children: {
        child1: {
          props: { className: 'child' }
        },
        child2: 'text content'
      }
    }
    const result = createElement(element, {}, 'parent', {}, {})

    expect(result).toMatchObject({
      props: {
        className: 'parent',
        childProps: { tag: 'div' }
      },
      key: 'parent',
      __ref: expect.any(Object)
    })
  })

  it('should properly handle element with extends', () => {
    const baseProps = { __hash: 'base', props: { base: true } }
    const element = { __hash: 'test', extends: [baseProps] }
    const result = createElement(element, {}, 'extended', {}, {})

    expect(result).toMatchObject({
      extends: [element],
      key: 'extended',
      __ref: expect.any(Object)
    })
  })

  it('should handle multi-level context inheritance', () => {
    const root = { context: { theme: 'root' } }
    const parent = createElement(
      { context: { level: 'parent' } },
      {},
      'parent',
      {},
      root
    )
    const child = createElement({}, parent, 'child', {}, root)
    const grandChild = createElement({}, child, 'grandChild', {}, root)

    expect(grandChild.context).toEqual({ theme: 'root' })
  })

  it('should warn on undefined elements in development', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
    process.env.NODE_ENV = 'development'

    createElement(undefined, { __ref: { path: ['parent'] } }, 'test', {}, {})

    expect(consoleSpy).toHaveBeenCalledWith('test', 'element is undefined in', [
      'parent'
    ])

    consoleSpy.mockRestore()
    process.env.NODE_ENV = 'test'
  })

  it('should handle complex path creation', () => {
    const root = {}
    const parent = createElement({ key: 'parent' }, {}, 'parent', {}, root)
    const child = createElement({ key: 'child' }, parent, 'child', {}, root)
    const grandChild = createElement(
      { key: 'grandChild' },
      child,
      'grandChild',
      {},
      root
    )

    expect(grandChild.__ref.path).toEqual(['parent', 'child', 'grandChild'])
  })

  it('should properly merge references and caching', () => {
    const element = { props: { dynamic: () => 'value' } }
    const result = createElement(element, {}, 'cached', {}, {})

    expect(result.__ref).toMatchObject({
      __cached: {},
      __defineCache: {},
      __exec: {},
      __execProps: {},
      __class: {},
      __classNames: {},
      __attr: {},
      __changes: [],
      __children: [],
      origin: element
    })
  })
})
