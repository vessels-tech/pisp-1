# `PATCH /thirdpartyRequests/transactions/{id}` Callback Design

One of the challenges we face with the Thirdparty API is getting the notification back to a PISP to inform them of a transaction's outcome.

Our previous design relied on an external state


## 1. API Changes:

### `POST /transfers`

When the PayerDFSP issues this request, it


Fields:
- `transactionId` - the id of the transaction
- `transactionRequestId` - the transactionRequestId this transfer is fulfilling. This id was originally decided by the PISP
- `transactionParticipants` - an array of participantIds and their role in the transaction.

```json
POST /transfers

FSPIOP-Source: dfspa
FSPIOP-Destination: dfspb
{
  "transferId": "321",
  "payerFsp": "dfspa",
  "payeeFsp": "dfspb",
  "amount": {
    "amount": "100",
    "currency": "USD"
  },
  "expiration": "2020-06-15T13:00:00.000",
  "ilpPacket": "...",
  "condition": "...",
  "transactionId": "987",
  "transactionRequestId": "123",
  "transactionParticipants": [
    { 
      "id": "dfspa",
      "role": "CREDITOR",
    },
    { 
      "id": "dfspb",
      "role": "DEBTOR",
    },
    {
      "id": "pispa",
      "role": "INITIATOR"
    }
  ],
}
```

### `PUT /transfers/{id}`

> Q: Do we need to have the `transactionParticipants` in this request? Or can we assume that the central-ledger stores some state related to the original `POST /transfers` request, including the participants?

```json
PUT /transfers/321

FSPIOP-Source: dfspb
FSPIOP-Destination: dfspa
{
  "fulfilment": "...",
  "completedTimestamp": "2020-06-15T12:01:00.000",
  "transferState": "COMMITTED",
  "transactionParticipants": [
    { 
      "id": "dfspa",
      "role": "CREDITOR",
    },
    { 
      "id": "dfspb",
      "role": "DEBTOR",
    },
    {
      "id": "pispa",
      "role": "INITIATOR"
    }
  ]
}
```

## 2. Internal Processing

1. Upon transaction fulfilment at the central-ledger, the central-ledger emits a Notification event:

```json
{
  "from": "dfspb",
  "to": "dfspa",
  "id": "bc1a9c36-4429-4205-8553-11f92de1919e",
  "content": {
    "uriParams": {
      "id": "bc1a9c36-4429-4205-8553-11f92de1919e"
    },
    "headers": {
      "content-type": "application/vnd.interoperability.transfers+json;version=1.0",
      "date": "2020-09-09T03:58:36.000Z",
      "fspiop-source": "dfspb",
      "fspiop-destination": "dfspa",
      "authorization": "Bearer 74b241a2-4200-3938-8dfc-0e26ba21dc22",
      "content-length": "136",
      "host": "ml-api-adapter:3000",
      "connection": "close"
    },
    "payload": "data:application/vnd.interoperability.transfers+json;version=1.0;base64,eyJjb21wbGV0ZWRUaW1lc3RhbXAiOiIyMDIwLTA5LTA5VDAzOjU4OjM2Ljg0NFoiLCJ0cmFuc2ZlclN0YXRlIjoiQ09NTUlUVEVEIiwiZnVsZmlsbWVudCI6Ii1TODBPZ0pMbEpSVElHUFAxMlpZTnFjZEhLQlQ3WHNVZDFjenVOMUI5RzQifQ"
  },
  "type": "application/json",
  "metadata": {
    "correlationId": "bc1a9c36-4429-4205-8553-11f92de1919e",
    "event": {
      "type": "notification",
      "action": "commit",
      "createdAt": "2020-09-09T03:58:36.859Z",
      "state": {
        "status": "success",
        "code": 0,
        "description": "action successful"
      },
      "id": "85756a1d-c159-4316-b8d0-d0a41ecbcfe1",
      "responseTo": "0ecc24f8-a617-4b60-b954-3cfb4b909ae8"
    },
    "trace": {
      "startTimestamp": "2020-09-09T03:58:36.932Z",
      "service": "cl_transfer_position",
      "traceId": "f67d1328e258e8fba2dacbbed098be48",
      "spanId": "0b142ddb9e695312",
      "parentSpanId": "e933005ac5ade0c6",
      "tags": {
        "tracestate": "acmevendor=eyJzcGFuSWQiOiIwYjE0MmRkYjllNjk1MzEyIiwidGltZUFwaUZ1bGZpbCI6IjE1OTk2MjM5MTY4NTcifQ==",
        "transactionType": "transfer",
        "transactionAction": "fulfil",
        "transactionId": "bc1a9c36-4429-4205-8553-11f92de1919e",
        "source": "dfspb",
        "destination": "dfspa"
      },
      "tracestates": {
        "acmevendor": {
          "spanId": "0b142ddb9e695312",
          "timeApiFulfil": "1599623916857"
        }
      }
    },
    "protocol.createdAt": 1599623916963
  }
}
```

