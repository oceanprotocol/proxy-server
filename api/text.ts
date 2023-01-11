import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getProvider } from './utils'

export async function getEnsTextRecords(
  ensName: string
): Promise<{ key: string; value: string }[] | null> {
  const texts = [
    'url',
    'avatar',
    'com.twitter',
    'com.github',
    'org.telegram',
    'com.discord',
    'com.reddit'
  ]

  const records = []
  const provider = await getProvider()
  const resolver = await provider.getResolver(ensName)
  if (!resolver) return null

  for (let index = 0; index < texts?.length; index++) {
    const key = texts[index]
    const value = await resolver.getText(key)
    value && records.push({ key, value })
  }

  return records
}

export async function ensTextApi(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const ensName = String(request.query.name)
    const records = await getEnsTextRecords(ensName)

    response.setHeader('Cache-Control', 'max-age=0, s-maxage=86400')
    response.status(200).send({ records })
  } catch (error) {
    response.send({ error })
  }
}
