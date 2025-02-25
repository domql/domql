import { deepStringify } from '..'

const testObject1 = {
  a: 'hello',
  b: 123,
  c: true,
  d: {
    e: [1, 2, 3],
    f: {
      g: 'world'
    }
  },
  h: function () {
    console.log('test')
  }
}

const testObject2 = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'music'],
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345'
  },
  sayHello: function () {
    return 'Hello'
  }
}

describe('deepStringify', () => {
  test('should convert functions to string', () => {
    const obj = {
      a: 1,
      b: function () {
        return 'test'
      }
    }
    const expected = {
      a: 1,
      b: `function () {
        return 'test';
      }`
    }
    expect(deepStringify(obj)).toEqual(expected)
  })

  test('should stringify nested objects', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3
        }
      }
    }
    const expected = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3
        }
      }
    }
    expect(deepStringify(obj)).toEqual(expected)
  })

  test('should stringify arrays', () => {
    const obj = {
      a: 1,
      b: [
        1,
        2,
        function () {
          return 'test'
        }
      ]
    }
    const expected = {
      a: 1,
      b: [
        1,
        2,
        `function () {
        return 'test';
      }`
      ]
    }
    expect(deepStringify(obj)).toEqual(expected)
  })

  test('should stringify testObject1', () => {
    const expected = {
      a: 'hello',
      b: 123,
      c: true,
      d: {
        e: [1, 2, 3],
        f: {
          g: 'world'
        }
      },
      h: `function () {
    console.log('test');
  }`
    }
    expect(deepStringify(testObject1)).toEqual(expected)
  })

  test('should stringify testObject2', () => {
    const expected = {
      name: 'John',
      age: 30,
      hobbies: ['reading', 'music'],
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345'
      },
      sayHello: `function () {
    return 'Hello';
  }`
    }
    expect(deepStringify(testObject2)).toEqual(expected)
  })
})
