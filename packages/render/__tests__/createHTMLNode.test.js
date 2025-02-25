import { createHTMLNode } from '../cache'

describe('createHTMLNode', () => {
  let element
  let mockDocument
  let mockDocumentFragment
  let mockTextNode
  let mockSvgElement
  let mockDivElement

  beforeEach(() => {
    // Setup mock document
    mockTextNode = document.createTextNode('')
    mockDocumentFragment = document.createDocumentFragment()
    mockSvgElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    )
    mockDivElement = document.createElement('div')

    mockDocument = {
      createTextNode: () => mockTextNode,
      createDocumentFragment: () => mockDocumentFragment,
      createElementNS: () => mockSvgElement,
      createElement: () => mockDivElement
    }

    // Reset element before each test
    element = {
      context: {
        document: mockDocument
      }
    }
  })

  test('should create text node when tag is string', () => {
    element.tag = 'string'
    element.text = 'Hello World'

    const result = createHTMLNode(element)

    expect(result.nodeType).toBe(Node.TEXT_NODE)
    expect(result.textContent).toBe('')
  })

  test('should create document fragment when tag is fragment', () => {
    element.tag = 'fragment'

    const result = createHTMLNode(element)

    expect(result.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE)
  })

  test('should create SVG element when tag is svg', () => {
    element.tag = 'svg'

    const result = createHTMLNode(element)

    expect(result.nodeType).toBe(Node.ELEMENT_NODE)
    expect(result.namespaceURI).toBe('http://www.w3.org/2000/svg')
    expect(result.tagName.toLowerCase()).toBe('svg')
  })

  test('should create SVG path element when tag is path', () => {
    element.tag = 'svg'

    const result = createHTMLNode(element)

    expect(result.nodeType).toBe(Node.ELEMENT_NODE)
    expect(result.namespaceURI).toBe('http://www.w3.org/2000/svg')
    expect(result.tagName.toLowerCase()).toBe('svg')
  })

  test('should create regular HTML element for standard HTML tags', () => {
    element.tag = 'div'

    const result = createHTMLNode(element)

    expect(result.nodeType).toBe(Node.ELEMENT_NODE)
    expect(result.tagName.toLowerCase()).toBe('div')
  })

  test('should create div element when no tag is provided', () => {
    delete element.tag

    const result = createHTMLNode(element)

    expect(result.nodeType).toBe(Node.ELEMENT_NODE)
    expect(result.tagName.toLowerCase()).toBe('div')
  })

  test('should use document from context if provided', () => {
    const customDoc = {
      createElement: () => {
        const el = document.createElement('custom')
        el.setAttribute('from-custom-doc', 'true')
        return el
      }
    }

    element.context.document = customDoc
    element.tag = 'div'

    const result = createHTMLNode(element)

    expect(result.getAttribute('from-custom-doc')).toBe('true')
  })

  test('should fallback to global document if context.document is not provided', () => {
    delete element.context.document
    element.tag = 'div'

    const result = createHTMLNode(element)

    expect(result.nodeType).toBe(Node.ELEMENT_NODE)
    expect(result.tagName.toLowerCase()).toBe('div')
  })
})
