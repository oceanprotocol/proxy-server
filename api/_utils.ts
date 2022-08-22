import { ethers } from 'ethers'

export async function getProvider(): Promise<any> {
  const provider = new ethers.providers.InfuraProvider(
    'homestead',
    process.env.INFURA_PROJECT_ID
  )
  return provider
}