> Q: Should the central-ledger emit 2 events? One for the PayerDFSP and PISP? Or just 1 event that the ml-api-adapter and thirdparty-api-adapter can interpret?
> - According to the 1.1 changes, there is just 1 message: 
>   https://docs.mojaloop.io/documentation/mojaloop-technical-overview/central-ledger/transfers/1.1.4.a-send-notification-to-participant-v1.1.html
> - Message follows the following format: ([ref](https://docs.mojaloop.io/documentation/mojaloop-technical-overview/central-ledger/transfers/1.3.2-fulfil-position-handler-consume-v1.1.html))

```js
{
  id: <transferMessage.transferId>,
  from: <transferMessage.payerFsp>,
  to: <transferMessage.payeeFsp>,
  type: application/json,
  content: {
    headers: <transferHeaders>,
    payload: <transferMessage>
  },
  metadata: {
    event: {
      id: <uuid>,
      responseTo: <previous.uuid>,
      type: transfer,
      action: commit || reserve,
      createdAt: <timestamp>,
      state: {
        status: "success",
        code: 0
      }
    }
  }
}
```

Perhaps this message can be changed to something along the following lines:

```js
{
  id: <transferMessage.transferId>,
  participants: [
    { 
      id: "dfspa",
      role: "CREDITOR",
    },
    { 
      id: "dfspb",
      role: "DEBTOR",
    },
    {
      id: "pispa",
      role: "INITIATOR"
    }
  ],
  type: application/json,
  content: {
    headers: <transferHeaders>,
    payload: <transferMessage>
  },
  metadata: {
    event: {
      id: <uuid>,
      responseTo: <previous.uuid>,
      type: transfer,
      action: commit || reserve,
      createdAt: <timestamp>,
      state: {
        status: "success",
        code: 0
      },
      // add these fields so the thirdparty-api-adapter can correlate this message to a transaction
      transactionId: "987",
      transactionRequestId: "123",
    }
  }
}
```

> Note: This somewhat alters the way we use the FSPIOP-Headers, which may not be desireable

2. The thirdparty-api-adapter sees this notification, 


## Known Issues with this design

- The API messages are not backwards compatible for the PayeeFSP
- We _still_ need to keep some state in the central-ledger's database related to:
   - `transactionId`
   - `transactionRequestId`
   - `transactionParticipants`

- There is somewhat redundant information between the FSPIOP-Headers (which are for routing messages), and the proposed `transactionParticipants` collection in the POST/PUT request bodies.
  - The original proposal was to use an `FSPIOP-Initiator` header, perhaps that is a simpler approach

- When the thirdparty-api-adapter recieves the fulfilment notification, it must convert this to a `PATCH /thirdpartyRequests/transactions/{id}`
  - this requires the `transactionRequestId` (and maybe the `transactionId`) in the notification message
