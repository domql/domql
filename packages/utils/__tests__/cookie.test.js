import { jest } from '@jest/globals'

import {
  setCookie,
  getCookie,
  removeCookie,
  getLocalStorage,
  setLocalStorage
} from '../cookie.js'

// Mock document object
const mockDocument = {
  cookie: ''
}

describe('Cookie and Storage Utils', () => {
  let mockStorage
  let setItemSpy
  let getItemSpy

  beforeEach(() => {
    // Reset mocks before each test
    mockDocument.cookie = ''
    mockStorage = {}

    // Create storage mock with spies
    const localStorageMock = {
      getItem: key => mockStorage[key] || null,
      setItem: (key, value) => {
        mockStorage[key] = value
      }
    }

    // Set up global objects
    global.document = mockDocument
    global.window = {
      localStorage: localStorageMock
    }
    global.navigator = { userAgent: '' }

    // Create spies after setting up the mock
    setItemSpy = jest.spyOn(window.localStorage, 'setItem')
    getItemSpy = jest.spyOn(window.localStorage, 'getItem')
  })

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks()
  })

  describe('Cookie Operations', () => {
    it('should set a cookie', () => {
      setCookie('testCookie', 'testValue')
      expect(document.cookie).toContain('testCookie=testValue')
    })

    it('should get a cookie value', () => {
      document.cookie = 'testCookie=testValue'
      expect(getCookie('testCookie')).toBe('testValue')
    })

    it('should handle missing cookie', () => {
      expect(getCookie('nonexistent')).toBe('')
    })

    it('should remove a cookie', () => {
      document.cookie = 'testCookie=testValue'
      removeCookie('testCookie')
      expect(document.cookie).not.toContain('testCookie=testValue')
    })

    it('should handle undefined document gracefully', () => {
      global.document = undefined
      expect(() => setCookie('test', 'value')).not.toThrow()
      expect(() => getCookie('test')).not.toThrow()
      expect(() => removeCookie('test')).not.toThrow()
    })
  })

  describe('localStorage Utils', () => {
    let mockStorage

    beforeEach(() => {
      mockStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      }

      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: true
      })
    })

    describe('setLocalStorage', () => {
      it('should save object data to localStorage', () => {
        const testData = { name: 'John', age: 30 }
        setLocalStorage('testKey', testData)

        expect(window.localStorage.setItem).toHaveBeenCalledWith(
          'testKey',
          JSON.stringify(testData)
        )
      })

      it('should save primitive data to localStorage', () => {
        setLocalStorage('testKey', 'testValue')
        expect(window.localStorage.setItem).toHaveBeenCalledWith(
          'testKey',
          'testValue'
        )
      })

      it('should not save undefined or null data', () => {
        setLocalStorage('testKey', undefined)
        setLocalStorage('testKey', null)

        expect(window.localStorage.setItem).not.toHaveBeenCalled()
      })
    })

    describe('getLocalStorage', () => {
      it('should retrieve and parse JSON data from localStorage', () => {
        const testData = { name: 'John', age: 30 }
        mockStorage.getItem.mockReturnValue(JSON.stringify(testData))

        const result = getLocalStorage('testKey')
        expect(result).toEqual(testData)
      })

      it('should return undefined for non-existent keys', () => {
        mockStorage.getItem.mockReturnValue(null)

        const result = getLocalStorage('nonExistentKey')
        expect(result).toBeUndefined()
      })

      it('should handle invalid JSON gracefully', () => {
        mockStorage.getItem.mockReturnValue('invalid JSON')

        const result = getLocalStorage('testKey')
        expect(result).toBeUndefined()
      })
    })
  })
})
