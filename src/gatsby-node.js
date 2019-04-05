import createNodeHelpers from 'gatsby-node-helpers'
import fetchData from './fetch'
import { normalizeFields } from './normalize'

const nodeHelpers = createNodeHelpers({ typePrefix: 'Prismic' })
const { createNodeFactory } = nodeHelpers

export const sourceNodes = async (gatsby, pluginOptions) => {
  const { actions, createNodeId, store, cache } = gatsby

  const { createNode, touchNode } = actions

  const {
    repositoryName,
    accessToken,
    linkResolver = () => {
    },
    htmlSerializer = () => {
    },
    fetchLinks = [],
    lang = '*',
    shouldNormalizeImage = () => true,
  } = pluginOptions

  const { documents } = await fetchData({
    repositoryName,
    accessToken,
    fetchLinks,
    lang,
  })


  // create a mapper so we can get types of a specific id
  // FIXME this is a fix for https://github.com/prismicio/prismic-javascript/issues/86
  const documentTypeMappings = documents.reduce((acc, cur) => {
    acc[cur.id] = cur.type
    return acc
  }, {})

  await Promise.all(
    documents.map(async doc => {
      const Node = createNodeFactory(doc.type, async node => {
        node.dataString = JSON.stringify(node.data)
        node.data = await normalizeFields({
          value: node.data,
          node,
          linkResolver,
          htmlSerializer,
          nodeHelpers,
          createNode,
          createNodeId,
          touchNode,
          store,
          cache,
          shouldNormalizeImage,
          documentTypeMappings,
        })

        return node
      })

      const node = await Node(doc)
      createNode(node)
    }),
  )

  return
}
