import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getProvider } from './_utils'

export default async function getEnsAddress(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const ensName = request.query.name
    const provider = await getProvider()
    const address = await provider.resolveName(ensName)
    if (!address) throw `No address found for ${ensName}`

    response.setHeader('Cache-Control', 'max-age=0, s-maxage=86400')
    response.status(200).send({ address })
  } catch (error) {
    response.send({ error })
  }
}
