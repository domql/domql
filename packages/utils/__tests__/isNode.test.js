import { isNode } from '..'

describe('isNode', () => {
  test('returns true for DOM nodes', () => {
    const div = document.createElement('div')
    const textNode = document.createTextNode('Hello, world!')
    expect(isNode(div)).toBe(true)
    expect(isNode(textNode)).toBe(true)
  })

  test('returns false for non-DOM objects', () => {
    expect(isNode({})).toBe(false)
    expect(isNode([])).toBe(false)
    expect(isNode('foo')).toBe(false)
    expect(isNode(123)).toBe(false)
  })

  test('returns false for null or undefined input', () => {
    expect(isNode(null)).toBe(false)
    expect(isNode(undefined)).toBe(false)
  })
})
