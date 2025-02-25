import { jest } from '@jest/globals'
import { cacheNode } from '../cache'

describe('cacheNode', () => {
  // Setup mock window and document for each test
  let mockNode
  let mockTextNode
  let mockFragmentNode
  let mockSvgNode

  beforeEach(() => {
    mockNode = {
      cloneNode: jest.fn().mockReturnThis()
    }
    mockTextNode = {
      cloneNode: jest.fn().mockReturnThis(),
      nodeValue: null
    }
    mockFragmentNode = {
      cloneNode: jest.fn().mockReturnThis()
    }
    mockSvgNode = {
      cloneNode: jest.fn().mockReturnThis()
    }

    global.window = {
      nodeCaches: {}
    }
    global.document = {
      createElement: jest.fn().mockReturnValue(mockNode),
      createTextNode: jest.fn().mockReturnValue(mockTextNode),
      createDocumentFragment: jest.fn().mockReturnValue(mockFragmentNode),
      createElementNS: jest.fn().mockReturnValue(mockSvgNode)
    }
  })

  test('should return cached node for div element', () => {
    const element = {
      tag: 'div',
      context: {
        window,
        document
      }
    }
    const result = cacheNode(element)
    expect(result).toBeTruthy()
  })

  test('should return text node for string element', () => {
    const element = {
      tag: 'string',
      text: 'Hello World',
      context: {
        window,
        document
      }
    }
    const result = cacheNode(element)
    expect(result).toBeTruthy()
  })

  test('should return fragment node', () => {
    const element = {
      tag: 'fragment',
      context: {
        window,
        document
      }
    }
    const result = cacheNode(element)
    expect(result).toBeTruthy()
  })

  test('should return svg node', () => {
    const element = {
      tag: 'svg',
      context: {
        window,
        document
      }
    }
    const result = cacheNode(element)
    expect(result).toBeTruthy()
  })

  test('should return path node', () => {
    const element = {
      tag: 'path',
      context: {
        window,
        document
      }
    }
    const result = cacheNode(element)
    expect(result).toBeTruthy()
  })

  test('should reuse cached node for same tag', () => {
    const element = {
      tag: 'span',
      context: {
        window,
        document
      }
    }
    const firstResult = cacheNode(element)
    const secondResult = cacheNode(element)
    expect(firstResult).toBeTruthy()
    expect(secondResult).toBeTruthy()
  })

  test('should set nodeValue for string elements', () => {
    const element = {
      tag: 'string',
      text: 'Test Text',
      context: {
        window,
        document
      }
    }
    const result = cacheNode(element)
    expect(result).toBeTruthy()
  })

  test('should use window from context if provided', () => {
    const customWindow = { nodeCaches: {} }
    const element = {
      tag: 'div',
      context: {
        window: customWindow,
        document
      }
    }
    const result = cacheNode(element)
    expect(result).toBeTruthy()
  })

  test('should use document from context if provided', () => {
    const customDocument = {
      createElement: jest.fn().mockReturnValue(mockNode),
      createTextNode: jest.fn().mockReturnValue(mockTextNode),
      createDocumentFragment: jest.fn().mockReturnValue(mockFragmentNode),
      createElementNS: jest.fn().mockReturnValue(mockSvgNode)
    }
    const element = {
      tag: 'div',
      context: {
        window,
        document: customDocument
      }
    }
    const result = cacheNode(element)
    expect(result).toBeTruthy()
  })

  test('should initialize nodeCaches if not present', () => {
    global.window = {}
    const element = {
      tag: 'div',
      context: {
        window,
        document
      }
    }
    const result = cacheNode(element)
    expect(result).toBeTruthy()
  })
})
