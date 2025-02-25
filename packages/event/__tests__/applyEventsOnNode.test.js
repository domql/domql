import { jest } from '@jest/globals'
import { applyEventsOnNode } from '../on'

describe('applyEventsOnNode', () => {
  let mockElement
  let mockNode
  let mockEventHandler
  let mockOptions
  let addEventListenerSpy

  beforeEach(() => {
    // Create mock event handler
    mockEventHandler = jest.fn().mockResolvedValue('eventResult')

    // Create mock node with addEventListener
    mockNode = {
      addEventListener: jest.fn((eventName, handler) => {
        // Store the handler for testing
        mockNode.handlers = mockNode.handlers || {}
        mockNode.handlers[eventName] = handler
      })
    }

    addEventListenerSpy = jest.spyOn(mockNode, 'addEventListener')

    // Create mock element
    mockElement = {
      node: mockNode,
      state: { testState: 'state' },
      context: { testContext: 'context' },
      on: {},
      props: {}
    }

    mockOptions = { option1: 'value1' }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('event registration', () => {
    test('should register click event listener', () => {
      // Arrange
      mockElement.on.click = mockEventHandler

      // Act
      applyEventsOnNode(mockElement, mockOptions)

      // Assert
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      )
    })

    test('should handle multiple events', () => {
      // Arrange
      mockElement.on = {
        click: mockEventHandler,
        mouseover: mockEventHandler,
        submit: mockEventHandler
      }

      // Act
      applyEventsOnNode(mockElement, mockOptions)

      // Assert
      expect(addEventListenerSpy).toHaveBeenCalledTimes(3)
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      )
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mouseover',
        expect.any(Function)
      )
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'submit',
        expect.any(Function)
      )
    })
  })

  describe('excluded events', () => {
    const excludedEvents = [
      'init',
      'beforeClassAssign',
      'render',
      'renderRouter',
      'attachNode',
      'stateInit',
      'stateCreated',
      'beforeStateUpdate',
      'stateUpdate',
      'beforeUpdate',
      'done',
      'create',
      'complete',
      'frame',
      'update'
    ]

    test.each(excludedEvents)(
      'should not register listener for %s event',
      eventName => {
        // Arrange
        mockElement.on[eventName] = mockEventHandler

        // Act
        applyEventsOnNode(mockElement, mockOptions)

        // Assert
        expect(addEventListenerSpy).not.toHaveBeenCalled()
      }
    )
  })

  describe('event handling', () => {
    test('should call handler with correct parameters when event triggered', async () => {
      // Arrange
      mockElement.on.click = mockEventHandler
      const mockEvent = { type: 'click' }

      // Act
      applyEventsOnNode(mockElement, mockOptions)

      // Get and call the registered handler
      await mockNode.handlers.click(mockEvent)

      // Assert
      expect(mockEventHandler).toHaveBeenCalledWith(
        mockEvent,
        mockElement,
        mockElement.state,
        mockElement.context,
        mockOptions
      )
    })

    test('should maintain correct this context in handler', async () => {
      // Arrange
      mockElement.on.click = function () {
        expect(this).toBe(mockElement)
      }
      const mockEvent = { type: 'click' }

      // Act
      applyEventsOnNode(mockElement, mockOptions)
      await mockNode.handlers.click(mockEvent)
    })
  })

  describe('error handling', () => {
    test('should not register listener for non-function handlers', () => {
      // Arrange
      mockElement.on.click = 'not a function'

      // Act
      applyEventsOnNode(mockElement, mockOptions)

      // Assert
      expect(addEventListenerSpy).not.toHaveBeenCalled()
    })

    test('should handle async handler rejection', async () => {
      // Arrange
      const error = new Error('Handler error')
      mockElement.on.click = jest.fn().mockRejectedValue(error)
      const mockEvent = { type: 'click' }

      // Act
      applyEventsOnNode(mockElement, mockOptions)

      // Assert
      await expect(mockNode.handlers.click(mockEvent)).rejects.toThrow(
        'Handler error'
      )
    })
  })

  describe('edge cases', () => {
    test('should handle missing state and context', async () => {
      // Arrange
      mockElement = {
        node: mockNode,
        on: { click: mockEventHandler }
      }
      const mockEvent = { type: 'click' }

      // Act
      applyEventsOnNode(mockElement, mockOptions)
      await mockNode.handlers.click(mockEvent)

      // Assert
      expect(mockEventHandler).toHaveBeenCalledWith(
        mockEvent,
        mockElement,
        undefined,
        undefined,
        mockOptions
      )
    })

    test('should handle empty on object', () => {
      // Arrange
      mockElement.on = {}

      // Act
      applyEventsOnNode(mockElement, mockOptions)

      // Assert
      expect(addEventListenerSpy).not.toHaveBeenCalled()
    })
  })
})
