import { deepDestringify } from '..'

describe('deepDestringify', () => {
  test('should return a new object with function strings replaced by their evaluated results', () => {
    const obj = {
      strFunc: '() => { return 42 }',
      nestedObj: {
        nestedStrFunc: 'function() { return "hello" }',
        nestedStr: 'world'
      },
      arr: ['() => { return "foo" }', '() => { return "bar" }', 'baz'],
      num: 123,
      bool: true
    }

    const result = deepDestringify(obj)

    expect(result.strFunc()).toBe(42)
    expect(result.nestedObj.nestedStrFunc()).toBe('hello')
    expect(result.nestedObj.nestedStr).toBe('world')
    expect(result.arr[0]()).toBe('foo')
    expect(result.arr[1]()).toBe('bar')
    expect(result.arr[2]).toBe('baz')
    expect(result.num).toBe(123)
    expect(result.bool).toBe(true)
  })

  test('should handle arrays with circular references', () => {
    const arr = [1, 2]

    const result = deepDestringify(arr)

    expect(result[0]).toBe(1)
    expect(result[1]).toBe(2)
  })

  test('should not modify the original object', () => {
    const obj = { strFunc: '() => { return "original" }' }

    deepDestringify(obj)

    expect(obj.strFunc).toBe('() => { return "original" }')
  })
})
