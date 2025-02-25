import { isHtmlElement } from '..'

describe('isHtmlElement', () => {
  test('returns true for valid HTML element', () => {
    const div = document.createElement('div')
    expect(isHtmlElement(div)).toBe(true)
  })

  test('returns false for non-HTML element object', () => {
    const obj = { key: 'value' }
    expect(isHtmlElement(obj)).toBe(false)
  })

  test('returns false for null object', () => {
    expect(isHtmlElement(null)).toBe(false)
  })

  test('returns false for undefined object', () => {
    expect(isHtmlElement(undefined)).toBe(false)
  })
})
