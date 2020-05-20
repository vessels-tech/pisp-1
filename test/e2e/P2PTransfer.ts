
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
    // const id = uuid.v4();
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
    
    // Act
    // TODO: use client library
    const result = await axios.post(scenariosURI, options)
    
    // Assert
    console.log('result is', result);

    /*
    pm.test("Status code is 200", function () {
   pm.response.to.have.status(200);

   var headers = pm.response.json().headers;
   var jsonData = pm.response.json().scenario1.result;

   pm.test("transfer should have completed", function () {
      pm.expect(jsonData.currentState).to.eql("COMPLETED");
      pm.expect(jsonData.fulfil.transferState).to.eql("COMMITTED");
   });

   pm.test("payerfsp data should have the same payer as request", function () {
      pm.expect(jsonData.from.idType).to.eql(pm.environment.get("payerIdType"));
      pm.expect(jsonData.from.idValue).to.eql(pm.environment.get("payerIdValue"));
   });

   pm.test("payeefsp data should have the same payer as request", function () {
      pm.expect(jsonData.to.idType).to.eql(pm.environment.get("payeeIdType"));
      pm.expect(jsonData.to.idValue).to.eql(pm.environment.get("payeeIdValue"));
   });


   pm.test("quote data should have correct transfer amount and currency", function () {
      pm.expect(jsonData.quoteResponse.transferAmount.amount).to.eql(pm.environment.get("amount"));
      pm.expect(jsonData.quoteResponse.transferAmount.currency).to.eql(pm.environment.get("currency"));

   });
});



    */

  })

})