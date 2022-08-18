import { NextApiRequest, NextApiResponse } from 'next'
import { gql, OperationResult } from 'urql'
import { fetchData } from './_utils'

const ProfileTextRecordsQuery = gql<{
  domains: [{ resolver: { texts: string[] } }]
}>`
  query ProfileTextRecords($name: String!) {
    domains(where: { name: $name }) {
      resolver {
        texts
      }
    }
  }
`

export default async function getEnsTextRecords(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<{ key: string; value: string }[]> {
  try {
    const ensName = String(request.query.name)
    // 1. Check which text records are set for the domain with ENS subgraph,
    // to prevent unnecessary contract calls.
    const result: OperationResult<{
      domains: [{ resolver: { texts: string[] } }]
    }> = await fetchData(
      ProfileTextRecordsQuery,
      { name: ensName },
      {
        url: `https://api.thegraph.com/subgraphs/name/ensdomains/ens`,
        requestPolicy: 'cache-and-network'
      }
    )
    if (!result?.data?.domains[0]?.resolver) return

    // 2. Retrieve the text records.
    const { texts } = result.data.domains[0].resolver
    const records = []
    let ens: any

    for (let index = 0; index < texts?.length; index++) {
      const key = texts[index]
      const value = await ens.name(ensName).getText(key)
      records.push({ key, value })
    }

    response.setHeader('Cache-Control', 's-maxage=86400')
    response.status(200).send(records)
  } catch (error) {
    response.status(500).send(`${error}`)
  }
}
