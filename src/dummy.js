// no-op
import { sourceNodes } from './gatsby-node'


const gatsbyMock = {
  actions: {
    createNode: (args) => {
        console.info(args.type, args.href)
    },
    touchNode: () => {
    },
  },
  createNodeId: () => {
  },
  store: () => {
  },
  cache: () => {
  },
}

const options = {
  repositoryName: 'content-type-test',
  // repositoryName: '../content-type-test.local.json',
  accessToken: null,
}


sourceNodes(gatsbyMock, options).then(

).catch((error) => {
  console.log(error)
})
