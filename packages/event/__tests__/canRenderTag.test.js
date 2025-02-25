import { canRenderTag } from '../can'

// Mock the error registry
global.ERRORS_REGISTRY = {
  en: {
    HTMLInvalidTag: {
      description: 'Invalid HTML tag provided'
    }
  }
}

describe('canRenderTag', () => {
  describe('valid tags', () => {
    test('should return true for div tag', () => {
      expect(canRenderTag('div')).toBe(true)
    })

    test('should default to div and return true when tag is undefined', () => {
      expect(canRenderTag(undefined)).toBe(true)
    })

    test('should default to div and return true when tag is null', () => {
      expect(canRenderTag(null)).toBe(true)
    })

    test('should return true for common HTML tags', () => {
      const commonTags = ['p', 'span', 'button', 'input', 'a']
      commonTags.forEach(tag => {
        expect(canRenderTag(tag)).toBe(true)
      })
    })

    test('should use custom error description from registry', () => {
      // Arrange
      global.ERRORS_REGISTRY = {
        en: {
          HTMLInvalidTag: {
            description: 'Custom error description'
          }
        }
      }

      // Act
      const result = canRenderTag('invalid-tag')

      // Assert
      expect(result).toBeInstanceOf(Error)
    })
  })
})
