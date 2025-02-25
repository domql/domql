import { jest } from '@jest/globals'
import { applyEvent } from '../on'

describe('applyEvent', () => {
  let mockElement
  let mockParam
  let mockState
  let mockContext
  let mockOptions

  beforeEach(() => {
    // Create a mock element with state and context
    mockElement = {
      state: { elementState: 'default' },
      context: { elementContext: 'default' }
    }

    // Create a spy function for param
    mockParam = jest.fn().mockReturnValue('eventResult')

    // Create mock state and context
    mockState = { customState: 'test' }
    mockContext = { customContext: 'test' }
    mockOptions = { option1: 'value1' }
  })

  test('should call param with provided element and default state/context', () => {
    // Act
    const result = applyEvent(mockParam, mockElement)

    // Assert
    expect(mockParam).toHaveBeenCalledWith(
      mockElement,
      mockElement.state,
      mockElement.context,
      undefined
    )
    expect(result).toBe('eventResult')
  })

  test('should use provided state instead of element state', () => {
    // Act
    const result = applyEvent(mockParam, mockElement, mockState)

    // Assert
    expect(mockParam).toHaveBeenCalledWith(
      mockElement,
      mockState,
      mockElement.context,
      undefined
    )
    expect(result).toBe('eventResult')
  })

  test('should use provided context instead of element context', () => {
    // Act
    const result = applyEvent(mockParam, mockElement, null, mockContext)

    // Assert
    expect(mockParam).toHaveBeenCalledWith(
      mockElement,
      mockElement.state,
      mockContext,
      undefined
    )
    expect(result).toBe('eventResult')
  })

  test('should pass through options parameter', () => {
    // Act
    const result = applyEvent(mockParam, mockElement, null, null, mockOptions)

    // Assert
    expect(mockParam).toHaveBeenCalledWith(
      mockElement,
      mockElement.state,
      mockElement.context,
      mockOptions
    )
    expect(result).toBe('eventResult')
  })

  test('should handle undefined element state and context', () => {
    // Arrange
    const elementWithoutStateContext = {}

    // Act
    const result = applyEvent(mockParam, elementWithoutStateContext)

    // Assert
    expect(mockParam).toHaveBeenCalledWith(
      elementWithoutStateContext,
      undefined,
      undefined,
      undefined
    )
    expect(result).toBe('eventResult')
  })

  test('should handle all custom parameters', () => {
    // Act
    const result = applyEvent(
      mockParam,
      mockElement,
      mockState,
      mockContext,
      mockOptions
    )

    // Assert
    expect(mockParam).toHaveBeenCalledWith(
      mockElement,
      mockState,
      mockContext,
      mockOptions
    )
    expect(result).toBe('eventResult')
  })

  test('should handle null state and use element state', () => {
    // Act
    const result = applyEvent(mockParam, mockElement, null)

    // Assert
    expect(mockParam).toHaveBeenCalledWith(
      mockElement,
      mockElement.state,
      mockElement.context,
      undefined
    )
    expect(result).toBe('eventResult')
  })

  test('should handle null context and use element context', () => {
    // Act
    const result = applyEvent(mockParam, mockElement, mockState, null)

    // Assert
    expect(mockParam).toHaveBeenCalledWith(
      mockElement,
      mockState,
      mockElement.context,
      undefined
    )
    expect(result).toBe('eventResult')
  })

  test('should preserve param return value', () => {
    // Arrange
    const expectedReturn = { custom: 'return value' }
    mockParam.mockReturnValue(expectedReturn)

    // Act
    const result = applyEvent(mockParam, mockElement)

    // Assert
    expect(result).toBe(expectedReturn)
  })
})
