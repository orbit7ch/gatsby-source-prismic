import Prismic from 'prismic-javascript'

const fs = require('fs')

function replacer(key, value) {
  if (typeof value === 'string') {
    return value.replace(/\t/g, '').replace(/\n/g, '')
  }
  return value
}

const writeJsonFile = (fileName, content) => {
  return new Promise((resolve, reject) => {
    try {
      let text = JSON.stringify(content, replacer, 4)
      fs.writeFile(fileName, text
        , err => {
          if (err) reject(err)
          else resolve()
        })
    } catch (error) {
      console.error(fileName, error)
    }
  })
}

export default async ({ repositoryName, accessToken, fetchLinks, lang }) => {

  if (repositoryName.indexOf('.local.json') > -1) {
    console.log(`use local repository dump ${repositoryName}`)
    const documents = require(`${repositoryName}`)
    return { documents }
  }

  console.time(`Fetch Prismic data`)
  console.log(`Starting to fetch data from Prismic`)

  const apiEndpoint = `https://${repositoryName}.prismic.io/api/v2`
  const client = await Prismic.api(apiEndpoint, { accessToken })

  // Query all documents from client
  const documents = await pagedGet(client, [], { fetchLinks }, lang)

  console.timeEnd(`Fetch Prismic data`)


  writeJsonFile(`${repositoryName}.local.json`, documents)
  console.log(`local repository ${repositoryName}.local.json saved`)

  return {
    documents,
  }
}

async function pagedGet(
  client,
  query = [],
  options = {},
  lang = '*',
  page = 1,
  pageSize = 100,
  aggregatedResponse = null,
) {
  const mergedOptions = { lang, ...options }

  const response = await client.query(query, {
    ...mergedOptions,
    page,
    pageSize,
  })

  if (!aggregatedResponse) {
    aggregatedResponse = response.results
  } else {
    aggregatedResponse = aggregatedResponse.concat(response.results)
  }

  if (page * pageSize < response.total_results_size) {
    return pagedGet(
      client,
      query,
      options,
      lang,
      page + 1,
      pageSize,
      aggregatedResponse,
    )
  }

  return aggregatedResponse
}
