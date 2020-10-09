# ./seed

Seed contains TS scripts related to seeding pisp environments. 

For now, it is a simple port from the postman approach of seeding the database, for use in the `docker-live` k8s environment


## Step Scratchpad - Seed

### seed_hub_account - done
```bash
curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/Hub/accounts' \
--header 'Content-Type: application/json' \
--header 'FSPIOP-Source: {{payerfsp}}' \
--header 'Authorization: Bearer {{BEARER_TOKEN}}' \
--data-raw '{
  "type": "HUB_MULTILATERAL_SETTLEMENT",
  "currency": "{{currency}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/Hub/accounts' \
--header 'Content-Type: application/json' \
--header 'FSPIOP-Source: {{payerfsp}}' \
--header 'Authorization: Bearer {{BEARER_TOKEN}}' \
--data-raw '{
  "type": "HUB_RECONCILIATION",
  "currency": "{{currency}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/Hub/endpoints' \
--header 'Cache-Control: no-cache' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{BEARER_TOKEN}}' \
--data-raw '{
  "type": "SETTLEMENT_TRANSFER_POSITION_CHANGE_EMAIL",
  "value": "sridevi.miriyala@modusbox.com"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/Hub/endpoints' \
--header 'Cache-Control: no-cache' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{BEARER_TOKEN}}' \
--data-raw '{
  "type": "NET_DEBIT_CAP_ADJUSTMENT_EMAIL",
  "value": "sridevi.miriyala@modusbox.com"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/Hub/endpoints' \
--header 'Cache-Control: no-cache' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{BEARER_TOKEN}}' \
--data-raw '{
  "type": "NET_DEBIT_CAP_THRESHOLD_BREACH_EMAIL",
  "value": "sridevi.miriyala@modusbox.com"
}'
```

### seed_oracle

```bash
curl --location --request POST '{{HOST_ACCOUNT_LOOKUP_ADMIN}}/oracles' \
--header 'Accept: application/vnd.interoperability.participants+json;version=1' \
--header 'Cache-Control: no-cache' \
--header 'Content-Type: application/vnd.interoperability.participants+json;version=1.0' \
--header 'Date: ' \
--header 'Postman-Token: 003d55c1-2ebc-4e25-b9da-26bf053a8a5c' \
--header 'cache-control: no-cache' \
--data-raw '{
  "oracleIdType": "MSISDN",
  "endpoint": {
    "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}/oracle",
    "endpointType": "URL"
  },
  "currency": "USD",
  "isDefault": true
}'
```


### seed_dfspa

[ 
  note:
  values are: environments/Mojaloop-Local-Docker-Compose.postman_environment_DFSP_PAYER.json
]

