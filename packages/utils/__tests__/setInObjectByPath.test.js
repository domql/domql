import { setInObjectByPath } from '..'

describe('setInObjectByPath', () => {
  it('sets a value in an empty object with a simple path', () => {
    const obj = {}
    setInObjectByPath(obj, ['a'], 1)
    expect(obj).toEqual({ a: 1 })
  })

  it('sets a value in a nested path, creating structure as needed', () => {
    const obj = {}
    setInObjectByPath(obj, ['a', 'b', 'c'], 42)
    expect(obj).toEqual({ a: { b: { c: 42 } } })
  })

  it('modifies an existing value in a nested structure', () => {
    const obj = { x: { y: { z: 'old' } } }
    setInObjectByPath(obj, ['x', 'y', 'z'], 'new')
    expect(obj).toEqual({ x: { y: { z: 'new' } } })
  })

  it('creates missing intermediate objects in an existing structure', () => {
    const obj = { a: { b: 1 } }
    setInObjectByPath(obj, ['a', 'c', 'd'], 'value')
    expect(obj).toEqual({ a: { b: 1, c: { d: 'value' } } })
  })

  it('handles array values correctly', () => {
    const obj = {}
    setInObjectByPath(obj, ['data', 'items'], [1, 2, 3])
    expect(obj).toEqual({ data: { items: [1, 2, 3] } })
  })

  it('throws error when path is not an array', () => {
    const obj = {}
    expect(() => setInObjectByPath(obj, 'not-an-array', 42)).toThrow(
      'Path must be an array.'
    )
  })

  it('overwrites non-object values in the path with objects', () => {
    const obj = { a: 'string' }
    setInObjectByPath(obj, ['a', 'b', 'c'], 42)
    expect(obj).toEqual({ a: { b: { c: 42 } } })
  })
})
