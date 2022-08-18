import { NextApiRequest, NextApiResponse } from 'next'
import { getEns } from './_utils'

export default async function getEnsAddress(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const ensName = request.query.name
    console.log('ensName', ensName)
    const ens = await getEns()
    const address = await ens.name(ensName).getAddress()
    console.log('address', address)

    response.setHeader('Cache-Control', 's-maxage=86400')
    response.status(200).send(address)
  } catch (error) {
    response.status(500).send(`${error}`)
  }
}
