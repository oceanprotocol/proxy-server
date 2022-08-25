import addressApi from '../api/address'
import nameApi from '../api/name'
import profileApi from '../api/profile'
import textApi from '../api/text'
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
const invalid = 'lkdfjslkdfjpeoijf3423'

describe('Testing ENS proxy API endpoints', function () {
  this.timeout(25000)

  it('Requesting address should return the expected response', async () => {
    server = createServer(addressApi)
    url = await listen(server)
    const response = await axios.get(url, {
      params: {
        name
      }
    })
    assert(response.status === 200)
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
    assert(response.status === 200)
    assert(response.data.name === name)
  })
  it('Requesting text records should return the expected response', async () => {
    server = createServer(textApi)
    url = await listen(server)
    const response = await axios.get(url, {
      params: {
        name
      }
    })
    assert(response.status === 200)
    assert(
      response.data.records[0].value === 'https://oceanprotocol.com',
      'Wrong URL'
    )
    assert(
      response.data.records[1].value ===
        'https://raw.githubusercontent.com/oceanprotocol/art/main/logo/favicon-white.png',
      'Wrong avatar'
    )
    assert(response.data.records[2].value === 'oceanprotocol', 'Wrong link 1')
    assert(response.data.records[3].value === 'oceanprotocol', 'wrong link 2')

    assert(response.data.records[0].key === 'url', 'Wrong URL')
    assert(response.data.records[1].key === 'avatar', 'Wrong avatar')
    assert(response.data.records[2].key === 'com.twitter', 'Wrong link 1')
    assert(response.data.records[3].key === 'com.github', 'wrong link 2')
  })

  it('Requesting user profile should return the expected response', async () => {
    server = createServer(profileApi)
    url = await listen(server)
    const response = await axios.get(url, {
      params: {
        address: accountId
      }
    })

    assert(response.status === 200)
    assert(response.data.profile.name === name)
    assert(
      response.data.profile.avatar ===
        'https://metadata.ens.domains/mainnet/avatar/jellymcjellyfish.eth'
    )
    assert(response.data.profile.links[0].value === 'https://oceanprotocol.com')
    assert(response.data.profile.links[1].value === 'oceanprotocol')
    assert(response.data.profile.links[2].value === 'oceanprotocol')

    assert(response.data.profile.links[0].key === 'url')
    assert(response.data.profile.links[1].key === 'com.twitter')
    assert(response.data.profile.links[2].key === 'com.github')
  })

  // Tests with incorrect address or name

  it('Requesting address should return status 200 with invalid name', async () => {
    server = createServer(addressApi)
    url = await listen(server)
    const response = await axios.get(url, {
      params: {
        name: invalid
      }
    })
    assert(response.status === 200)
  })
  it('Requesting name should return status 200 with invalid accountId', async () => {
    server = createServer(nameApi)
    url = await listen(server)
    const response = await axios.get(url, {
      params: {
        accountId: invalid
      }
    })
    assert(response.status === 200)
  })
  it('Requesting text records should return status 200 with invalid name', async () => {
    server = createServer(textApi)
    url = await listen(server)
    const response = await axios.get(url, {
      params: {
        name: invalid
      }
    })
    assert(response.status === 200)
  })

  it('Requesting profile should return status 200 with invalid name', async () => {
    server = createServer(profileApi)
    url = await listen(server)
    const response = await axios.get(url, {
      params: {
        address: invalid
      }
    })

    assert(response.status === 200)
  })
})

after(() => {
  server.close()
})
