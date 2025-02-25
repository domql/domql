import { keys } from '../../methods/v2'

describe('keys', () => {
  let element
  let originalConsoleError

  // Mock dependencies
  let parseFilters

  beforeAll(() => {
    // Store original console.error to restore later
    originalConsoleError = console.error
  })

  afterAll(() => {
    console.error = originalConsoleError // Restore console.error
  })

  beforeEach(() => {
    // Reset mocks before each test
    parseFilters = { elementKeys: [] }
    element = {
      validKey1: 'value1',
      validKey2: 'value2',
      [Symbol('symbolKey')]: 'symbolValue' // Test symbol (should be ignored)
    }
  })

  it('returns all keys when no filters apply', () => {
    const result = keys.call(element)
    expect(result).toEqual(['validKey1', 'validKey2'])
  })

  it('skips keys in REGISTRY but NOT in parseFilters.elementKeys', () => {
    parseFilters.elementKeys = []
    const result = keys.call(element)
    expect(result).toEqual(['validKey1', 'validKey2'])
  })

  it('includes keys in both REGISTRY and parseFilters.elementKeys', () => {
    parseFilters.elementKeys = ['validKey1']
    const result = keys.call(element)
    expect(result).toEqual(['validKey1', 'validKey2'])
  })

  it('includes keys in parseFilters.elementKeys but not REGISTRY', () => {
    parseFilters.elementKeys = ['validKey1']
    const result = keys.call(element)
    expect(result).toEqual(['validKey1', 'validKey2'])
  })

  it('handles mixed exclusion scenarios', () => {
    parseFilters.elementKeys = ['validKey3']
    element.validKey3 = 'value3'
    element.validKey4 = 'value4'

    const result = keys.call(element)
    expect(result).toEqual(['validKey1', 'validKey2', 'validKey3', 'validKey4'])
  })

  it('returns empty array for empty element', () => {
    element = {}
    const result = keys.call(element)
    expect(result).toEqual([])
  })

  it('should not ignores inherited properties', () => {
    const parent = { inheritedKey: 'parentValue' }
    const child = Object.create(parent)
    child.ownKey = 'childValue'

    const result = keys.call(child)
    expect(result).toEqual(['ownKey', 'inheritedKey'])
  })

  it('ignores symbol keys (for...in behavior)', () => {
    const result = keys.call(element)
    expect(result).not.toContain(Symbol('symbolKey'))
  })

  it('handles edge case where filter list contains non-existent keys', () => {
    parseFilters.elementKeys = ['nonExistentKey']
    const result = keys.call(element)
    expect(result).toEqual(['validKey1', 'validKey2'])
  })
})
