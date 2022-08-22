import { NextApiRequest, NextApiResponse } from 'next'
import { getEns } from './_utils'

export async function getEnsName(accountId: string) {
  const ens = await getEns()
  let name = await ens.getName(accountId)

  // Check to be sure the reverse record is correct.
  const reverseAccountId = await ens.name(name.name).getAddress()
  if (accountId.toLowerCase() !== reverseAccountId.toLowerCase()) name = null
  return name
}

export default async function nameApi(
  request: NextApiRequest,
  response: NextApiResponse
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
