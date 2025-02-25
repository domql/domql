import {
  exec,
  map,
  merge,
  clone,
  objectToString,
  detectInfiniteLoop,
  isCyclic,
  excludeKeysFromObject,
  createNestedObject,
  removeNestedKeyByPath,
  getInObjectByPath,
  hasOwnProperty,
  isEmpty,
  isEmptyObject,
  makeObjectWithoutPrototype,
  createObjectWithoutPrototype,
  deepMerge,
  deepStringify,
  deepDestringify,
  overwrite,
  overwriteShallow,
  overwriteDeep,
  isEqualDeep,
  deepContains,
  setInObjectByPath
} from '../object'

describe('Object Utils', () => {
  describe('exec', () => {
    test('executes function with correct context', () => {
      const element = { value: 42 }
      const fn = function () {
        return this.value
      }
      expect(exec(fn, element)).toBe(42)
    })

    test('returns non-function values as-is', () => {
      expect(exec(42, {})).toBe(42)
      expect(exec('test', {})).toBe('test')
    })
  })

  describe('map', () => {
    test('maps object properties', () => {
      const obj = {}
      const ext = { a: 1, b: () => 2 }
      map(obj, ext, {})
      expect(obj).toEqual({ a: 1, b: 2 })
    })
  })

  describe('merge and clone', () => {
    test('merges objects excluding specified keys', () => {
      const element = { a: 1 }
      const obj = { a: 2, b: 3, __skip: 4 }
      merge(element, obj, ['b'])
      expect(element).toEqual({ a: 1 })
    })

    test('clones object excluding specified keys', () => {
      const obj = { a: 1, b: 2, __skip: 3 }
      expect(clone(obj)).toEqual({ a: 1, b: 2 })
      expect(clone(obj, ['b'])).toEqual({ a: 1 })
    })
  })

  describe('objectToString', () => {
    test('converts object to formatted string', () => {
      const obj = { a: 1, b: { c: 2 } }
      const result = objectToString(obj)
      expect(result).toContain('a: 1')
      expect(result).toContain('b: {')
      expect(result).toContain('c: 2')
    })

    test('handles non-object input', () => {
      expect(objectToString(null)).toBe('null')
      expect(objectToString(undefined)).toBe('{}')
      expect(objectToString(42)).toBe('42')
      expect(objectToString('test')).toBe('test')
    })

    test('handles empty objects', () => {
      expect(objectToString({})).toBe('{}')
    })

    test('handles arrays and nested values', () => {
      const obj = {
        array: [1, 'test', { nested: 'value' }],
        nested: { foo: 'bar' },
        string: 'hello\nworld',
        quotedString: "I'm quoted"
      }

      const result = objectToString(obj)

      // Test array formatting
      expect(result).toContain('array: [\n')
      expect(result).toContain('    1,\n')
      expect(result).toContain("    'test',\n")
      expect(result).toContain("    {\n      nested: 'value',\n    },\n")

      // Test nested object formatting
      expect(result).toContain('nested: {\n')
      expect(result).toContain("    foo: 'bar',\n")

      // Test string handling
      expect(result).toContain('string: `hello\nworld`')
      expect(result).toContain("quotedString: `I'm quoted`")
    })
  })

  describe('Object inspection', () => {
    test('detectInfiniteLoop identifies repeating patterns', () => {
      const arr = [
        1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
        1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2
      ]
      expect(detectInfiniteLoop(arr)).toBe(true)
      expect(detectInfiniteLoop([1, 2, 3, 4])).toBeUndefined()
    })

    test('isCyclic detects circular references', () => {
      const obj = { a: 1 }
      obj.self = obj
      expect(isCyclic(obj)).toBe(true)
      expect(isCyclic({ a: 1 })).toBe(false)
    })
  })

  describe('Object manipulation', () => {
    test('createNestedObject creates object from path array', () => {
      const result = createNestedObject(['a', 'b', 'c'], 42)
      expect(result).toEqual({ a: { b: { c: 42 } } })
    })

    test('removeNestedKeyByPath removes nested key', () => {
      const obj = { a: { b: { c: 42 } } }
      removeNestedKeyByPath(obj, ['a', 'b', 'c'])
      expect(obj).toEqual({ a: { b: {} } })
    })

    test('getInObjectByPath retrieves nested value', () => {
      const obj = { a: { b: { c: 42 } } }
      expect(getInObjectByPath(obj, ['a', 'b', 'c'])).toBe(42)
      expect(getInObjectByPath(obj, ['x', 'y'])).toBeUndefined()
    })
  })

  describe('Object property checks', () => {
    test('hasOwnProperty checks property existence', () => {
      const obj = { a: 1 }
      expect(hasOwnProperty(obj, 'a')).toBe(true)
      expect(hasOwnProperty(obj, 'b')).toBe(false)
    })

    test('isEmpty checks if object has no keys', () => {
      expect(isEmpty({})).toBe(true)
      expect(isEmpty({ a: 1 })).toBe(false)
    })

    test('isEmptyObject checks if value is empty object', () => {
      expect(isEmptyObject({})).toBe(true)
      expect(isEmptyObject({ a: 1 })).toBe(false)
      expect(isEmptyObject(null)).toBe(false)
    })
  })

  describe('Object creation', () => {
    test('makeObjectWithoutPrototype creates clean object', () => {
      const obj = makeObjectWithoutPrototype()
      expect(Object.getPrototypeOf(obj)).toBe(null)
    })

    test('createObjectWithoutPrototype deep cleans object', () => {
      const original = { a: { b: 2 }, c: [1, 2] }
      const result = createObjectWithoutPrototype(original)
      expect(Object.getPrototypeOf(result)).toBe(null)
      expect(Object.getPrototypeOf(result.a)).toBe(null)
    })
  })

  describe('excludeKeysFromObject', () => {
    test('removes specified keys from object', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(excludeKeysFromObject(obj, ['b'])).toEqual({ a: 1, c: 3 })
    })

    test('handles multiple keys', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 }
      expect(excludeKeysFromObject(obj, ['b', 'd'])).toEqual({ a: 1, c: 3 })
    })
  })

  describe('deepMerge', () => {
    test('merges objects deeply', () => {
      const element = { a: { b: 1 }, c: 2 }
      const extend = { a: { d: 3 }, e: 4 }
      expect(deepMerge(element, extend)).toEqual({
        a: { b: 1, d: 3 },
        c: 2,
        e: 4
      })
    })

    test('skips excluded and underscore properties', () => {
      const element = { a: 1 }
      const extend = { b: 2, __skip: 3 }
      expect(deepMerge(element, extend, ['b'])).toEqual({ a: 1 })
    })
  })

  describe('deepStringify and deepDestringify', () => {
    test('stringifies and destringifies objects with functions', () => {
      const original = {
        a: 1,
        b: function () {
          return 2
        },
        c: { d: () => 3 }
      }
      const stringified = deepStringify(original)
      expect(typeof stringified.b).toBe('string')
      expect(typeof stringified.c.d).toBe('string')

      const destringified = deepDestringify(stringified)
      expect(typeof destringified.b).toBe('function')
      expect(typeof destringified.c.d).toBe('function')
      expect(destringified.b()).toBe(2)
      expect(destringified.c.d()).toBe(3)
    })
  })

  describe('overwrite operations', () => {
    test('overwrite updates properties', () => {
      const element = { a: 1, b: 2 }
      const params = { b: 3, c: 4 }
      expect(overwrite(element, params)).toEqual({ a: 1, b: 3, c: 4 })
    })

    test('overwriteShallow performs shallow update', () => {
      const obj = { a: 1, b: { c: 2 } }
      const params = { b: { d: 3 } }
      expect(overwriteShallow(obj, params)).toEqual({ a: 1, b: { d: 3 } })
    })

    test('overwriteDeep performs deep update', () => {
      const obj = { a: { b: 1, c: 2 } }
      const params = { a: { b: 3, d: 4 } }
      expect(overwriteDeep(obj, params)).toEqual({
        a: { b: 3, c: 2, d: 4 }
      })
    })
  })

  describe('equality and containment', () => {
    test('isEqualDeep compares objects deeply', () => {
      const obj1 = { a: { b: 1 }, c: [1, 2] }
      const obj2 = { a: { b: 1 }, c: [1, 2] }
      const obj3 = { a: { b: 2 }, c: [1, 2] }

      expect(isEqualDeep(obj1, obj2)).toBe(true)
      expect(isEqualDeep(obj1, obj3)).toBe(false)
    })

    test('deepContains checks if object structure exists', () => {
      const obj1 = { a: { b: 1, c: 2 }, d: 3 }
      const obj2 = { a: { b: 1 } }
      const obj3 = { a: { b: 2 } }

      expect(deepContains(obj1, obj2)).toBe(true)
      expect(deepContains(obj1, obj3)).toBe(false)
    })
  })

  describe('path operations', () => {
    test('setInObjectByPath sets nested value', () => {
      const obj = { a: { b: 1 } }
      setInObjectByPath(obj, ['a', 'c'], 2)
      expect(obj).toEqual({ a: { b: 1, c: 2 } })

      setInObjectByPath(obj, ['x', 'y', 'z'], 3)
      expect(obj.x.y.z).toBe(3)
    })
  })
})
