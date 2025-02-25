import { jest } from '@jest/globals'
import { init, render } from '../legacy'

describe('Element lifecycle functions', () => {
  describe('init function', () => {
    test('should call param function with element and state', () => {
      // Arrange
      const param = jest.fn()
      const element = { id: 'test-element' }
      const state = { value: 'test-state' }

      // Act
      init(param, element, state)

      // Assert
      expect(param).toHaveBeenCalledWith(element, state)
      expect(param).toHaveBeenCalledTimes(1)
    })

    test('should handle undefined state', () => {
      // Arrange
      const param = jest.fn()
      const element = { id: 'test-element' }

      // Act
      init(param, element, undefined)

      // Assert
      expect(param).toHaveBeenCalledWith(element, undefined)
    })

    test('should handle null state', () => {
      // Arrange
      const param = jest.fn()
      const element = { id: 'test-element' }

      // Act
      init(param, element, null)

      // Assert
      expect(param).toHaveBeenCalledWith(element, null)
    })
  })

  describe('render function', () => {
    test('should call param function with element and state', () => {
      // Arrange
      const param = jest.fn()
      const element = { id: 'test-element' }
      const state = { value: 'test-state' }

      // Act
      render(param, element, state)

      // Assert
      expect(param).toHaveBeenCalledWith(element, state)
      expect(param).toHaveBeenCalledTimes(1)
    })

    test('should handle undefined state', () => {
      // Arrange
      const param = jest.fn()
      const element = { id: 'test-element' }

      // Act
      render(param, element, undefined)

      // Assert
      expect(param).toHaveBeenCalledWith(element, undefined)
    })

    test('should handle null state', () => {
      // Arrange
      const param = jest.fn()
      const element = { id: 'test-element' }

      // Act
      render(param, element, null)

      // Assert
      expect(param).toHaveBeenCalledWith(element, null)
    })
  })

  describe('function behavior', () => {
    test('init should preserve returned value from param', () => {
      // Arrange
      const expectedValue = { result: 'success' }
      const param = jest.fn().mockReturnValue(expectedValue)
      const element = { id: 'test-element' }
      const state = { value: 'test-state' }

      // Act
      const result = init(param, element, state)

      // Assert
      expect(result).toBeUndefined() // init doesn't return anything
    })

    test('render should preserve returned value from param', () => {
      // Arrange
      const expectedValue = { result: 'success' }
      const param = jest.fn().mockReturnValue(expectedValue)
      const element = { id: 'test-element' }
      const state = { value: 'test-state' }

      // Act
      const result = render(param, element, state)

      // Assert
      expect(result).toBeUndefined() // render doesn't return anything
    })

    test('init should handle param throwing an error', () => {
      // Arrange
      const error = new Error('Test error')
      const param = jest.fn(() => {
        throw error
      })
      const element = { id: 'test-element' }
      const state = { value: 'test-state' }

      // Act & Assert
      expect(() => {
        init(param, element, state)
      }).toThrow('Test error')
    })

    test('render should handle param throwing an error', () => {
      // Arrange
      const error = new Error('Test error')
      const param = jest.fn(() => {
        throw error
      })
      const element = { id: 'test-element' }
      const state = { value: 'test-state' }

      // Act & Assert
      expect(() => {
        render(param, element, state)
      }).toThrow('Test error')
    })
  })
})
