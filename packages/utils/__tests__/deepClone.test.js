import { deepClone } from '..'

const obj = {
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
  props: {
    propsArray: [4, 5, 6],
    propsArray2: [8, 9, [11, 12, 13]],
    propsArray3: [8, {}, [{ myArr: [19, 20] }, 12, 13]]
  },
  blabla: ['hi', ['my', 'name', 'is'], { name: 'James Bond' }, 'bye'],
  text: 'Button'
}

const cloned = deepClone(obj)

test('should clone the object', () => {
  expect(cloned).toStrictEqual(obj)
})

test('should clone use child references', () => {
  expect(cloned.style).not.toBe(obj.style)
})
