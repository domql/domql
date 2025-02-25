import { cache } from '../cache'

describe('cache', () => {
  beforeEach(() => {
    // Clear the cache before each test
    for (const key in cache) {
      delete cache[key]
    }
  })

  it('is initially empty', () => {
    expect(cache).toEqual({})
  })

  it('can store and retrieve a value', () => {
    cache.key1 = 'value1'
    expect(cache.key1).toBe('value1')
  })

  it('can overwrite an existing value', () => {
    cache.key1 = 'value1'
    cache.key1 = 'updatedValue'
    expect(cache.key1).toBe('updatedValue')
  })

  it('can store multiple key-value pairs', () => {
    cache.key1 = 'value1'
    cache.key2 = 'value2'
    expect(cache.key1).toBe('value1')
    expect(cache.key2).toBe('value2')
  })

  it('returns undefined for non-existent keys', () => {
    expect(cache.nonExistentKey).toBeUndefined()
  })

  it('can delete a key-value pair', () => {
    cache.key1 = 'value1'
    delete cache.key1
    expect(cache.key1).toBeUndefined()
  })

  it('can store objects as values', () => {
    const obj = { name: 'John', age: 30 }
    cache.user = obj
    expect(cache.user).toEqual(obj)
  })

  it('can store functions as values', () => {
    const func = () => 'Hello, World!'
    cache.greet = func
    expect(cache.greet).toBe(func)
    expect(cache.greet()).toBe('Hello, World!')
  })

  it('can store nested objects', () => {
    const nestedObj = { user: { name: 'John', age: 30 } }
    cache.nested = nestedObj
    expect(cache.nested).toEqual(nestedObj)
  })

  it('can handle falsy values', () => {
    cache.key1 = ''
    cache.key2 = 0
    cache.key3 = false
    cache.key4 = null
    cache.key5 = undefined

    expect(cache.key1).toBe('')
    expect(cache.key2).toBe(0)
    expect(cache.key3).toBe(false)
    expect(cache.key4).toBeNull()
    expect(cache.key5).toBeUndefined()
  })

  it('can be cleared completely', () => {
    cache.key1 = 'value1'
    cache.key2 = 'value2'

    for (const key in cache) {
      delete cache[key]
    }

    expect(cache).toEqual({})
  })

  it('can store and retrieve symbols as keys', () => {
    const symbolKey = Symbol('unique')
    cache[symbolKey] = 'symbolValue'
    expect(cache[symbolKey]).toBe('symbolValue')
  })

  it('can store and retrieve null and undefined values', () => {
    cache.nullKey = null
    cache.undefinedKey = undefined

    expect(cache.nullKey).toBeNull()
    expect(cache.undefinedKey).toBeUndefined()
  })
})
