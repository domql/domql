# DOMQL Element
Takes object and creates DOMQL element.

[![npm version](https://badge.fury.io/js/%40domql%2Felement.svg)](https://badge.fury.io/js/%40domql%2Felement)

### Example:
```javascript
import DOM from 'domql'

const Poster = {
  extends: [Link, Img],
  props: {
    boxSize: [100, 200],
    borderRadius: 12,
    padding: 16,
    background: '#fff'
  }
}

DOM.create(Poster, document.body)
```