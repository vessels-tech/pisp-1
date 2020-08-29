# `PUT /transfer/{id}` Callback Design



## 1. Subscription

The goal of subscription is to allow the Central-Event-Processor (CEP) to listen for `PUT /transfer/{id}` notification callbacks from Kafka, and deliver them to the Thirdparty-API-Adapter.

# 1.1 `




## Outstanding Questions

1. Should the CEP be listening for `POST /quotes` (probably from the quoting-service) or for  `POST /authorizations` (probably from the 3p-api-adapter?)
  - `POST /authorizations` is more efficent, since it certainly `transactionRequestId`, whereas quotes _may_ contain a `transactionRequestId`
  - `POST /quotes` is more generic, and could lead us to better design decisions (such as not including the quote response _in_ the `POST /authorizations` body) in the future
    - does the `quoting-service` publish to kafka at the moment? No.

2. Can we generalize this pattern better and make it more applicable to other use cases?
  - e.g. `Consents`, `FX`, `Cross-network`?

3. When should does the CEP _stop listening_?
  - we need to enumerate the error conditions a little better

4. When do we consider a _transaction_ final? Is it determined by the PayeeFSP? Or perhaps by the Central-Ledger? Or could it be either? 