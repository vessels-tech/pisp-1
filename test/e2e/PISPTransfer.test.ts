import TestEnv from "./TestEnv"
import axios from 'axios'

/**
 * @name PISPTransfer
 * @description PISP End To End Tests
 */

describe('PISP initiated transfer', () => {
  let transactionRequestId: string | undefined;

  // Note: these steps are wrapped in `describe` blocks to ensure they are run sequentially with Jest
  describe('GET /parties & initiate transactionRequests', () => {
    it('part 1', async () => {
      // Arrange
      const scenariosURI = `${TestEnv.baseUrls.pispSchemeAdapter}/requestToPay`;
      const options = {
        homeTransactionId: "test123",
        from: { 
          ...TestEnv.users.bob
        },
        to: {
          ...TestEnv.users.alice
        },
        amountType: "SEND",
        currency: TestEnv.currency,
        amount: "18",
        scenario: "PAYMENT",
        initiator: "PAYEE",
        initiatorType: "BUSINESS",
        note: "pisp payment"
      }

      const expected = {
        from: expect.objectContaining({
          ...TestEnv.users.bob,
          fspId: 'pisp'
        }),
        to: expect.objectContaining({
          ...TestEnv.users.alice,
          fspId: 'dfspa'
        }),
        amountType: "SEND",
        currency: "USD",
        amount: "18",
        scenario: "PAYMENT",
        initiator: "PAYEE",
        initiatorType: "BUSINESS",
        note: "pisp payment",
        currentState: "COMPLETED",
        requestToPayState: "RECEIVED"
      }

      // Act
      // TODO: use client library
      const result = await axios.post(scenariosURI, options)
      transactionRequestId = result.data.transactionRequestId;

      // Assert
      expect(result.status).toBe(200)
      expect(transactionRequestId).not.toBeUndefined()
      expect(result.data).toEqual(expect.objectContaining(expected));
    })
  })

  describe('payerfsp POST /quotes', () => {
    it('part 2', async () => {
      expect(transactionRequestId).not.toBeUndefined()

      // Arrange
      const scenariosURI = `${TestEnv.baseUrls.dfspaSchemeAdapter}/requestToPayTransfer`;
      const options = {
        requestToPayTransactionId: transactionRequestId,
        from: {
          ...TestEnv.users.alice
        },
        to: {
          ...TestEnv.users.bob,
          fspId: "dfspb"
        },
        amountType: "SEND",
        currency: TestEnv.amount,
        amount: "18",
        scenario: "PAYMENT",
        initiator: "PAYEE",
        initiatorType: "BUSINESS",
        note: "test payment"
      }

      const expected = {
        // from: expect.objectContaining({
        //   ...TestEnv.users.bob,
        //   fspId: 'pisp'
        // }),
        // to: expect.objectContaining({
        //   ...TestEnv.users.alice,
        //   fspId: 'dfspa'
        // }),
        // amountType: "SEND",
        // currency: "USD",
        // amount: "18",
        // scenario: "PAYMENT",
        // initiator: "PAYEE",
        // initiatorType: "BUSINESS",
        // note: "pisp payment",
        // currentState: "COMPLETED",
        // requestToPayState: "RECEIVED"
      }

      // Act
      // TODO: use client library
      const result = await axios.post(scenariosURI, options)
      console.log('result.data is', JSON.stringify(result.data, null, 2))

      // Assert
      expect(result.status).toBe(200)
      expect(transactionRequestId).not.toBeUndefined()
      expect(result.data).toEqual(expect.objectContaining(expected));
    })
  })

  // describe('payerfsp has to accept the transaction', () => {
  //   it('part 3', () => {
  //     console.log('part 3')
  //   })
  // })
})