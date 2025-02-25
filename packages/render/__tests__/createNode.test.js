import { createNode } from '../create'

describe('createNode', () => {
  test('should return a value when element is provided', () => {
    const element = {}
    const result = createNode(element)
    expect(result).toBe(undefined)
  })
})
