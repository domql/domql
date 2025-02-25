import { jest } from '@jest/globals'
import {
  spotByPath,
  lookup,
  lookdown,
  lookdownAll,
  setNodeStyles,
  remove,
  get,
  setProps,
  getRef,
  getPath,
  keys,
  parse,
  parseDeep,
  verbose,
  log,
  warn,
  error,
  nextElement,
  previousElement,
  variables,
  call,
  isMethod,
  defineSetter
} from '../methods.js'
import { METHODS } from '../keys.js'

// Mock console methods
global.console = {
  log: jest.fn(),
  warn: jest.fn(),
  group: jest.fn(),
  groupCollapsed: jest.fn(),
  groupEnd: jest.fn()
}

describe('Element Navigation Methods', () => {
  describe('spotByPath', () => {
    test('should find element by path', () => {
      const mockElement = {
        key: 'root',
        __ref: {
          root: {
            child: { key: 'child' }
          }
        }
      }
      expect(spotByPath.call(mockElement, ['child'])).toBeDefined()
    })
  })

  describe('lookup', () => {
    test('should find parent element by parameter', () => {
      const mockElement = {
        parent: {
          testProp: 'found',
          parent: null
        }
      }
      expect(lookup.call(mockElement, 'testProp')).toBe('found')
    })

    test('should find parent element by callback function', () => {
      const mockElement = {
        parent: {
          state: { type: 'parent' },
          context: {},
          parent: null
        }
      }
      const result = lookup.call(
        mockElement,
        (el, state) => state.type === 'parent'
      )
      expect(result).toBe(mockElement.parent)
    })

    test('should recursively lookup parent elements', () => {
      const mockElement = {
        parent: {
          state: { type: 'child' },
          context: {},
          parent: {
            state: { type: 'parent' },
            context: {},
            parent: null
          },
          lookup
        }
      }
      const result = lookup.call(
        mockElement,
        (el, state) => state.type === 'parent'
      )
      expect(result).toBe(mockElement.parent.parent)
    })
  })

  describe('lookdown', () => {
    test('should find child element by parameter', () => {
      const mockElement = {
        __ref: {
          __children: ['child1']
        },
        child1: {
          key: 'child1',
          state: { value: true }
        }
      }
      expect(lookdown.call(mockElement, 'child1')).toBeDefined()
    })

    test('should find child element by callback function', () => {
      const mockElement = {
        __ref: {
          __children: ['child1']
        },
        child1: {
          key: 'child1',
          state: { type: 'target' },
          context: {}
        }
      }
      const result = lookdown.call(
        mockElement,
        (el, state) => state.type === 'target'
      )
      expect(result).toBe(mockElement.child1)
    })
  })

  describe('lookdownAll', () => {
    test('should find all matching child elements', () => {
      const mockElement = {
        __ref: {
          __children: ['child1', 'child2']
        },
        child1: {
          key: 'child1',
          state: { type: 'test' },
          lookdownAll,
          __ref: {
            __children: []
          }
        },
        child2: {
          key: 'child2',
          state: { type: 'test' },
          __ref: {
            __children: []
          }
        }
      }
      const results = lookdownAll.call(
        mockElement,
        el => el.state?.type === 'test'
      )
      expect(results).toHaveLength(2)
    })
  })

  describe('nextElement', () => {
    test('should get next sibling element', () => {
      const mockElement = {
        key: 'current',
        parent: {
          next: { key: 'next' },
          __ref: {
            __children: ['current', 'next']
          }
        }
      }
      const result = nextElement.call(mockElement)
      expect(result).toEqual({ key: 'next' })
    })
  })

  describe('previousElement', () => {
    test('should get previous sibling element', () => {
      const mockElement = {
        key: 'current',
        parent: {
          prev: { key: 'prev' },
          __ref: {
            __children: ['prev', 'current']
          }
        }
      }
      const result = previousElement.call(mockElement)
      expect(result).toEqual({ key: 'prev' })
    })
  })
})

