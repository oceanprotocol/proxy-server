import { NextApiRequest, NextApiResponse } from 'next'
import { getEnsName } from './name'
import { getEnsTextRecords } from './text'

interface ProfileLink {
  key: string
  value: string
}

interface Profile {
  name: string
  url?: string
  avatar?: string
  description?: string
  links?: ProfileLink[]
}

function getEnsAvatar(ensName: string): string {
  return ensName
    ? `https://metadata.ens.domains/mainnet/avatar/${ensName}`
    : null
}

export async function getEnsProfile(accountId: string): Promise<Profile> {
  const name = (await getEnsName(accountId)).name
  if (!name) return { name: null }

  const records = await getEnsTextRecords(name)
  if (!records) return { name }

  const avatar = records.filter((record) => record.key === 'avatar')[0]?.value
  const description = records.filter(
    (record) => record.key === 'description'
  )[0]?.value

  // filter out what we need from the fetched text records
  const linkKeys = [
    'url',
    'com.twitter',
    'com.github',
    'org.telegram',
    'com.discord',
    'com.reddit'
  ]

  const links: ProfileLink[] = records.filter((record) =>
    linkKeys.includes(record.key)
  )

  const profile: Profile = {
    name,
    ...(avatar && { avatar: getEnsAvatar(name) }),
    ...(description && { description }),
    ...(links.length > 0 && { links })
  }
  return profile
}

export default async function EnsProfileApi(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const accountId = String(request.query.address)
    const profile = await getEnsProfile(accountId)

    response.setHeader('Cache-Control', 'max-age=0, s-maxage=86400')
    response.status(200).send(profile)
  } catch (error) {
    response.status(500).send(`${error}`)
  }
}
