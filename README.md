# DOMQL
DOMQL is new framework made by Symbols team to simplify app development process with full potential of reusable components. The aim to create this framework is to build one of the most reusable components library, and together with a [design system library](https://github.com/symbo-ls/smbls), it creates strong foundation of any web interface kits.

DOMQL recursively creates elements on your tree, runs transformations based on passed properties, applies state and events, and replicating this virtual tree, renders a DOM tree. The rendering part is separated from the schema part, which makes it easy to use other rendering transformers such as Mikado, React, Vue and so.

- Minimalistic
- No dependencies
- Extendable
- No transpilations, simple ES6 code
- JSON friendly
- Good to generate GraphQL queries based on UI need

You can start with [starter-kit](https://github.com/domql/starter-kit) as a
boilerplate, or jump into the [playground](https://domql.com/playground/).

[![npm version](https://badge.fury.io/js/domql.svg)](https://badge.fury.io/js/domql)
[![Coverage Status](https://coveralls.io/repos/github/symbo-ls/domql/badge.svg?branch=feature/extends)](https://coveralls.io/github/symbo-ls/domql?branch=feature/extends)

## Symbols
DOMQL is designed to work perfectly with Symbols design system and components. To use it with Symbols please refer relevant docs: [symbols.app/api](https://symbols.app/api)


## Using

DOMQL uses Javascript syntax and runs both on Node and Browser without transpirations required. In DOMQL you write your own virtual tree that represents actual DOM tree after running it in the browser:

```javascript
import DOM from 'domql'

const link = {
  tag: 'a',
  class: 'menu link',
  attr: {
    href: '#'
  }
}

DOM.create(link, document.body)
```

DOMQL is simple representation of HTML, Javascript and CSS altogether. The idea is that we can create JSON like structure for the HTML, CSS and events, so it can generate schema and can be passed to any rendering framework through its transforms:

```javascript
const img = {
  tag: 'img',
  class: 'avatar',
  attr: {
    src: '...'
  },
  style: {
    padding: '10px'
  }
}
```

A single javascript object to manage markup, styles and functionality.

```javascript
const Link = {
  tag: 'a'
}

const ListItem = {
  extends: Link,
  class: 'ui link',
  attr: {
    href: '#'
  }
}

const menu = {
  childExtends: ListItem,
  home: 'Home',
  text: 'About'
}

const header = {
  logo: {},
  menu
}
```

As flexible as Javascript.

```javascript
const navItems = ['Home', 'About', 'FAQ', 'Contact']

const menu = {
  extends: ListItem,
  ...navItems
}
```

Runs function.

```javascript
const Increment = {
  tag: 'button',
  text: 'Click me!',
  state: { value: 0 },
  on: {
    click: (event, element, state) => {
      state.update({ value: state.value++ })
    }
    focus: () => {...},
    render: () => {...},
    ...
  }
}
```

## API

### Properties

| Property | Type | Description | Default |
| --- | --- | --- | --- |
| `key` | `Number` `String` | Defines the key of the Element | The key of the object, or randomly generated name |
| `extends` | `Object` `Array` | Clones the other element | `undefined` |
| `childExtends` | `Object` `Array` | Specifies the `extends` for all child elements | `undefined` |
| `tag` | `String` | Specifis the HTML tag  | `div` or related HTML tag if the key matches |
| `class` | `Any` | Specifies the HTML class | `undefined` |
| `attr` | `Object` | Specifies the set of HTML attributes | `{}` |
| `text` | `Any` | Text inside the element | `undefined` |
| `content` | `Object` `Array` | Fragment wrapper to use dynamic content loading | `undefined`

To specify your own property per Element, set the function inside `define` property like:

```javascript
const User = {
  define: {
    username: param => param.toUpperCase()
  },
  text: element => element.username
}

const Contact = {
  extends: User,
  username: 'nikoloza'
}
```

### Methods
| Method | Description | Params |
| --- | --- | --- |
| `update` | Updates element by passed object | `properties`: `Object` `Array` |
| `set` | Sets passed element in the `content` property | `element`: `Object` `Array` |


### Events
All native DOM events are supported and can be specified inside `on` parameter. Additionally, `init` and `render` can be also invoked. All events except these two receive `event` object as a first parameter, following the `element` object itself.

### Reserved keywords

```
key
tag
node
extends
on
class
text
data
style
attr
update
set
define
```

Anything except these keywords will create a new nested child element. The easier method to specify HTML tag is to use related nodeName as a key, for example:

```javascript
const layout = { // this will be <div>
  header: {}, // will create <header>
  aside: {}, // will create <aside>
  main: { // will create <main>
    childExtends: {
      article: { // will create <article>
        title: {}, // will create <div>
        description: {}, // will create <div>
        _rating: {} // will create <div class="rating">
      }
    }
  },
  footer: {} //  will create <footer>
}
```

### Credits
Inspired by [brisky](https://github.com/vigour-io/brisky)
