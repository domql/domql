import { jest } from '@jest/globals'

import {
  debounce,
  debounceOnContext,
  memoize,
  isStringFunction,
  cloneFunction
} from '../function'

describe('debounce', () => {
  jest.useFakeTimers()

  it('debounces a function call', () => {
    const func = jest.fn()
    const debouncedFunc = debounce(func, 100)

    debouncedFunc()
    debouncedFunc()
    debouncedFunc()

    expect(func).not.toBeCalled()

    jest.runAllTimers()

    expect(func).toHaveBeenCalledTimes(1)
  })

  it('executes immediately if immediate flag is true', () => {
    const func = jest.fn()
    const debouncedFunc = debounce(func, 100, true)

    debouncedFunc()

    expect(func).toHaveBeenCalledTimes(1)
  })
})

describe('debounceOnContext', () => {
  jest.useFakeTimers()

  it('debounces a function call with context', () => {
    const context = { value: 0 }
    const func = function () {
      this.value++
    }
    const debouncedFunc = debounceOnContext(context, func, 100)

    debouncedFunc()
    debouncedFunc()
    debouncedFunc()

    expect(context.value).toBe(0)

    jest.runAllTimers()

    expect(context.value).toBe(1)
  })
})

describe('memoize', () => {
  it('caches function results', () => {
    const fn = jest.fn(x => x * 2)
    const memoizedFn = memoize(fn)

    expect(memoizedFn(5)).toBe(10)
    expect(memoizedFn(5)).toBe(10)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('caches different results for different inputs', () => {
    const fn = jest.fn(x => x * 2)
    const memoizedFn = memoize(fn)

    expect(memoizedFn(5)).toBe(10)
    expect(memoizedFn(3)).toBe(6)
    expect(fn).toHaveBeenCalledTimes(2)
  })
})

describe('isStringFunction', () => {
  it('identifies regular function strings', () => {
    expect(isStringFunction('function() { return true }')).toBe(true)
    expect(isStringFunction('function(x, y) { return x + y }')).toBe(true)
  })

  it('identifies arrow function strings', () => {
    expect(isStringFunction('() => true')).toBe(true)
    expect(isStringFunction('(x, y) => x + y')).toBe(true)
  })

  it('rejects non-function strings', () => {
    expect(isStringFunction('not a function')).toBe(false)
    expect(isStringFunction('')).toBe(false)
  })
})

describe('cloneFunction', () => {
  it('clones a function with properties', () => {
    const original = function () {
      return 42
    }
    original.prop = 'test'

    const cloned = cloneFunction(original)

    expect(cloned()).toBe(42)
    expect(cloned.prop).toBe('test')
  })

  it('maintains function context', () => {
    const context = { value: 42 }
    const original = function () {
      return this.value
    }
    const cloned = cloneFunction(original, context)

    expect(cloned()).toBe(42)
  })
})
