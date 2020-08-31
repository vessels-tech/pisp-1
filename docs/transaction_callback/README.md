# `PUT /transfer/{id}` Callback Design


## 1. Subscription

The goal of subscription is to allow the Central-Event-Processor (CEP) to listen for **Transfer Fulfil Notification Events** on the Notifications Topic, and deliver them to the Thirdparty-API-Adapter.

# 1.1 `POST /thirdpartyRequests/transactions`

The PISP issues a `POST /thirdpartyRequests/transactions` request to dfspA, asking to transfer funds from their users funds to dfspB.

The Thirdparty-API-Adapter recieves this request, and emits a **ThirdpartyTransactionRequest Subscription** event
 
The CEP recieves this event, and starts listening for other events related to `transferRequestId=1234` on the notifications topic.

![subscription](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/vessels-tech/pisp-1/feature/273-tx-notif-design-2/docs/transaction_callback/1_subscription.puml)


## 2. Context Gathering

The CEP is listening for events related to a `transactionRequestId=1234`. In order to listen for the Notification Event related to a given `transferId` that will be the result of a successful 3rd party initiation, it needs to gather more context.

### 2.1 `POST /authorizations`

> Maybe this should be on the quote you say? See [outstanding-questions](#outstanding-questions)

The Thirdparty-API-Adapter recieves a `POST /authorizations` request, and before forwarding it to the PISP, it puts a **ThirdpartyAuthorizationRequest** event onto the notifications kafka topic.

The since the CEP is listening for events related to `transactionRequestId=1234`, is observes that this event is related.

It inspects the event body, and sees the `body.transactionId` of `5678`. CEP starts listening for events related to the `transactionId=5678`.

![context_auth](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/vessels-tech/pisp-1/feature/273-tx-notif-design-2/docs/transaction_callback/2_context_auth.puml)


### 2.2 `POST /transfers`

DFSPA issues a `POST /transfer/` request to initiate the transfer. 

The ML-API-Adapter recieves this API call, and sends it on to Kafka.

The CEP observes this event (as it contains either a request body or encoded interledger packet with a `transactionId=5678`) 

The `POST /transfers` contains a `transferId` of `9876`. CEP starts listening for events related to `transferId=9876`.

![context_transfer](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/vessels-tech/pisp-1/feature/273-tx-notif-design-2/docs/transaction_callback/3_context_transfer.puml)


## 3. Notification

DFSPB issues a `PUT /transfers/{id}`.

The transfer is processed by the central-ledger, which emits a Transfer Notification Event.

The CEP sees this Transfer Notification Event, with a `transferId=9876`. It sees the related `transactionRequest` listener, and emits a ThirdpartyRequestTransaction Notification Event.

The Thirdparty-API-Adapter sees this event, and sends a `PATCH /thirdpartyRequests/transactions/1234` request to the PISP.

![transaction_callback](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/vessels-tech/pisp-1/feature/273-tx-notif-design-2/docs/transaction_callback/4_transaction_callback.puml)


## Outstanding Questions

1. Should the CEP be listening for `POST /quotes` (probably from the quoting-service) or for  `POST /authorizations` (probably from the 3p-api-adapter?)
  - `POST /authorizations` is more efficent, since it certainly `transactionRequestId`, whereas quotes _may_ contain a `transactionRequestId`
  - `POST /quotes` is more generic, and could lead us to better design decisions (such as not including the quote response _in_ the `POST /authorizations` body) in the future
    - does the `quoting-service` publish to kafka at the moment? No.

2. Can we generalize this pattern better and make it more applicable to other use cases?
  - e.g. `PISP Consents`, `FX`, `Cross-network`?

3. When should does the CEP _stop listening_?
  - we need to enumerate the error conditions a little better

4. When do we consider a _transaction_ final? Is it determined by the PayeeFSP? Or perhaps by the Central-Ledger? Or could it be either? 

5. How tightly or loosely coupled should the different listeners be? 
  - Should the listener for `transferId=9876` _know_ about the listener for `transferRequestId=1234`?

6. Should this all be on the Notifications topic? Or should there be some division of topics?
  - I don't want to burden the ml-api-adapter's notifications topic handler with extra notifications
  - We can make use of existing different group ids...


## TODO:

- [ ] More detail on different listeners and their interactions
- [ ] tidy up the transfers section
- [ ] finish breaking down seq diagram into inline doc
- [ ] all feasible error conditions
- [ ] enumerate and clarify all kafka events that are involved in this process
- [ ] state machine diagram


## Appendix A - List of Kafka Events

### A.1 ThirdpartyTransactionRequest Subscription

```js
{
  id: '<message.id>',
  from: '<message.initiatorId>',
  to: '<message.payerFsp>',
  type: 'application/json',
  content: {
    headers: '<message.headers>',
    payload: {
      transactionRequestId: '<uuid>',
      sourceAccountId: 'string',
      consentId: 'string',
      ...
    }
  },
  metadata: {
    event: {
      id: '<uuid>',
      type: 'transactionRequest',
      action: 'subscription',
      createdAt: '<timestamp>',
      state: {
        status: 'success',
        code: 0
      }
    }
  }
}
```

### A.2 ThirdpartyAuthorizationRequest

```js
{
  id: '<message.id>',
  from: '<message.payerFsp>',
  to: '<message.initiatorId>',
  type: 'application/json',
  content: {
    headers: '<message.headers>',
    payload: {
      transactionRequestId: '<uuid>',
      transactionId: '<uuid>',
      amount: {...},
      quote: {...}
    }
  },
  metadata: {
    event: {
      id: '<uuid>',
      type: 'authorizationRequest',
      action: 'subscription',
      createdAt: '<timestamp>',
      state: {
        status: 'success',
        code: 0
      }
    }
  }
}
```

### A.3 Transfer Prepare Notification

> Ref [1.3.1-prepare](https://github.com/mojaloop/documentation/blob/master/mojaloop-technical-overview/central-ledger/assets/diagrams/sequence/seq-position-1.3.1-prepare.plantuml)

```js
{
  id: '<transferMessage.transferId>',
  from: '<transferMessage.payerFsp>',
  to: '<transferMessage.payeeFsp>',
  type: 'application/json',
  content: {
    headers: '<transferHeaders>',
    payload: '<transferMessage>'
  },
  metadata: {
    event: {
      id: '<uuid>',
      responseTo: '<previous.uuid>',
      type: 'transfer',
      action: 'prepare',
      createdAt: '<timestamp>',
      state: {
        status: 'success',
        code: 0
      }
    }
  }
}
```


### A.4 Transfer Fulfil Notification Event

>Ref: [1.3.2-fulfil-position-handler-consume-v1.1](https://docs.mojaloop.io/documentation/mojaloop-technical-overview/central-ledger/transfers/1.3.2-fulfil-position-handler-consume-v1.1.html)

```js
{
  id: '<transferMessage.transferId>',
  from: '<transferMessage.payerFsp>',
  to: '<transferMessage.payeeFsp>',
  type: 'application/json',
  content: {
    headers: '<transferHeaders>',
    payload: '<transferMessage>'
  },
  metadata: {
    event: {
      id: '<uuid>',
      responseTo: '<previous.uuid>',
      type: 'transfer',
      action: 'commit' | 'reserve',
      createdAt: '<timestamp>',
      state: {
        status: 'success',
        code: 0
      }
    }
  }
}
```


### A.5 Thirdparty Transaction Request End Event


### A.n Authorization Failure Event

### A.n Thirdparty Transaction Request Error Event

- User rejects
- Fails authorization?
- DFSP rejects

### A.n Transfer Request Error Event

- transfer timeout
- rejection from Payee `PUT /transfers/{id}/error`


## Appendix B - CEP ThirdpartyTransactionRequest Subscription State Machine


```js
'transactionRequestId/1234'
{
  initiatorId: 'pispA',
  sourceDFSP: 'dfspA',
  transactionRequestId: '1234',
  transactionId: null,
  transferId: null,
}
```

```js
'transactionRequestId/1234'
'transactionId/5678'
{
  initiatorId: 'pispA',
  sourceDFSP: 'dfspA',
  transactionRequestId: '1234',
  transactionId: '5678',
  transferId: null,
}
```

```js
'transactionRequestId/1234'
// 'transactionId/5678' - maybe we can retire this listener
'transferId/9876'
{
  initiatorId: 'pispA',
  sourceDFSP: 'dfspA',
  transactionRequestId: '1234',
  transactionId: '5678',
  transferId: '9876'
}
```
