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

export async function fetchData(
  query: TypedDocumentNode,
  variables: any,
  context: OperationContext
): Promise<any> {
  try {
    const client = createClient({
      url: 'https://v4.subgraph.mainnet.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph',
      exchanges: [dedupExchange, fetchExchange]
    })

    const response = await client.query(query, variables, context).toPromise()
    console.log('response', response)
    return response
  } catch (error) {
    console.error('Error fetchData: ', error)
  }
  return null
}
