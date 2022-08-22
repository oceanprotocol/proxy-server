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
import { refocusExchange } from '@urql/exchange-refocus'

let ens: any

function getOceanConfig(network: string | number): Config {
  const config = new ConfigHelper().getConfig(
    network,
    network === 'polygon' ||
      network === 'moonbeamalpha' ||
      network === 1287 ||
      network === 'bsc' ||
      network === 56 ||
      network === 'gaiaxtestnet' ||
      network === 2021000
      ? undefined
      : process.env.INFURA_PROJECT_ID
  ) as Config
  return config as Config
}

async function getDummyWeb3(chainId: number): Promise<Web3> {
  const config = getOceanConfig(chainId)
  return new Web3(config.nodeUri)
}

async function createUrqlClient() {
  const config = getOceanConfig(1)
  const client = createClient({
    url: `${config.subgraphUri}/subgraphs/name/oceanprotocol/ocean-subgraph`,
    exchanges: [dedupExchange, refocusExchange(), fetchExchange]
  })
  return client
}

export async function getEns(): Promise<any> {
  const _ens =
    ens ||
    new ENS({
      provider: (await getDummyWeb3(1)).currentProvider,
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