```bash
curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants' \
--header 'Content-Type: application/json' \
--data-raw '{"name": "{{payerfsp}}","currency": "{{currency}}"}'


curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/initialPositionAndLimits' \
--header 'Content-Type: application/json' \
--data-raw '{
	"currency": "{{currency}}",
	"limit": {
	  "type": "NET_DEBIT_CAP",
	  "value": 1000000
	},
	"initialPosition": 0
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/accounts/{{payerfspSettlementAccountId}}' \
--header 'Content-Type: application/json' \
--header 'FSPIOP-Source: {{payerfsp}}' \
--header 'Authorization: Bearer {{BEARER_TOKEN}}' \
--data-raw '{
  "transferId": "{{fundsInPrepareTransferId}}",
  "externalReference": "string",
  "action": "recordFundsIn",
  "reason": "string",
  "amount": {
    "amount":"{{fundsInPrepareAmount}}" ,
    "currency": "{{currency}}"
  },
  "extensionList": {
    "extension": [
      {
        "key": "string",
        "value": "string"
      }
    ]
  }
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_PARTICIPANT_PUT",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}/participants/{{partyIdType}}/{{partyIdentifier}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_PARTICIPANT_PUT_ERROR",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}/participants/{{partyIdType}}/{{partyIdentifier}}/error"
}'


curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_PARTICIPANT_BATCH_PUT",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}/participants/{{requestId}}"
}'





curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_PARTICIPANT_BATCH_PUT_ERROR",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}/participants/{{requestId}}/error"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_PARTIES_GET",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}/parties/{{partyIdType}}/{{partyIdentifier}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_PARTIES_PUT",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}/parties/{{partyIdType}}/{{partyIdentifier}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_PARTIES_PUT_ERROR",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}/parties/{{partyIdType}}/{{partyIdentifier}}/error"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_QUOTES",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_TRANSFER_POST",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}/transfers"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_TRANSFER_PUT",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}/transfers/{{transferId}}"
}'







curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_TRANSFER_ERROR",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}/transfers/{{transferId}}/error"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Cache-Control: no-cache' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{BEARER_TOKEN}}' \
--data-raw '{
  "type": "NET_DEBIT_CAP_ADJUSTMENT_EMAIL",
  "value": "sridevi.miriyala@modusbox.com"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Cache-Control: no-cache' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{BEARER_TOKEN}}' \
--data-raw '{
  "type": "SETTLEMENT_TRANSFER_POSITION_CHANGE_EMAIL",
  "value": "sridevi.miriyala@modusbox.com"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Cache-Control: no-cache' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{BEARER_TOKEN}}' \
--data-raw '{
  "type": "NET_DEBIT_CAP_THRESHOLD_BREACH_EMAIL",
  "value": "sridevi.miriyala@modusbox.com"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_BULK_TRANSFER_POST",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}/bulkTransfers"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_BULK_TRANSFER_PUT",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}/bulkTransfers/{{id}}"
}'





curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_BULK_TRANSFER_ERROR",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}/bulkTransfers/{{id}}/error"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_TRX_REQ_SERVICE",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}"
}'




curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--header ': ' \
--data-raw '{
  "type": "TP_CB_URL_TRANSACTION_REQUEST_POST",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_TRANSACTION_REQUEST_PUT",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_TRANSACTION_REQUEST_PUT_ERROR",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_TRANSACTION_REQUEST_PATCH",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_TRANSACTION_REQUEST_AUTH_POST",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_TRANSACTION_REQUEST_AUTH_PUT",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'




curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_TRANSACTION_REQUEST_AUTH_PUT_ERROR",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_CONSENT_REQUEST_POST",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_CONSENT_REQUEST_PUT",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_CONSENT_REQUEST_PUT_ERROR",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_CREATE_CREDENTIAL_POST",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_CONSENT_POST",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_CONSENT_GET",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_CONSENT_PUT",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_CONSENT_PUT_ERROR",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_AUTHORIZATIONS",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'


# creating a party
curl --location --request PUT '{{HOST_SIMULATOR_K8S_CLUSTER}}/parties/MSISDN/123456789' \
--header 'Accept: application/vnd.interoperability.parties+json;version=1' \
--header 'Content-Type: application/vnd.interoperability.parties+json;version=1.0' \
--header 'FSPIOP-Source: mojaloop-sdk' \
--header 'Date: {{dateHeader}}' \
--header 'FSPIOP-Destination: mojaloop-sdk' \
--header 'FSPIOP-Signature: {{fspiop-signature}}' \
--data-raw '{"party":{"partyIdInfo":{"partyIdType":"MSISDN","partyIdentifier":"123456789","fspId":"dfspa"},"name":"Alice","personalInfo":{"complexName": {"firstName": "Alice","lastName": "A"},"dateOfBirth": "1982-02-01"}}}'

```

### seed_dfspb

[
  note: same as above, just for a different id and endpoints
  see `environments/Mojaloop-Local-Docker-Compose.postman_environment_DFSP_PAYEE.json`
]

### seed_pisp

[
  see `environments/Mojaloop-Local-Docker-Compose.postman_environment_PISP.json`
]

