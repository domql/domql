import { generateKey } from '../key'

describe('generateKey', () => {
  test('should generate incrementing unique keys', () => {
    const key1 = generateKey()
    const key2 = generateKey()
    const key3 = generateKey()

    expect(key1).toBe(1)
    expect(key2).toBe(2)
    expect(key3).toBe(3)
  })

  test('should always return numbers', () => {
    const key = generateKey()
    expect(typeof key).toBe('number')
  })

  test('should generate sequential numbers', () => {
    const current = generateKey()
    const next = generateKey()
    expect(next).toBe(current + 1)
  })
})
