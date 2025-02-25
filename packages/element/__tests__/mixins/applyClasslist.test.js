import { applyClasslist } from '../../mixins/classList'

describe('applyClasslist', () => {
  it('applies className to node using applyClassListOnNode', () => {
    const element = {}
    const node = { classList: '' }
    const params = { active: true, theme: 'dark' }

    applyClasslist(params, element, node)

    expect(node.classList).toBe('active dark')
  })

  it('handles empty params by clearing node.classList', () => {
    const element = {}
    const node = { classList: 'existing-class' }

    applyClasslist(null, element, node)

    expect(node.classList).toBe(undefined)
  })

  it('overwrites existing classList on node', () => {
    const element = {}
    const node = { classList: 'old-class' }
    const params = { new: true }

    applyClasslist(params, element, node)

    expect(node.classList).toBe('new')
  })

  it('handles string params correctly', () => {
    const element = {}
    const node = { classList: '' }
    const params = 'primary large'

    applyClasslist(params, element, node)

    expect(node.classList).toBe('primary large')
  })

  it('handles boolean true params', () => {
    const element = { key: 'submit-button' }
    const node = { classList: '' }

    applyClasslist(true, element, node)

    expect(node.classList).toBe('submit-button')
  })

  it('handles complex object params with dynamic class generation', () => {
    const element = { size: 10 }
    const node = { classList: '' }
    const params = {
      visible: true,
      theme: 'dark',
      size: el => `size-${el.size}`
    }

    applyClasslist(params, element, node)

    expect(node.classList).toBe('visible dark size-10')
  })

  it('handles empty className from applyClassListOnNode', () => {
    const element = {}
    const node = { classList: 'existing-class' }
    const params = {}

    applyClasslist(params, element, node)

    expect(node.classList).toBe('')
  })

  it('preserves node object structure', () => {
    const element = {}
    const node = { classList: '', otherProp: 'unchanged' }
    const params = { active: true }

    applyClasslist(params, element, node)

    expect(node.classList).toBe('active')
    expect(node.otherProp).toBe('unchanged')
  })

  it('handles falsy params by clearing classList', () => {
    const element = {}
    const node = { classList: 'existing-class' }

    applyClasslist(false, element, node)

    expect(node.classList).toBe(undefined)
  })

  it('handles complex element-dependent functions', () => {
    const element = { active: true, user: 'admin' }
    const node = { classList: '' }
    const params = {
      status: el => (el.active ? 'active' : 'inactive'),
      access: el => `role-${el.user}`
    }

    applyClasslist(params, element, node)

    expect(node.classList).toBe('active role-admin')
  })
})
