import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function index(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    response.status(200)
  } catch (error) {
    response.send({ error })
  }
}
