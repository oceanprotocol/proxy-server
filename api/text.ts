import type { VercelRequest, VercelResponse } from '@vercel/node'
import { gql, OperationResult } from 'urql'
import { fetchData, getProvider } from './_utils'

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

export async function getEnsTextRecords(
  ensName: string
): Promise<{ key: string; value: string }[]> {
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
  console.log('result?.data?.domains[0]?.resolver', result)
  if (!result?.data?.domains[0]?.resolver) throw 'No ENS text records found'

  // 2. Retrieve the text records.
  const { texts } = result.data.domains[0].resolver

  const records = []
  const provider = await getProvider()
  const resolver = await provider.getResolver(ensName)

  for (let index = 0; index < texts?.length; index++) {
    const key = texts[index]
    const value = await resolver.getText(key)
    records.push({ key, value })
  }

  return records
}

export default async function ensTextApi(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const ensName = String(request.query.name)
    const records = await getEnsTextRecords(ensName)

    response.setHeader('Cache-Control', 'max-age=0, s-maxage=86400')
    response.status(200).send(records)
  } catch (error) {
    response.status(500).send(`${error}`)
  }
}
