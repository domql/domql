import { deepMerge } from '..'

describe('deepMerge', () => {
  test('should merge two objects with nested properties', () => {
    const obj1 = {
      a: {
        b: 1,
        c: {
          d: 2
        }
      },
      e: 3
    }
    const obj2 = {
      a: {
        b: 4,
        c: {
          d: 5,
          f: 6
        }
      },
      g: 7
    }
    const expected = {
      a: {
        b: 1,
        c: {
          d: 2,
          f: 6
        }
      },
      e: 3,
      g: 7
    }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual(expected)
  })

  test('should overwrite existing properties at the top level', () => {
    const obj1 = {
      a: 1,
      b: 2
    }
    const obj2 = {
      a: 3,
      c: 4
    }
    const expected = {
      a: 1,
      b: 2,
      c: 4
    }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual(expected)
  })

  test('should overwrite existing nested properties', () => {
    const obj1 = {
      a: {
        b: 1,
        c: 2
      },
      d: 3
    }
    const obj2 = {
      a: {
        b: 4
      },
      e: 5
    }
    const expected = {
      a: {
        b: 1,
        c: 2
      },
      d: 3,
      e: 5
    }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual(expected)
  })

  test('should ignore properties named "parent" and "props"', () => {
    const obj1 = {
      a: 1
    }
    const obj2 = {
      a: 4,
      parent: 5,
      props: 6
    }
    const expected = {
      a: 1
    }
    const result = deepMerge(obj1, obj2, ['parent', 'props'])
    expect(result).toEqual(expected)
  })

  test('should set extend from a original to a new element', () => {
    const extend = {
      tag: 'button',
      style: {
        backgroundColor: 'white',
        color: 'black',
        outline: 0
      },
      icon: {
        style: {
          fill: 'black'
        }
      },
      text: 'Button'
    }

    const element = {
      style: {
        backgroundColor: 'green',
        color: 'white'
      },
      text: 'Submit'
    }

    deepMerge(element, extend)

    expect(element).toStrictEqual({
      tag: 'button',
      style: {
        backgroundColor: 'green',
        color: 'white',
        outline: 0
      },
      icon: {
        style: {
          fill: 'black'
        }
      },
      text: 'Submit'
    })
  })
})
