import { OPTIONS } from '../cache'

describe('OPTIONS', () => {
  it('is an empty object by default', () => {
    expect(OPTIONS).toEqual({})
  })

  it('can be modified', () => {
    OPTIONS.key1 = 'value1'
    expect(OPTIONS.key1).toBe('value1')
  })

  it('can have properties added and removed', () => {
    OPTIONS.key2 = 'value2'
    expect(OPTIONS.key2).toBe('value2')

    delete OPTIONS.key2
    expect(OPTIONS.key2).toBeUndefined()
  })

  it('can store nested objects', () => {
    OPTIONS.nested = { key: 'value' }
    expect(OPTIONS.nested).toEqual({ key: 'value' })
  })

  it('can store functions', () => {
    const func = () => 'Hello, World!'
    OPTIONS.func = func
    expect(OPTIONS.func).toBe(func)
    expect(OPTIONS.func()).toBe('Hello, World!')
  })

  it('can handle falsy values', () => {
    OPTIONS.falsy1 = ''
    OPTIONS.falsy2 = 0
    OPTIONS.falsy3 = false
    OPTIONS.falsy4 = null
    OPTIONS.falsy5 = undefined

    expect(OPTIONS.falsy1).toBe('')
    expect(OPTIONS.falsy2).toBe(0)
    expect(OPTIONS.falsy3).toBe(false)
    expect(OPTIONS.falsy4).toBeNull()
    expect(OPTIONS.falsy5).toBeUndefined()
  })

  it('can be cleared completely', () => {
    OPTIONS.key1 = 'value1'
    OPTIONS.key2 = 'value2'

    for (const key in OPTIONS) {
      delete OPTIONS[key]
    }

    expect(OPTIONS).toEqual({})
  })

  it('can store and retrieve symbols as keys', () => {
    const symbolKey = Symbol('unique')
    OPTIONS[symbolKey] = 'symbolValue'
    expect(OPTIONS[symbolKey]).toBe('symbolValue')
  })

  it('can store and retrieve null and undefined values', () => {
    OPTIONS.nullKey = null
    OPTIONS.undefinedKey = undefined

    expect(OPTIONS.nullKey).toBeNull()
    expect(OPTIONS.undefinedKey).toBeUndefined()
  })
})