```bash
curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants' \
--header 'Content-Type: application/json' \
--data-raw '{"name": "{{payerfsp}}","currency": "{{currency}}"}'

# TODO: we don't want this for the PISP...
curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/initialPositionAndLimits' \
--header 'Content-Type: application/json' \
--data-raw '{
	"currency": "{{currency}}",
	"limit": {
	  "type": "NET_DEBIT_CAP",
	  "value": 1000000
	},
	"initialPosition": 0
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_PARTIES_PUT",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}/parties/{{partyIdType}}/{{partyIdentifier}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_PARTIES_PUT_ERROR",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}/parties/{{partyIdType}}/{{partyIdentifier}}/error"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_AUTHORIZATIONS",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "FSPIOP_CALLBACK_URL_TRX_REQ_SERVICE",
  "value": "{{HOST_SIMULATOR_K8S_CLUSTER}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--header ': ' \
--data-raw '{
  "type": "TP_CB_URL_TRANSACTION_REQUEST_POST",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_TRANSACTION_REQUEST_PUT",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_TRANSACTION_REQUEST_PUT_ERROR",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_TRANSACTION_REQUEST_PATCH",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_TRANSACTION_REQUEST_AUTH_POST",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_TRANSACTION_REQUEST_AUTH_PUT",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_TRANSACTION_REQUEST_AUTH_PUT_ERROR",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_CONSENT_REQUEST_POST",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_CONSENT_REQUEST_PUT",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_CONSENT_REQUEST_PUT_ERROR",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_CREATE_CREDENTIAL_POST",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_CONSENT_POST",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_CONSENT_GET",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_CONSENT_PUT",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'

curl --location --request POST '{{HOST_CENTRAL_LEDGER}}/participants/{{payerfsp}}/endpoints' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "TP_CB_URL_CONSENT_PUT_ERROR",
  "value": "{{THIRDPARTY_SCHEME_ADAPTER_INBOUND}}"
}'


```

### seed_dfspa_simulator

[
  note: same as `seed_dfspa` (I think), just for a different id and endpoints
  see `environments/Mojaloop-Local-Docker-Compose.postman_environment_DFSP_SIMULATOR.json`
]


### seed_dfsp_a_msisdn

[
  see `environments/Mojaloop-Local-Docker-Compose.postman_environment.json`
]

```bash
curl --location --request POST '{{HOST_ACCOUNT_LOOKUP_SERVICE}}/participants/MSISDN/123456789' \
--header 'Accept: application/vnd.interoperability.participants+json;version=1' \
--header 'Connection: keep-alive' \
--header 'Content-Type: application/vnd.interoperability.participants+json;version=1.0' \
--header 'Date: {{transferDate}}' \
--header 'FSPIOP-Source: dfspa' \
--header 'Postman-Token: 7aa4c9f3-1738-49f0-8904-7821e2336692,4127ff87-7d17-483c-8e3e-f0b562a16d84' \
--header 'User-Agent: PostmanRuntime/7.11.0' \
--header 'accept-encoding: gzip, deflate' \
--header 'cache-control: no-cache' \
--data-raw '{
    "fspId": "dfspa",
    "currency": "USD"
}'
```

### seed_dfsp_b_msisdn

```bash
curl --location --request POST '{{HOST_ACCOUNT_LOOKUP_SERVICE}}/participants/MSISDN/987654321' \
--header 'Accept: application/vnd.interoperability.participants+json;version=1' \
--header 'Connection: keep-alive' \
--header 'Content-Type: application/vnd.interoperability.participants+json;version=1.0' \
--header 'Date: {{transferDate}}' \
--header 'FSPIOP-Source: dfspb' \
--header 'Postman-Token: 7aa4c9f3-1738-49f0-8904-7821e2336692,4127ff87-7d17-483c-8e3e-f0b562a16d84' \
--header 'User-Agent: PostmanRuntime/7.11.0' \
--header 'accept-encoding: gzip, deflate' \
--header 'cache-control: no-cache' \
--data-raw '{
    "fspId": "dfspb",
    "currency": "USD"
}'
```

### seed_dfsp_simulator_msisdn

[
  see: `environments/Mojaloop-Local-Docker-Compose.postman_environment_DFSP_SIMULATOR.json`
]

```bash
curl --location --request POST '{{HOST_ACCOUNT_LOOKUP_SERVICE}}/participants/MSISDN/333333333' \
--header 'Accept: application/vnd.interoperability.participants+json;version=1' \
--header 'Connection: keep-alive' \
--header 'Content-Type: application/vnd.interoperability.participants+json;version=1.0' \
--header 'Date: {{transferDate}}' \
--header 'FSPIOP-Source: payeefsp' \
--header 'Postman-Token: 7aa4c9f3-1738-49f0-8904-7821e2336692,4127ff87-7d17-483c-8e3e-f0b562a16d84' \
--header 'User-Agent: PostmanRuntime/7.11.0' \
--header 'accept-encoding: gzip, deflate' \
--header 'cache-control: no-cache' \
--data-raw '{
    "fspId": "payeefsp",
    "currency": "USD"
}'

curl --location --request POST '{{HOST_SIMULATOR_K8S_CLUSTER}}/parties/MSISDN/333333333' \
--header 'Content-Type: application/json' \
--data-raw '{"party":{"partyIdInfo":{"partyIdType":"MSISDN","partyIdentifier":"333333333","fspId":"payeefsp"},"name":"gattex","personalInfo":{"complexName": {"firstName": "Aruna","lastName": "Switch"},"dateOfBirth": "1982-02-01"}}}'

curl --location --request POST '{{HOST_SIMULATOR_K8S_CLUSTER}}/parties/MSISDN/333333333' \
--header 'Content-Type: application/json' \
--data-raw '{ "party":{"partyIdInfo":{"partyIdType":"MSISDN","partyIdentifier": "333333333","fspId":"payeefsp"},"name": "gattex","personalInfo": {"complexName": {"firstName": "Aruna","lastName": "Switch"},"dateOfBirth": "1982-02-01"}}}'
```


