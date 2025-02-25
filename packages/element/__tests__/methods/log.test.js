import { jest } from '@jest/globals'
import { log } from '../../methods/v2'

describe('log', () => {
  let element, originalConsole

  beforeAll(() => {
    // Store original console methods
    originalConsole = { ...console }
  })

  beforeEach(() => {
    // Create a clean element for each test
    element = {
      key: 'test-element',
      __ref: { path: '/test/path' },
      keys: jest.fn().mockReturnValue(['prop1', 'prop2']),
      prop1: 'value1',
      prop2: 'value2'
    }

    // Disable actual console logging
    console.log = jest.fn()
    console.group = jest.fn()
    console.groupEnd = jest.fn()
  })

  afterAll(() => {
    // Restore original console methods
    console.log = originalConsole.log
    console.group = originalConsole.group
    console.groupEnd = originalConsole.groupEnd
  })

  it('always returns the element instance', () => {
    const result = log.call(element)
    expect(result).toBe(element)
  })

  it('returns element when called with arguments', () => {
    const result = log.call(element, 'prop1', 'prop2')
    expect(result).toBe(element)
  })

  it('returns element when called without arguments', () => {
    const result = log.call(element)
    expect(result).toBe(element)
  })

  it('returns element even with missing __ref', () => {
    delete element.__ref
    const result = log.call(element)
    expect(result).toBe(element)
  })

  it('returns element when missing element.key', () => {
    delete element.key
    const result = log.call(element)
    expect(result).toBe(element)
  })

  it('returns element with empty properties', () => {
    const emptyElement = { log, keys: jest.fn().mockReturnValue([]) }
    const result = log.call(emptyElement)
    expect(result).toBe(emptyElement)
  })

  it('returns element when called with non-existent properties', () => {
    const result = log.call(element, 'nonExistentProp')
    expect(result).toBe(element)
  })
})
