import { jest } from '@jest/globals'
import { createState } from '../legacy'

describe('createState', () => {
  let mockState
  let mockElement
  let mockCreateStateHandler

  beforeEach(() => {
    // Set up test data
    mockState = { value: 'test' }
    mockCreateStateHandler = jest.fn()
    mockElement = {
      id: 'test-element',
      on: {
        createState: mockCreateStateHandler
      },
      props: { someProp: 'value' }
    }
  })

  test('should call on.createState with state and element (without on property)', () => {
    // Act
    createState(mockState, mockElement)

    // Assert
    expect(mockCreateStateHandler).toHaveBeenCalledTimes(1)
    expect(mockCreateStateHandler).toHaveBeenCalledWith(mockState, {
      id: 'test-element',
      props: { someProp: 'value' }
    })
  })

  test('should not include on property in element passed to createState', () => {
    // Act
    createState(mockState, mockElement)

    // Assert
    const elementPassedToHandler = mockCreateStateHandler.mock.calls[0][1]
    expect(elementPassedToHandler).not.toHaveProperty('on')
  })

  test('should handle element without on property', () => {
    // Arrange
    const elementWithoutOn = {
      id: 'test-element',
      props: { someProp: 'value' }
    }

    // Act
    createState(mockState, elementWithoutOn)

    // Assert
    expect(mockCreateStateHandler).not.toHaveBeenCalled()
  })

  test('should handle element with on property but without createState', () => {
    // Arrange
    const elementWithoutCreateState = {
      id: 'test-element',
      on: {
        otherHandler: () => {}
      },
      props: { someProp: 'value' }
    }

    // Act
    createState(mockState, elementWithoutCreateState)

    // Assert
    expect(mockCreateStateHandler).not.toHaveBeenCalled()
  })

  test('should pass all element properties except on to the createState handler', () => {
    // Arrange
    const complexElement = {
      id: 'complex-element',
      on: {
        createState: mockCreateStateHandler
      },
      props: { someProp: 'value' },
      data: { someData: 'data value' },
      methods: {
        someMethod: () => {}
      }
    }

    // Act
    createState(mockState, complexElement)

    // Assert
    expect(mockCreateStateHandler).toHaveBeenCalledWith(mockState, {
      id: 'complex-element',
      props: { someProp: 'value' },
      data: { someData: 'data value' },
      methods: {
        someMethod: expect.any(Function)
      }
    })
  })

  test('should handle null state', () => {
    // Act
    createState(null, mockElement)

    // Assert
    expect(mockCreateStateHandler).toHaveBeenCalledWith(
      null,
      expect.any(Object)
    )
  })

  test('should handle undefined state', () => {
    // Act
    createState(undefined, mockElement)

    // Assert
    expect(mockCreateStateHandler).toHaveBeenCalledWith(
      undefined,
      expect.any(Object)
    )
  })
})
