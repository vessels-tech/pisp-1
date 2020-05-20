
/**
 * @name P2P Transfer
 * @description This is more of a sanity check so we know our environment is up and running 
 */

import TestEnv from "./TestEnv"
import axios from 'axios'

describe('Peer to Peer transfer', () => {
  it('Performs a P2P transfer', async () => {
    // Arrange
    const scenariosURI = `${TestEnv.baseUrl}/scenarios`;
    const options = [
      {
        name: 'scenario1',
        operation: 'postTransfers',
        body: {
          from: {
            idType: 'MSISDN',
            idValue: TestEnv.payerIdValue,
          },
          to: {
            idType: "MSISDN",
            idValue: TestEnv.payeeIdValue
          },
          amountType: TestEnv.amountType,
          currency: TestEnv.currency,
          amount: TestEnv.amount,
          transactionType: 'TRANSFER',
          note: "Test p2p transfer",
          homeTransactionId: "homeTxId123"
        }
      }
    ];
    const expected = {
      amount: TestEnv.amount,
      currentState: 'COMPLETED',
      fulfil: expect.objectContaining({
        transferState: 'COMMITTED',
      }),
      from: expect.objectContaining({
        idType: 'MSISDN',
        idValue: TestEnv.payerIdValue,
      }),
      to: expect.objectContaining({
        idType: "MSISDN",
        idValue: TestEnv.payeeIdValue
      }),
      quoteResponse: expect.objectContaining({
        transferAmount: {
          amount: TestEnv.amount,
          currency: TestEnv.currency,
        }
      })
    }
    
    // Act
    // TODO: use client library
    const result = await axios.post(scenariosURI, options)
    
    // Assert
    expect(result.status).toBe(200)
    expect(result.data.scenario1.result).toEqual(expect.objectContaining(expected));
  })

})