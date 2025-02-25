import { jest } from '@jest/globals'
import * as methods from '../methods'

describe('State Methods', () => {
  let mockState

  beforeEach(() => {
    mockState = {
      foo: 'bar',
      count: 1,
      nested: { value: 123 },
      update: jest.fn().mockReturnThis(),
      parse: methods.parse,
      clean: methods.clean,
      set: methods.set,
      __element: {
        key: 'testElement',
        parent: { state: {} },
        __ref: { root: { state: {} } }
      },
      __children: {},
      parent: { update: jest.fn() }
    }
  })

  describe('parse', () => {
    it('should parse object state correctly', () => {
      const result = methods.parse.call(mockState)
      expect(result).toEqual({
        foo: 'bar',
        count: 1,
        nested: { value: 123 }
      })
    })

    it('should parse array state correctly', () => {
      const arrayState = ['item1', 'item2', 'update']
      const result = methods.parse.call(arrayState)
      expect(result).toEqual(['item1', 'item2'])
    })
  })

  describe('clean', () => {
    it('should remove non-method properties', () => {
      methods.clean.call(mockState)
      expect(mockState.update).toHaveBeenCalled()
      expect(mockState.foo).toBeUndefined()
    })
  })

  describe('set', () => {
    it('should set new state values', () => {
      const newValue = { newProp: 'value' }
      methods.set.call(mockState, newValue)
      expect(mockState.update).toHaveBeenCalledWith(newValue, { replace: true })
    })
  })

  describe('add', () => {
    it('should add value to array state', () => {
      const arrayState = []
      arrayState.push = jest.fn()
      arrayState.parse = jest.fn().mockReturnValue(['existing'])
      arrayState.update = jest.fn().mockReturnThis()
      arrayState[0] = 'existing'
      arrayState.length = 1

      methods.add.call(arrayState, 'newItem')
      expect(arrayState.push).toHaveBeenCalledWith('newItem')
      expect(arrayState.update).toHaveBeenCalledWith(['existing'], {
        overwrite: true
      })
    })

    it('should add value to object state', () => {
      // Create a clean state with non-enumerable methods
      const cleanMockState = {}
      Object.defineProperties(cleanMockState, {
        update: {
          value: jest.fn().mockReturnThis(),
          enumerable: false
        },
        parse: {
          value: methods.parse,
          enumerable: false
        }
      })

      methods.add.call(cleanMockState, 'newItem')
      expect(cleanMockState.update).toHaveBeenCalledWith({ 0: 'newItem' }, {})
    })
  })

  describe('toggle', () => {
    it('should toggle boolean value', () => {
      methods.toggle.call(mockState, 'testBool')
      expect(mockState.update).toHaveBeenCalledWith({ testBool: true }, {})
    })
  })

  describe('remove', () => {
    it('should remove property from state', () => {
      methods.remove.call(mockState, 'foo')
      expect(mockState.update).toHaveBeenCalled()
    })
  })

  describe('setByPath', () => {
    it('should set nested value by path', () => {
      methods.setByPath.call(mockState, ['nested', 'newValue'], 'test')
      expect(mockState.update).toHaveBeenCalled()
    })
  })

  describe('getByPath', () => {
    it('should get nested value by path', () => {
      const result = methods.getByPath.call(mockState, ['nested', 'value'])
      expect(result).toBe(123)
    })
  })

  describe('reset', () => {
    it('should reset state to parsed values', () => {
      const parsedValue = { foo: 'bar', count: 1, nested: { value: 123 } }
      mockState.parse = jest.fn().mockReturnValue(parsedValue)
      methods.reset.call(mockState)
      expect(mockState.update).toHaveBeenCalledWith(parsedValue, {
        replace: true
      })
    })
  })

  describe('apply', () => {
    it('should apply function to state', () => {
      const testFn = jest.fn().mockReturnValue({ test: true })
      methods.apply.call(mockState, testFn)
      expect(testFn).toHaveBeenCalledWith(mockState)
      expect(mockState.update).toHaveBeenCalled()
    })
  })

  describe('parentUpdate', () => {
    it('should update parent state', () => {
      methods.parentUpdate.call(mockState, { test: true })
      expect(mockState.parent.update).toHaveBeenCalled()
    })
  })

  describe('rootUpdate', () => {
    it('should update root state', () => {
      const rootState = { update: jest.fn() }
      mockState.__element.__ref.root.state = rootState
      methods.rootUpdate.call(mockState, { test: true })
      expect(rootState.update).toHaveBeenCalled()
    })
  })

  describe('quietUpdate', () => {
    it('should update state without triggering updates', () => {
      methods.quietUpdate.call(mockState, { test: true })
      expect(mockState.update).toHaveBeenCalledWith(
        { test: true },
        { preventUpdate: true }
      )
    })
  })

  describe('keys', () => {
    it('should return state keys', () => {
      const result = methods.keys.call(mockState)
      expect(result).toContain('foo')
      expect(result).toContain('count')
      expect(result).toContain('nested')
    })
  })

  describe('values', () => {
    it('should return state values', () => {
      const result = methods.values.call(mockState)
      expect(result).toContain('bar')
      expect(result).toContain(1)
    })
  })
})

describe('applyStateMethods', () => {
  let mockElement
  let state

  beforeEach(() => {
    state = { testKey: 'testValue' }
    mockElement = {
      state,
      key: 'testElement',
      parent: {
        state: { parentKey: 'parentValue' }
      },
      __ref: {
        root: {
          state: { rootKey: 'rootValue' }
        }
      }
    }
    methods.applyStateMethods(mockElement)
  })

  test('adds all state methods to the object', () => {
    const expectedMethods = [
      'clean',
      'parse',
      'destroy',
      'update',
      'rootUpdate',
      'parentUpdate',
      'create',
      'add',
      'toggle',
      'remove',
      'apply',
      'applyReplace',
      'applyFunction',
      'set',
      'quietUpdate',
      'replace',
      'quietReplace',
      'reset',
      'setByPath',
      'setPathCollection',
      'removeByPath',
      'removePathCollection',
      'getByPath',
      'keys',
      'values'
    ]

    expectedMethods.forEach(method => {
      expect(typeof state[method]).toBe('function')
    })
  })

  test('sets correct references', () => {
    expect(state.__element).toBe(mockElement)
    expect(state.parent).toBe(mockElement.parent.state)
    expect(state.root).toBe(mockElement.__ref.root.state)
    expect(state.__children).toEqual({})
  })

  test('handles array states', () => {
    const arrayState = ['item1', 'item2']
    const arrayElement = {
      state: arrayState,
      key: 'arrayElement',
      parent: {
        state: { parentKey: 'parentValue' }
      },
      __ref: {
        root: {
          state: { rootKey: 'rootValue' }
        }
      }
    }

    methods.applyStateMethods(arrayElement)

    expect(Array.isArray(arrayElement.state)).toBe(true)
    expect(typeof arrayElement.state.update).toBe('function')
    expect(arrayElement.state.__element).toBe(arrayElement)
  })

  test('connects parent-child relationship', () => {
    const childState = { childKey: 'childValue' }
    const childElement = {
      state: childState,
      key: 'childElement',
      parent: {
        state
      },
      __ref: {
        root: {
          state: { rootKey: 'rootValue' }
        }
      }
    }

    methods.applyStateMethods(childElement)

    expect(state.__children[childElement.key]).toBe(childState)
    expect(childState.parent).toBe(state)
  })
})
