import eventRegistry from '../store'

describe('eventRegistry', () => {
  test('should have the correct initial structure', () => {
    expect(eventRegistry).toEqual({
      click: [],
      render: []
    })
  })

  test('should have empty arrays as initial values', () => {
    expect(Array.isArray(eventRegistry.click)).toBe(true)
    expect(Array.isArray(eventRegistry.render)).toBe(true)
    expect(eventRegistry.click.length).toBe(0)
    expect(eventRegistry.render.length).toBe(0)
  })

  test('should allow adding items to click array', () => {
    // Arrange
    const clickHandler = () => {}

    // Act
    eventRegistry.click.push(clickHandler)

    // Assert
    expect(eventRegistry.click).toContain(clickHandler)
    expect(eventRegistry.click.length).toBe(1)

    // Cleanup
    eventRegistry.click.length = 0
  })

  test('should allow adding items to render array', () => {
    // Arrange
    const renderHandler = () => {}

    // Act
    eventRegistry.render.push(renderHandler)

    // Assert
    expect(eventRegistry.render).toContain(renderHandler)
    expect(eventRegistry.render.length).toBe(1)

    // Cleanup
    eventRegistry.render.length = 0
  })

  test('should maintain separate arrays for different events', () => {
    // Arrange
    const clickHandler = () => {}
    const renderHandler = () => {}

    // Act
    eventRegistry.click.push(clickHandler)
    eventRegistry.render.push(renderHandler)

    // Assert
    expect(eventRegistry.click).toContain(clickHandler)
    expect(eventRegistry.click).not.toContain(renderHandler)
    expect(eventRegistry.render).toContain(renderHandler)
    expect(eventRegistry.render).not.toContain(clickHandler)

    // Cleanup
    eventRegistry.click.length = 0
    eventRegistry.render.length = 0
  })

  test('should allow array operations on event arrays', () => {
    // Test various array operations
    const handler1 = () => {}
    const handler2 = () => {}

    // Push
    eventRegistry.click.push(handler1)
    expect(eventRegistry.click).toContain(handler1)

    // Push multiple
    eventRegistry.click.push(handler2)
    expect(eventRegistry.click).toEqual([handler1, handler2])

    // Pop
    const popped = eventRegistry.click.pop()
    expect(popped).toBe(handler2)
    expect(eventRegistry.click).toEqual([handler1])

    // Cleanup
    eventRegistry.click.length = 0
  })

  test('should have independent arrays', () => {
    expect(eventRegistry.click).not.toBe(eventRegistry.render)
  })
})
