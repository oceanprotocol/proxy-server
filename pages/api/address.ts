import { NextApiRequest, NextApiResponse } from 'next'
import { getEns } from './_utils'

export default async function getEnsAddress(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const ensName = request.query.name
    const ens = await getEns()
    const address = await ens.name(ensName).getAddress()
    if (!address) throw `No address found for "${ensName}"`

    response.setHeader('Cache-Control', 's-maxage=86400')
    response.status(200).send(address)
  } catch (error) {
    response.status(500).send(`${error}`)
  }
}
