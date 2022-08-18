import { NextApiRequest, NextApiResponse } from 'next'
import { gql, OperationResult } from 'urql'
import { fetchData, getEns } from './_utils'

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
  if (!result?.data?.domains[0]?.resolver) return

  // 2. Retrieve the text records.
  const { texts } = result.data.domains[0].resolver

  const records = []
  const ens = await getEns()

  for (let index = 0; index < texts?.length; index++) {
    const key = texts[index]
    const value = await ens.name(ensName).getText(key)
    console.log(value)
    records.push({ key, value })
  }

  return records
}

export default async function ensTextApi(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const ensName = String(request.query.name)
    const records = await getEnsTextRecords(ensName)

    response.setHeader('Cache-Control', 's-maxage=86400')
    response.status(200).send(records)
  } catch (error) {
    response.status(500).send(`${error}`)
  }
}
