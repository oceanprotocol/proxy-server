import { ConfigHelper, Config } from '@oceanprotocol/lib'
import Web3 from 'web3'

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
      : process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
  ) as Config
  return config as Config
}

export async function getDummyWeb3(chainId: number): Promise<Web3> {
  const config = getOceanConfig(chainId)
  return new Web3(config.nodeUri)
}
