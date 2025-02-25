import { detectTag } from '../cache'

describe('detectTag', () => {
  test('should return tag from props.tag if it is a valid HTML tag', () => {
    const element = {
      tag: 'something',
      key: 'key',
      props: {
        tag: 'div'
      }
    }
    expect(detectTag(element)).toBe('div')
  })

  test('should return tag if it is a valid HTML tag string', () => {
    const element = {
      tag: 'span',
      key: 'key',
      props: {}
    }
    expect(detectTag(element)).toBe('span')
  })

  test('should return key as tag if tag is true', () => {
    const element = {
      tag: true,
      key: 'div',
      props: {}
    }
    expect(detectTag(element)).toBe('div')
  })

  test('should return div as default when no valid tag is found', () => {
    const element = {
      tag: 'invalid',
      key: 'invalid',
      props: {}
    }
    expect(detectTag(element)).toBe('div')
  })

  test('should handle function as tag', () => {
    const element = {
      tag: () => 'section',
      key: 'key',
      props: {}
    }
    expect(detectTag(element)).toBe('section')
  })

  test('should parse key with dots and return valid HTML tag', () => {
    const element = {
      tag: null,
      key: 'span.className',
      props: {}
    }
    expect(detectTag(element)).toBe('span')
  })

  test('should parse key with underscore and return valid HTML tag', () => {
    const element = {
      tag: null,
      key: 'div_identifier',
      props: {}
    }
    expect(detectTag(element)).toBe('div')
  })

  test('should handle null props', () => {
    const element = {
      tag: 'p',
      key: 'key',
      props: null
    }
    expect(detectTag(element)).toBe('p')
  })

  test('should handle props.tag that is not a valid HTML tag', () => {
    const element = {
      tag: 'div',
      key: 'key',
      props: {
        tag: 'invalid-tag'
      }
    }
    expect(detectTag(element)).toBe('div')
  })

  test('should handle complex nested case', () => {
    const element = {
      tag: null,
      key: 'invalid.something_else',
      props: {
        tag: 'article'
      }
    }
    expect(detectTag(element)).toBe('article')
  })
})
