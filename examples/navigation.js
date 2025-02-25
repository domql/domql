'use strict'

const listItem = {
  tag: 'a',
  class: ['ui link', (element) => `icon-${element.key}`],
  attr: {
    href: (element) => `#/${element.key}/`
  }
}

// var navItems = [{
//   key: 'home',
//   text: 'Home'
// }, {
//   key: 'about',
//   text: 'About'
// }, {
//   key: 'faq',
//   text: 'FAQ'
// }, {
//   key: 'contact',
//   text: 'Contact'
// }]

const navigation = {
  childExtends: listItem,
  // ...navImtes
  home: 'Home',
  about: 'About',
  faq: 'FAQ',
  contact: 'Contact'
}

export default navigation
