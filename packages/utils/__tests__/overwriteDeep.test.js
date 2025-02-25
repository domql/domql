import { overwriteDeep } from '..'

describe('overwriteDeep', () => {
  test('should return an empty object when both parameters are empty objects', () => {
    const params = {}
    const obj = {}
    const result = overwriteDeep(obj, params)
    expect(result).toEqual({})
  })

  test("should add a new property to the object when it doesn't exist", () => {
    const params = { name: 'John' }
    const obj = { age: 30 }
    const result = overwriteDeep(obj, params)
    expect(result).toEqual({ name: 'John', age: 30 })
  })

  test('should overwrite a property with the same name and value', () => {
    const params = { name: 'John' }
    const obj = { name: 'John' }
    const result = overwriteDeep(obj, params)
    expect(result).toEqual({ name: 'John' })
  })

  test('should overwrite a property with the same name but different value', () => {
    const params = { name: 'John' }
    const obj = { name: 'Jane' }
    const result = overwriteDeep(obj, params)
    expect(result).toEqual({ name: 'John' })
  })

  test('should overwrite a nested object in the target object', () => {
    const params = { person: { name: 'John', age: 30 } }
    const obj = { person: { name: 'Jane', city: 'New York' } }
    const result = overwriteDeep(obj, params)
    expect(result).toEqual({
      person: { name: 'John', age: 30, city: 'New York' }
    })
  })

  test('should add a nested object to the target object', () => {
    const params = { person: { name: 'John', age: 30 } }
    const obj = { city: 'New York' }
    const result = overwriteDeep(obj, params)
    expect(result).toEqual({
      person: { name: 'John', age: 30 },
      city: 'New York'
    })
  })

  test('should skip a property with a value of undefined', () => {
    const params = { name: undefined }
    const obj = { age: 30 }
    const result = overwriteDeep(obj, params)
    expect(result).toEqual({ age: 30 })
  })

  test('should add a property with a value of null', () => {
    const params = { name: null }
    const obj = { age: 30 }
    const result = overwriteDeep(obj, params)
    expect(result).toEqual({ name: null, age: 30 })
  })
})
