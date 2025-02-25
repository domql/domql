import * as moduleExports from '../index'

describe('Module exports', () => {
  // Expected exports from on.js
  test('should export on.js functions', () => {
    expect(moduleExports).toHaveProperty('applyEvent')
    expect(typeof moduleExports.applyEvent).toBe('function')

    expect(moduleExports).toHaveProperty('triggerEventOn')
    expect(typeof moduleExports.triggerEventOn).toBe('function')

    expect(moduleExports).toHaveProperty('applyEventUpdate')
    expect(typeof moduleExports.applyEventUpdate).toBe('function')

    expect(moduleExports).toHaveProperty('triggerEventOnUpdate')
    expect(typeof moduleExports.triggerEventOnUpdate).toBe('function')

    expect(moduleExports).toHaveProperty('applyEventsOnNode')
    expect(typeof moduleExports.applyEventsOnNode).toBe('function')
  })

  // Expected exports from can.js
  test('should export can.js functions', () => {
    expect(moduleExports).toHaveProperty('canRenderTag')
    expect(typeof moduleExports.canRenderTag).toBe('function')
  })

  // Expected exports from animationFrame.js
  test('should export animationFrame.js functions', () => {
    expect(moduleExports).toHaveProperty('initAnimationFrame')
    expect(typeof moduleExports.initAnimationFrame).toBe('function')

    expect(moduleExports).toHaveProperty('registerFrameListener')
    expect(typeof moduleExports.registerFrameListener).toBe('function')

    expect(moduleExports).toHaveProperty('applyAnimationFrame')
    expect(typeof moduleExports.applyAnimationFrame).toBe('function')
  })
})
