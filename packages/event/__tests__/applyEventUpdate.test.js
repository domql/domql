import { jest } from '@jest/globals'
import { applyEventUpdate } from '../on'

describe('applyEventUpdate', () => {
  let mockElement
  let mockParam
  let mockUpdatedObj
  let mockState
  let mockContext
  let mockOptions

  beforeEach(() => {
    // Setup mock element with default state and context
    mockElement = {
      state: { elementState: 'default' },
      context: { elementContext: 'default' }
    }

    // Create mock event handler
    mockParam = jest.fn().mockReturnValue('eventResult')

    // Setup other test parameters
    mockUpdatedObj = { updated: 'value' }
    mockState = { customState: 'test' }
    mockContext = { customContext: 'test' }
    mockOptions = { option1: 'value1' }
  })

  test('should call param with all provided parameters', () => {
    // Act
    const result = applyEventUpdate(
      mockParam,
      mockUpdatedObj,
      mockElement,
      mockState,
      mockContext,
      mockOptions
    )

    // Assert
    expect(mockParam).toHaveBeenCalledWith(
      mockUpdatedObj,
      mockElement,
      mockState,
      mockContext,
      mockOptions
    )
    expect(result).toBe('eventResult')
  })

  test('should use element state when state is not provided', () => {
    // Act
    const result = applyEventUpdate(
      mockParam,
      mockUpdatedObj,
      mockElement,
      null,
      mockContext,
      mockOptions
    )

    // Assert
    expect(mockParam).toHaveBeenCalledWith(
      mockUpdatedObj,
      mockElement,
      mockElement.state,
      mockContext,
      mockOptions
    )
    expect(result).toBe('eventResult')
  })

  test('should use element context when context is not provided', () => {
    // Act
    const result = applyEventUpdate(
      mockParam,
      mockUpdatedObj,
      mockElement,
      mockState,
      null,
      mockOptions
    )

    // Assert
    expect(mockParam).toHaveBeenCalledWith(
      mockUpdatedObj,
      mockElement,
      mockState,
      mockElement.context,
      mockOptions
    )
    expect(result).toBe('eventResult')
  })

  test('should handle undefined state and context in element', () => {
    // Arrange
    const elementWithoutStateContext = {}

    // Act
    const result = applyEventUpdate(
      mockParam,
      mockUpdatedObj,
      elementWithoutStateContext,
      null,
      null,
      mockOptions
    )

    // Assert
    expect(mockParam).toHaveBeenCalledWith(
      mockUpdatedObj,
      elementWithoutStateContext,
      undefined,
      undefined,
      mockOptions
    )
    expect(result).toBe('eventResult')
  })

  test('should handle missing options parameter', () => {
    // Act
    const result = applyEventUpdate(
      mockParam,
      mockUpdatedObj,
      mockElement,
      mockState,
      mockContext
    )

    // Assert
    expect(mockParam).toHaveBeenCalledWith(
      mockUpdatedObj,
      mockElement,
      mockState,
      mockContext,
      undefined
    )
    expect(result).toBe('eventResult')
  })

  test('should preserve function context (this binding)', () => {
    // Arrange
    mockParam = jest.fn(function () {
      return this === mockElement
    })

    // Act
    const result = applyEventUpdate(
      mockParam,
      mockUpdatedObj,
      mockElement,
      mockState,
      mockContext
    )

    // Assert
    expect(result).toBe(true)
  })

  test('should throw error when param is not a function', () => {
    // Arrange
    const invalidParam = 'not a function'

    // Act & Assert
    expect(() => {
      applyEventUpdate(
        invalidParam,
        mockUpdatedObj,
        mockElement,
        mockState,
        mockContext
      )
    }).toThrow(TypeError)
  })

  test('should handle empty updatedObj', () => {
    // Act
    const result = applyEventUpdate(
      mockParam,
      {},
      mockElement,
      mockState,
      mockContext
    )

    // Assert
    expect(mockParam).toHaveBeenCalledWith(
      {},
      mockElement,
      mockState,
      mockContext,
      undefined
    )
    expect(result).toBe('eventResult')
  })

  test('should pass through return value from param', () => {
    // Arrange
    const expectedReturn = { custom: 'return value' }
    mockParam.mockReturnValue(expectedReturn)

    // Act
    const result = applyEventUpdate(
      mockParam,
      mockUpdatedObj,
      mockElement,
      mockState,
      mockContext
    )

    // Assert
    expect(result).toBe(expectedReturn)
  })
})
