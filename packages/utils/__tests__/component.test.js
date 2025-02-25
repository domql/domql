import {
  matchesComponentNaming,
  getCapitalCaseKeys,
  getSpreadChildren,
  isContextComponent
} from '../component'

describe('Component Utils', () => {
  describe('matchesComponentNaming', () => {
    test('identifies component keys correctly', () => {
      expect(matchesComponentNaming('Button')).toBe(true)
      expect(matchesComponentNaming('button')).toBe(false)
      expect(matchesComponentNaming('123')).toBe(false)
      expect(matchesComponentNaming(null)).toBe(undefined)
    })
  })

  describe('getCapitalCaseKeys', () => {
    test('returns keys starting with capital letters', () => {
      const obj = {
        Button: {},
        input: {},
        Modal: {},
        text: {}
      }
      expect(getCapitalCaseKeys(obj)).toEqual(['Button', 'Modal'])
    })
  })

  describe('getSpreadChildren', () => {
    test('returns numeric keys', () => {
      const obj = {
        0: 'first',
        1: 'second',
        key: 'value',
        2: 'third'
      }
      expect(getSpreadChildren(obj)).toEqual(['0', '1', '2'])
    })
  })

  describe('isContextComponent', () => {
    test('identifies component from context.components', () => {
      const parent = {
        context: {
          components: {
            Button: { type: 'button' }
          }
        }
      }
      expect(isContextComponent({}, parent, 'Button')).toBeTruthy()
    })

    test('identifies component from context.pages', () => {
      const parent = {
        context: {
          pages: {
            Home: { path: '/' }
          }
        }
      }
      expect(isContextComponent({}, parent, 'Home')).toBeTruthy()
    })

    test('returns falsy for non-existent components', () => {
      const parent = {
        context: {
          components: {},
          pages: {}
        }
      }
      expect(isContextComponent({}, parent, 'NonExistent')).toBeFalsy()
    })

    test('handles missing context gracefully', () => {
      expect(isContextComponent({}, {}, 'Button')).toBeFalsy()
      expect(isContextComponent({}, null, 'Button')).toBeFalsy()
    })
  })
})