### seed_dfsp_backend_parties

[
  note: no env file for this one
]

```bash

curl --location --request POST 'localhost:9003/repository/parties' \
--header 'Content-Type: application/json' \
--data-raw '{
    "displayName": "Alice Alpaca",
    "firstName": "Alice",
    "middleName": "K",
    "lastName": "Alpaca",
    "dateOfBirth": "1970-01-01",
    "idType": "MSISDN",
    "idValue": "123456789",
    "accounts": [
		{ "currency": "USD",
		  "description": "savings",
		  "address": "moja.amber.53451233-b82a5456a-4fa9-838b-123456789"
		},
		{ "currency": "USD",
		  "description": "checkings",
		  "address": "moja.amber.8f027046-b8236345a-4fa9-838b-123456789"
		}
	]
}'

curl --location --request POST 'localhost:10003/repository/parties' \
--header 'Content-Type: application/json' \
--data-raw '{
    "displayName": "Bob Babirusa",
    "firstName": "Bob",
    "middleName": "O",
    "lastName": "Babirusa",
    "dateOfBirth": "1970-01-01",
    "idType": "MSISDN",
    "idValue": "987654321",
    "accounts": [
		{ "currency": "USD",
		  "description": "savings",
		  "address": "moja.burgundy.76542756-f49gk439f-6a5f-543d-987654321"
		},
		{ "currency": "USD",
		  "description": "checkings",
		  "address": "moja.burgundy.43638980-f49gk439f-6a5f-543d-987654321"
		}
	]
}'

curl --location --request POST 'localhost:11003/repository/parties' \
--header 'Content-Type: application/json' \
--data-raw '{
    "displayName": "PISP SIM",
    "firstName": "PISP",
    "middleName": "O",
    "lastName": "SIM",
    "dateOfBirth": "1970-01-01",
    "idType": "MSISDN",
    "idValue": "999999999"
}'
```



## Step Scratchpad - TX

### test-E2E-transaction-req-initiated-by-PISP

```bash
curl --location --request POST 'http://localhost:7002/requestToPay' \
--header 'Content-Type: application/json' \
--data-raw '{
    "homeTransactionId": "{{homeTransactionId}}",
    "from": {
        "idType": "MSISDN",
        "idValue": "{{payeefspMSISDN}}"
    },
    "to": {
        "idType": "MSISDN",
        "idValue": "{{payerfspMSISDN}}"
    },
    "amountType": "SEND",
    "currency": "{{currency}}",
    "amount": "18",
    "scenario":"PAYMENT",
    "initiator":"PAYEE",
    "initiatorType":"BUSINESS",
    "note": "pisp payment"
}'

curl --location --request POST 'localhost:5002/requestToPayTransfer' \
--header 'Content-Type: application/json' \
--data-raw '{
  "requestToPayTransactionId": "{{transactionRequestId}}",
  "from": {
    "idType": "MSISDN",
    "idValue": "123456789"
  },
  "to": {
    "idType": "MSISDN",
    "idValue": "987654321",
    "fspId":"dfspb"
  },
  "amountType": "SEND",
  "currency": "{{currency}}",
  "amount": "18",
  "scenario":"PAYMENT",
  "initiator":"PAYEE",
  "initiatorType":"BUSINESS",
  "note": "test payment"
}
'
curl --location --request PUT 'localhost:5002/requestToPayTransfer/{{transactionRequestId}}' \
--header 'Content-Type: application/json' \
--data-raw '{
  "acceptQuote": true
}
'
```
