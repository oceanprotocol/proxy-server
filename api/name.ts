import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getProvider } from './_utils'

export async function getEnsName(accountId: string) {
  const provider = await getProvider()
  let name = await provider.lookupAddress(accountId)

  // Check to be sure the reverse record is correct.
  const reverseAccountId = await provider.resolveName(name)
  if (accountId.toLowerCase() !== reverseAccountId.toLowerCase()) name = null
  return name
}

export default async function nameApi(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const accountId = String(request.query.accountId)
    const name = await getEnsName(accountId)

    response.setHeader('Cache-Control', 'max-age=0, s-maxage=86400')
    response.status(200).send(name)
  } catch (error) {
    response.status(500).send(`${error}`)
  }
}