describe('DOM Manipulation Methods', () => {
  describe('setNodeStyles', () => {
    test('should set node styles', () => {
      const mockElement = {
        node: {
          style: {}
        }
      }
      setNodeStyles.call(mockElement, { color: 'red' })
      expect(mockElement.node.style.color).toBe('red')
    })
  })

  describe('remove', () => {
    test('should remove element', () => {
      const mockElement = {
        key: 'test',
        parent: {
          __ref: {
            __children: ['test']
          }
        },
        node: {
          remove: jest.fn()
        }
      }
      remove.call(mockElement)
      expect(mockElement.node.remove).toHaveBeenCalled()
    })
  })
})

describe('State Management Methods', () => {
  describe('setProps', () => {
    test('should set props', () => {
      const mockElement = {
        props: {},
        update: jest.fn()
      }
      setProps.call(mockElement, { test: true })
      expect(mockElement.update).toHaveBeenCalled()
    })
  })

  describe('variables', () => {
    test('should track variable changes', () => {
      const mockElement = {
        data: {
          varCaches: {}
        }
      }
      const vars = variables.call(mockElement, { test: 'value' })
      expect(vars.changed).toBeDefined()
    })

    test('should execute changed callback with changes', () => {
      const mockElement = {
        data: { varCaches: { existing: 'old' } }
      }
      const callback = jest.fn()

      const vars = variables.call(mockElement, {
        test: 'new',
        existing: 'updated'
      })
      vars.changed(callback)

      expect(callback).toHaveBeenCalledWith(
        { test: 'new', existing: 'updated' },
        { existing: 'old' }
      )
      expect(mockElement.data.varCaches).toEqual({
        existing: 'updated',
        test: 'new'
      })
    })

    test('should execute timeout callback after delay', () => {
      jest.useFakeTimers()
      const mockElement = {
        data: { varCaches: {} }
      }
      const callback = jest.fn()

      const vars = variables.call(mockElement, { test: 'new' })
      vars.timeout(callback, 1000)

      jest.advanceTimersByTime(1000)
      expect(callback).toHaveBeenCalledWith({ test: 'new' })
      jest.useRealTimers()
    })
  })
})

describe('Reference Methods', () => {
  describe('getRef', () => {
    test('should return element reference', () => {
      const mockElement = {
        __ref: { path: ['root', 'child'] }
      }
      expect(getRef.call(mockElement)).toBe(mockElement.__ref)
    })
  })

  describe('getPath', () => {
    test('should return element path', () => {
      const mockElement = {
        __ref: { path: ['root', 'child'] },
        getRef
      }
      expect(getPath.call(mockElement)).toEqual(['root', 'child'])
    })
  })
})

