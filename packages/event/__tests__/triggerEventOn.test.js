import { jest } from '@jest/globals'
import { triggerEventOn } from '../on'

describe('triggerEventOn', () => {
  let mockElement
  let mockEventHandler
  let mockOptions

  beforeEach(() => {
    mockEventHandler = jest.fn().mockResolvedValue('eventResult')
    mockOptions = { option1: 'value1' }

    mockElement = {
      state: { elementState: 'test' },
      context: { elementContext: 'test' },
      on: {},
      props: {}
    }
  })

  describe('event resolution', () => {
    test('should trigger event from on property', async () => {
      // Arrange
      mockElement.on.click = mockEventHandler

      // Act
      const result = await triggerEventOn('click', mockElement, mockOptions)

      // Assert
      expect(result).toBe('eventResult')
      expect(mockEventHandler).toHaveBeenCalledWith(
        mockElement,
        mockElement.state,
        mockElement.context,
        mockOptions
      )
    })

    test('should trigger event from props using camelCase', async () => {
      // Arrange
      mockElement.props.onClick = mockEventHandler

      // Act
      const result = await triggerEventOn('click', mockElement, mockOptions)

      // Assert
      expect(result).toBe('eventResult')
      expect(mockEventHandler).toHaveBeenCalledWith(
        mockElement,
        mockElement.state,
        mockElement.context,
        mockOptions
      )
    })

    test('should prioritize on property over props', async () => {
      // Arrange
      const onEventHandler = jest.fn().mockResolvedValue('onResult')
      const propsEventHandler = jest.fn().mockResolvedValue('propsResult')

      mockElement.on.click = onEventHandler
      mockElement.props.onClick = propsEventHandler

      // Act
      const result = await triggerEventOn('click', mockElement, mockOptions)

      // Assert
      expect(result).toBe('onResult')
      expect(onEventHandler).toHaveBeenCalled()
      expect(propsEventHandler).not.toHaveBeenCalled()
    })
  })

  describe('event parameters', () => {
    test('should pass state and context correctly', async () => {
      // Arrange
      mockElement.on.click = mockEventHandler
      mockElement.state = { custom: 'state' }
      mockElement.context = { custom: 'context' }

      // Act
      await triggerEventOn('click', mockElement, mockOptions)

      // Assert
      expect(mockEventHandler).toHaveBeenCalledWith(
        mockElement,
        mockElement.state,
        mockElement.context,
        mockOptions
      )
    })

    test('should handle missing state and context', async () => {
      // Arrange
      mockElement = {
        on: { click: mockEventHandler }
      }

      // Act
      await triggerEventOn('click', mockElement, mockOptions)

      // Assert
      expect(mockEventHandler).toHaveBeenCalledWith(
        mockElement,
        undefined,
        undefined,
        mockOptions
      )
    })

    test('should handle missing options', async () => {
      // Arrange
      mockElement.on.click = mockEventHandler

      // Act
      await triggerEventOn('click', mockElement)

      // Assert
      expect(mockEventHandler).toHaveBeenCalledWith(
        mockElement,
        mockElement.state,
        mockElement.context,
        undefined
      )
    })
  })

  describe('event naming', () => {
    test('should handle various event names correctly', async () => {
      const eventTests = [
        { input: 'mouseenter', prop: 'onMouseenter' },
        { input: 'mouseleave', prop: 'onMouseleave' },
        { input: 'submit', prop: 'onSubmit' },
        { input: 'change', prop: 'onChange' }
      ]

      for (const { input, prop } of eventTests) {
        // Arrange
        mockElement.props[prop] = mockEventHandler

        // Act
        await triggerEventOn(input, mockElement, mockOptions)

        // Assert
        expect(mockEventHandler).toHaveBeenCalledWith(
          mockElement,
          mockElement.state,
          mockElement.context,
          mockOptions
        )

        // Reset for next test
        mockElement.props[prop] = undefined
        mockEventHandler.mockClear()
      }
    })
  })

  describe('edge cases', () => {
    test('should return undefined when no event handler exists', async () => {
      // Act
      const result = await triggerEventOn('click', mockElement, mockOptions)

      // Assert
      expect(result).toBeUndefined()
    })

    test('should handle rejection in event handler', async () => {
      // Arrange
      const error = new Error('Event handler error')
      mockElement.on.click = jest.fn().mockRejectedValue(error)

      // Act & Assert
      await expect(
        triggerEventOn('click', mockElement, mockOptions)
      ).rejects.toThrow('Event handler error')
    })

    test('should throw error for non-function event handlers', async () => {
      // Arrange
      mockElement.on.click = 'not a function'

      // Act & Assert
      await expect(
        triggerEventOn('click', mockElement, mockOptions)
      ).rejects.toThrow('param.call is not a function')
    })

    test('should handle undefined element', async () => {
      // Assert
      await expect(
        triggerEventOn('click', undefined, mockOptions)
      ).rejects.toThrow('Element is required')
    })

    test('should handle null element', async () => {
      // Assert
      await expect(triggerEventOn('click', null, mockOptions)).rejects.toThrow(
        'Element is required'
      )
    })
  })
})
