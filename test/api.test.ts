import addressApi from '../api/address'
import nameApi from '../api/name'
import profileApi from '../api/profile'
import { createServer } from 'vercel-node-server'
import listen from 'test-listen'
// import express from 'express'
// import request from 'supertest'
import axios from 'axios'
// import type { VercelRequest, VercelResponse } from '@vercel/node'
import { assert } from 'chai'

let server
let url: string
const name = 'jellymcjellyfish.eth'
const accountId = '0x99840Df5Cb42faBE0Feb8811Aaa4BC99cA6C84e0'

describe('Testing ENS proxy API endpoints', function () {
  this.timeout(20000)

  it('Requesting address should return the expected response', async () => {
    server = createServer(addressApi)
    url = await listen(server)
    const response = await axios.get(url, {
      params: {
        name
      }
    })
    assert(response.data.address === accountId)
  })
  it('Requesting ENS name should return the expected response', async () => {
    server = createServer(nameApi)
    url = await listen(server)
    const response = await axios.get(url, {
      params: {
        accountId
      }
    })
    assert(response.data.name === name)
  })
  it('Requesting user profile should return the expected response', async () => {
    server = createServer(profileApi)
    url = await listen(server)
    const response = await axios.get(url, {
      params: {
        address: accountId
      }
    })
    console.log('profile', response.data.profile)
    assert(response.data.profile.name === name)
    assert(
      response.data.profile.avatar ===
        'https://metadata.ens.domains/mainnet/avatar/jellymcjellyfish.eth'
    )
    assert(response.data.profile.links[0].value === 'https://oceanprotocol.com')
    assert(response.data.profile.links[2].value === 'oceanprotocol')
    assert(response.data.profile.links[3].value === 'oceanprotocol')
  })
})

after(() => {
  server.close()
})