describe('Utility Methods', () => {
  describe('keys', () => {
    test('should return element keys', () => {
      const mockElement = {
        prop1: 'value1',
        prop2: 'value2'
      }
      expect(keys.call(mockElement)).toBeInstanceOf(Array)
    })
  })

  describe('parse', () => {
    test('should parse element data', () => {
      const mockElement = {
        state: { value: true },
        keys
      }
      const parsed = parse.call(mockElement)
      expect(parsed).toBeDefined()
    })
  })

  describe('get', () => {
    test('should get element property', () => {
      const mockElement = {
        testProp: 'value'
      }
      expect(get.call(mockElement, 'testProp')).toBe('value')
    })
  })

  describe('parseDeep', () => {
    test('should deeply parse element data', () => {
      const mockElement = {
        state: { nested: { value: true } },
        __ref: {
          __hasRootState: true
        },
        keys,
        parse
      }
      const parsed = parseDeep.call(mockElement)
      expect(parsed.state?.nested?.value).toBe(true)
    })
  })

  describe('isMethod', () => {
    test('should identify built-in methods', () => {
      // Test core methods
      expect(isMethod('lookup')).toBe(true)
      expect(isMethod('lookdown')).toBe(true)
      expect(isMethod('setNodeStyles')).toBe(true)
      expect(isMethod('remove')).toBe(true)
      expect(isMethod('parse')).toBe(true)
    })

    test('should identify custom methods from element context', () => {
      const element = {
        context: {
          methods: {
            customMethod: () => {},
            anotherMethod: () => {}
          }
        }
      }
      expect(isMethod('customMethod', element)).toBe(true)
      expect(isMethod('anotherMethod', element)).toBe(true)
    })

    test('should return false for invalid methods', () => {
      const element = {
        context: {
          methods: {}
        }
      }
      expect(isMethod('nonexistentMethod', element)).toBe(false)
      expect(isMethod(undefined, element)).toBe(false)
      expect(isMethod(null, element)).toBe(false)
    })

    test('should handle missing context gracefully', () => {
      const element = {}
      expect(isMethod('someMethod', element)).toBe(false)
      expect(isMethod('someMethod')).toBe(false)
    })

    test('should check all METHODS array items', () => {
      METHODS.forEach(method => {
        expect(isMethod(method)).toBe(true)
      })
    })
  })

  describe('defineSetter', () => {
    test('should define getter and setter on element', () => {
      const element = {}
      const getter = jest.fn(() => 'value')
      const setter = jest.fn()

      defineSetter(element, 'testProp', getter, setter)

      // eslint-disable-next-line
      element.testProp
      element.testProp = 'newValue'

      expect(getter).toHaveBeenCalled()
      expect(setter).toHaveBeenCalledWith('newValue')
    })
  })
})

describe('Parsing Methods', () => {
  describe('parse with scope', () => {
    test('should parse scope when __hasRootScope is true', () => {
      const mockElement = {
        scope: { test: 'value' },
        __ref: { __hasRootScope: true },
        keys: () => ['scope']
      }
      const result = parse.call(mockElement)
      expect(result.scope).toEqual({ test: 'value' })
    })

    test('should skip scope when __hasRootScope is false', () => {
      const mockElement = {
        scope: { test: 'value' },
        __ref: { __hasRootScope: false },
        keys: () => ['scope']
      }
      const result = parse.call(mockElement)
      expect(result.scope).toBeUndefined()
    })
  })
})

describe('Logging Methods', () => {
  describe('verbose', () => {
    test('should log verbose information', () => {
      const mockElement = {
        key: 'test',
        __ref: { path: ['root'] },
        keys: () => ['prop1']
      }
      verbose.call(mockElement)
      expect(console.groupCollapsed).toHaveBeenCalledWith('test')
    })

    test('should log formatted properties when args provided', () => {
      const mockElement = {
        key: 'test',
        testProp: 'testValue',
        anotherProp: 123,
        __ref: { path: ['root'] }
      }
      verbose.call(mockElement, 'testProp', 'anotherProp')

      // First call logs the path
      expect(console.log).toHaveBeenNthCalledWith(1, ['root'])

      // Then logs the formatted properties
      expect(console.log).toHaveBeenNthCalledWith(
        4,
        '%ctestProp:\n',
        'font-weight: bold',
        'testValue'
      )
      expect(console.log).toHaveBeenNthCalledWith(
        5,
        '%canotherProp:\n',
        'font-weight: bold',
        123
      )
    })
  })

  describe('logging functions', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development'
    })

    test('log should call console.log in development', () => {
      log('test')
      expect(console.log).toHaveBeenCalledWith('test')
    })

    test('warn should call console.warn in development', () => {
      warn('warning')
      expect(console.warn).toHaveBeenCalledWith('warning')
    })

    test('error should throw in development', () => {
      expect(() => error('error')).toThrow('error')
    })
  })
})

describe('Method Execution', () => {
  describe('call', () => {
    test('should execute method from context', () => {
      const mockFn = jest.fn()
      const mockElement = {
        context: {
          methods: {
            testMethod: mockFn
          },
          utils: {},
          functions: {},
          snippets: {}
        }
      }
      call.call(mockElement, 'testMethod', 'arg')
      expect(mockFn).toHaveBeenCalledWith('arg')
    })
  })
})
