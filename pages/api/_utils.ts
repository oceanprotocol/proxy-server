import { ConfigHelper, Config, LoggerInstance } from '@oceanprotocol/lib'
import { ethers } from 'ethers'
import {
  createClient,
  dedupExchange,
  TypedDocumentNode,
  OperationContext,
  fetchExchange
} from 'urql'

export async function getProvider(): Promise<any> {
  const provider = new ethers.providers.InfuraProvider(
    'homestead',
    process.env.INFURA_PROJECT_ID
  )
  return provider
}

async function createUrqlClient() {
  const config = new ConfigHelper().getConfig(
    1,
    process.env.INFURA_PROJECT_ID
  ) as Config
  const client = createClient({
    url: `${config.subgraphUri}/subgraphs/name/oceanprotocol/ocean-subgraph`,
    exchanges: [dedupExchange, fetchExchange]
  })
  return client
}

export async function fetchData(
  query: TypedDocumentNode,
  variables: any,
  context: OperationContext
): Promise<any> {
  try {
    const client = await createUrqlClient()

    const response = await client.query(query, variables, context).toPromise()
    return response
  } catch (error) {
    LoggerInstance.error('Error fetchData: ', error.message)
  }
  return null
}
