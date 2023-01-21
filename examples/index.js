'use strict'

import DOM from '../src'

import header from './header'
import footer from './footer'
import Icon from './icon'

const icon = {
  extend: Icon,
  name: 'toke'
}

const { performance } = global
const now = performance.now()

const list = []
for (let i = 0; i < 35; i++) {
  const afrika = {
    text: `Hello Afrika - ${parseInt(Math.random() * 100)}`,
    tag: 'li',
    attr: {
      align: 'right'
    },
    style: {
      background: 'black',
      color: 'white',
      padding: 10
    }
  }

  const lion = {
    text: 'Lion',
    style: {
      color: 'black',
      opacity: Math.random(),
      background: 'yellow'
    }
  }

  const yay = 'yay'

  afrika.lion = lion
  afrika.yay = yay

  list[i] = afrika
}

const root = {
  header,
  list,
  icon,
  footer
}

DOM.create(root)

const later = performance.now()
console.log(later - now)
