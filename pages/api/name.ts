import { NextApiRequest, NextApiResponse } from 'next'
import { getEns } from './_utils'

export default async function getEnsName(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const accountId = String(request.query.accountId)
    const ens = await getEns()
    let name = await ens.getName(accountId)

    // Check to be sure the reverse record is correct.
    const reverseAccountId = await ens.name(name.name).getAddress()
    console.log('reverseAccountId', reverseAccountId)
    if (accountId.toLowerCase() !== reverseAccountId.toLowerCase()) name = null

    response.setHeader('Cache-Control', 's-maxage=86400')
    response.status(200).send(name)
  } catch (error) {
    response.status(500).send(`${error}`)
  }
}
