
//TODO: load these more intelligently to allow for different environments

export type TestEnvType = {
  amount: string,
  amountType: string,
  baseUrl: string,
  currency: string,
  payerIdType: string,
  payerIdValue: string,
  payeeIdType: string,
  payeeIdValue: string,
  // note: string,
  // homeTransactionId: string,
  // transactionType: string,
}


const TestEnv: TestEnvType = {
  amount: '100',
  amountType: 'SEND',
  baseUrl: 'http://localhost:9003',
  currency: 'USD',
  payerIdType: 'MSISDN',
  payerIdValue: '123456789',
  payeeIdType: 'MSISDN',
  payeeIdValue: '987654321',
  // note: 'Test note',
  // homeTransactionId: '123ABC',
  // transactionType: 'TRANSFER',
}

export default TestEnv;

