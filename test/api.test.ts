import { expect } from 'chai'
import request from 'supertest'
import name from '../pages/api/name'

describe('Price Request Tests', () => {
  it('Starts the server', async () => {
    request(name)
      .get(
        '/ipfs/QmTkzDwWqPbnAh5YiV5VwcTLnGdwSNsNTn2aDxdXBFca7D/ocean-protocol'
      )
      .expect('Content-Type', /json/)
      .expect(200)
  })
  //   it('Gets the current price of OCEAN', async () => {
  //     const response = await request(app)
  //       .get(
  //         '/ipfs/QmTkzDwWqPbnAh5YiV5VwcTLnGdwSNsNTn2aDxdXBFca7D/ocean-protocol'
  //       )
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //     expect(response.body.usd).to.be.within(0.1, 100)
  //   })
  //   it('Gets the current price of USDT', async () => {
  //     const response = await request(app)
  //       .get('/ipfs/QmTkzDwWqPbnAh5YiV5VwcTLnGdwSNsNTn2aDxdXBFca7D/tether')
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //     expect(response.body.usd).to.be.within(0.9, 1.1)
  //   })
  //   it('Gets the historical price of OCEAN', async () => {
  //     const response = await request(app)
  //       .get(
  //         '/ipfs/QmTkzDwWqPbnAh5YiV5VwcTLnGdwSNsNTn2aDxdXBFca7D/ocean-protocol/1620245790'
  //       )
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //     expect(response.body.usd).to.equal(1.4499657614470953)
  //   })
  //   it('Gets the historical price of Ether', async () => {
  //     const response = await request(app)
  //       .get(
  //         '/ipfs/QmTkzDwWqPbnAh5YiV5VwcTLnGdwSNsNTn2aDxdXBFca7D/ethereum/1550245790'
  //       )
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //     expect(response.body.usd).to.equal(153.0565669307744)
  //   })
})
