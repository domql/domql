import * as moduleExports from '../index'
import * as createExports from '../create'
import * as cacheExports from '../cache'
import * as appendExports from '../append'

describe('Module exports', () => {
  test('should export all items from create.js', () => {
    Object.keys(createExports).forEach(key => {
      expect(moduleExports[key]).toBeDefined()
    })
  })

  test('should export all items from cache.js', () => {
    Object.keys(cacheExports).forEach(key => {
      expect(moduleExports[key]).toBeDefined()
    })
  })

  test('should export all items from append.js', () => {
    Object.keys(appendExports).forEach(key => {
      expect(moduleExports[key]).toBeDefined()
    })
  })

  test('should have no duplicate exports', () => {
    const allExportKeys = [
      ...Object.keys(createExports),
      ...Object.keys(cacheExports),
      ...Object.keys(appendExports)
    ]
    const uniqueKeys = new Set(allExportKeys)
    expect(allExportKeys.length).toBe(uniqueKeys.size)
  })

  test('should export same values as original modules', () => {
    Object.entries(createExports).forEach(([key, value]) => {
      expect(moduleExports[key]).toBe(value)
    })

    Object.entries(cacheExports).forEach(([key, value]) => {
      expect(moduleExports[key]).toBe(value)
    })

    Object.entries(appendExports).forEach(([key, value]) => {
      expect(moduleExports[key]).toBe(value)
    })
  })

  test('should have all exports defined', () => {
    const moduleExportKeys = Object.keys(moduleExports)
    expect(moduleExportKeys.length).toBeGreaterThan(0)
    moduleExportKeys.forEach(key => {
      expect(moduleExports[key]).toBeDefined()
    })
  })
})
