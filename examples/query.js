const DOM = {}

const movieTable = {
  $fetch: 'https://pretty-whale-82.hasura.app/v1/graphql',
  query: 'movies',

  if: element => !element.data,

  childExtends: {
    icon: { name: 'movie' },
    title: {
      tag: 'h1',
      query: true
    },
    p: {
      query: 'description'
    },
    director: {
      query: true
    },
    actors: {
      query: true,
      ...[0, 1, 2, 3, 4]
    }
  },

  ...[ // received data
    { title: 'book on' },
    { title: 'book on1' }
  ]
}

DOM.create(movieTable)

// {
//   movies {
//     title
//     description
//     director
//     actors {
//     }
//   }
// }
