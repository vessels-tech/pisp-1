# Transfer Outcome Notification

[#273](https://app.zenhub.com/workspaces/pisp-5e8457b05580fb04a7fd4878/issues/mojaloop/mojaloop/273) As a `PISP` I want to `be informed of the outcome of a transaction` so that `I can inform my customer`.

- This will be a _copy_ of the `PUT /transfers/{ID}` or `PUT /transfers/{ID}/error` request sent by the PayeeDFSP
- The call will originate somewhere from the switch
- The challenge here is how the switch will know that a given transfer relates to a `thirdPartyRequest/transfers/{ID}`


We will break down the problem into 2 steps: 
1. **Subscription:** Where the Switch marks the PISP as an _interested party_ for a given transaction
2. **Notification:** Where the Switch receives a `PUT /transfers/{ID}` or `PUT /transfers/{ID}/error` from a Payee DFSP, evaluates it against the previous subscription, and _copies_ the `PUT /transfer...` to the 

## Subscription

TBD

## Notification

There are a few potential places we could implement the notification business logic:
1. Central Event Processor - A service currently used for monitoring and alerts, but could also be used to _watch_ transfer events and emit other kafka events
2. ml-api-adapter notification handler - The notification handler is already responsible for sending the `PUT /transfers/{ID}` to the PayerDFSP

### Option 1. `central-event-processor`

The process flow would look something like the following:
1. `central-ledger` emits a message on the `Notification-Topic`
  > Ref: https://docs.mojaloop.io/documentation/mojaloop-technical-overview/central-ledger/transfers/1.1.4.a-send-notification-to-participant.html
2. `central-event-processor` consumes this message
  > _Q: is this possible with Kafka? What if the message is already consumed by the `ml-api-adapter` notification handler?_
3. `central-event-processor` looks up the previous subscription for the related context (ie. which pisp to inform)
4. `central-event-processor` emits a message on `Thirdparty-Transfer-Topic`
5. `thirdparty-api-adapter` consumes message from `Thirdparty-Transfer-Topic`, and sends `PUT /transfers/...` to the PISP
6. `central-event-processor` removes the subscription (I think)

**Implications:**
- not in critical path, takes advantage of our resilient messaging
- it makes sense for the CEP to simply act as a _filter_ which filters incoming `PUT /transfers...` notifications and sending them through to the `thirdparty-api-adapter` if they are relevant to a previous `thirdpartyRequest
- This approach is more complicated than #2
- Potential duplication of business logic, which could make implementation over complicated and redundant
    - But it also means we can easily generalize for more than _just_ transfers with the `ml-api-adapter`

- Does this expand the CEP beyond it's intial scope? Does it make sense to implement here? Or in another service, such as `thirdparty-event-processor`?

### Option 2. `ml-api-adapter` notification handler

The existing notification handler could handle this logic, after sending the `PUT /transfers...` to the PayerDFSP

1. `central-ledger` emits a message on the `Notification-Topic`
  > Ref: https://docs.mojaloop.io/documentation/mojaloop-technical-overview/central-ledger/transfers/1.1.4.a-send-notification-to-participant.html
2. `ml-api-adapter` notification handler consumes this message, as normal
3. After step 14, it looks up some list of subscriptions to see if there are any PISPs interested in this transfer
4. Looks up the endpoint for the PISP, and sends the `PUT /transfers...` call

**Implications:**
- not necessarily in critical path, so that's nice
- ml-api-adapter would need some sort of state to know about subscriptions for 'interested parties'
- business logic is quite similar, so easy to implement in this case, but doesn't generalize well for extensions to this approach






<!-- [ old stuff below: ] -->


## Questions:
- How will we implement these notifications?
  - The existing notifications (to Payer and Payee DFSPS) are taken from the `notifications` topic by the ml-api-adapter
  - As the current `PUT /transfers/{ID}` notifications live in the `ml-api-adapter`, it makes sense for the new PISP notifications to also live here
  - Depending on the [_new ThirdParty-API design decision_](./design-decisions/README.md), we could put this functionality in a `thirdparty-api-adapter`
  - For now, let's just say we are going to use the `ml-api-adapter`

- Where should the lookup (to get from a `Transfer.quoteId` -> `ThirdPartyRequestId`) logic live? I think the existing ml-api-adapter has no real state attached to it, and has to talk to `central-ledger`
  - Do we _really_ want to be storing stuff about thirdPartyRequests in the central-ledger? That sounds like a bad idea.
  - Perhaps if we implement this separately in a `thirdparty-api-adapter`, it doesn't need to be stateless

- Does it make sense to have a more generic implementation to contain both the `v1.1` `PATCH` changes and the `PUT /thirdPartyRequest/transfers/{ID}`?
  - This is what Michael suggested originally, and the answer to this probably depends on the decision on whether or not we use a new ThirdParty-API, or add to the existing API

- If we implement a new api, or even a new endpoint (`/thirdPartyRequest/transfer`), can we still use the `QuoteRequest.transactionRequestId` field? Or should it be a new field


## Current Notifications

### Design (`FSPIOP-API v1.1`)

- In version [1.1 of the Mojaloop Spec](https://github.com/mojaloop/mojaloop-specification/files/4469135/API.Definition_v1.1-draft_Updated-2020-04-13.docx), section "6.7.2.6 Commit Notification", a Payee DFSP can _ask_ the switch to be notified of a transfer outcome by setting the `transferState = RESERVED` in the `PUT /transfers/{ID}` call to the switch
  - The switch sees that the `transferState = RESERVED` (and not `COMMITTED`, and registers the callback for the PayeeDFSP)
- For future updates of the status of the transfer, the switch calls `PATCH /transfers/{ID}` to the Payee DFSP
- Notifications to the Payer DFSP are implicit and already contained in the `PUT /transfers/{ID}` callback.
- Any design for the PISP (or other 3rd party interest in a transfer) needs to take these existing methods into account.


### Implementation (as of `mojaloop/helm:v10.1.0`, `FSPIOP-API v1.0`)

- In the current implementation, this is handled instead by a `SEND_TRANSFER_CONFIRMATION_TO_PAYEE` config setting
- See the `mojaloop/ml-api-adapter` notification handler, specifically [`notification/index.js`](https://github.com/mojaloop/ml-api-adapter/blob/master/src/handlers/notification/index.js#L323)
- The current implementation is documented [here](https://docs.mojaloop.io/documentation/mojaloop-technical-overview/central-ledger/transfers/1.1.4.a-send-notification-to-participant.html):

> _[Rendered from `mojaloop/documentation...`](https://github.com/mojaloop/documentation/blob/master/mojaloop-technical-overview/central-ledger/assets/diagrams/sequence/seq-prepare-1.1.4.a.plantuml)_

<img src="./1.1.4.a_send_notification_to_participant.png" width=1000/>


- The current architecture of an E2E transfer is:

<img src="https://raw.githubusercontent.com/mojaloop/documentation/master/mojaloop-technical-overview/central-ledger/assets/diagrams/architecture/Transfers-Arch-End-to-End.svg" width=1000/>


## Proposed PISP/3rd Party Notification Design

- The `ml-api-adapter` will use the `PUT /thirdPartyRequest/transfers/{ID}` from the Switch to the PISP

[todo: sequence diagram for this]


<img src="./out/transfers/pisp_notification/send_notification_to_pisp.png" width=1000/>

## From a `thirdPartyRequest/transfers/{ID}` to a `/transfers/{ID}`

The API adapter will need to perform the following tasks:

On a `2.6 Fulfil Notification` event
1. Get `transferId` from the notification body
2. Lookup the `quoteId` for the given `transferId`? _Note: this could be contained in the message body of the event_
> According to [6.8.3.1](https://docs.mojaloop.io/mojaloop-specification/documents/API%20Definition%20v1.0.html#6831-put-transactionsid) of the spec, the `transactionRequestId` is an optional parameter when a PayerDFSP creates a `Quote`
> As of `v1.1` of the mojaloop spec, the `transfer` doesn't contain a reference to a `quoteId`, but will from `v2.0` _todo: link, once we have one_.
3. Lookup `thirdPartyRequests/transfer` objects, does one exist with that given `transactionId`? If so, continue.
> This is based on the assumption that the `QuoteRequest.transactionRequestId` is going to be the same as `/thirdPartyRequest/transfers/{ID}`. Is this valid?
4. From the original `thirdPartyRequests`, lookup the PISP and get their endpoints
5. Send a `PUT /thirdPartyRequest/transfers/{ID}` to the PISP


