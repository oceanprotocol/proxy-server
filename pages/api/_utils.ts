import { ConfigHelper, Config, LoggerInstance } from '@oceanprotocol/lib'
import Web3 from 'web3'
import ENS, { getEnsAddress as getEnsAddressVendor } from '@ensdomains/ensjs'
import {
  createClient,
  dedupExchange,
  TypedDocumentNode,
  OperationContext,
  fetchExchange
} from 'urql'

let ens: any

async function getWeb3(): Promise<Web3> {
  const config = new ConfigHelper().getConfig(
    1,
    process.env.INFURA_PROJECT_ID
  ) as Config
  return new Web3(config.nodeUri)
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

export async function getEns(): Promise<any> {
  const _ens =
    ens ||
    new ENS({
      provider: (await getWeb3()).currentProvider,
      ensAddress: getEnsAddressVendor(1)
    })
  ens = _ens

  return _ens
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
