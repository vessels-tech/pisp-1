#!/usr/bin/env bash

set -e

# Make sure you run
# docker-compose up mysql-als account-lookup-service simulator central-ledger mysql

curl --fail -X GET 'http://account-lookup-service-admin.local:4001/health'

# Create the oracle - note this is created already if setup from postman
# curl --fail -X POST 'http://account-lookup-service-admin.local:4001/oracles' \
#   --header 'Accept: application/vnd.interoperability.participants+json;version=1' \
#   --header 'Content-Type: application/vnd.interoperability.participants+json;version=1.0' \
#   --header 'Date: Wed May 20 17:10:09 PST 2020' \
#   --data-raw '{
#     "oracleIdType": "MSISDN",
#     "endpoint": {
#       "value": "http://moja-simulator.local/oracle",
#       "endpointType": "URL"
#     },
#     "currency": "USD",
#     "isDefault": true
#   }'


# Register the participant
# curl --fail -X POST 'http://account-lookup-service.local:4002/participants/MSISDN/123456789' \
#   --header 'Accept: application/vnd.interoperability.participants+json;version=1' \
#   --header 'Content-Type: application/vnd.interoperability.participants+json;version=1.0' \
#   --header 'FSPIOP-Source: payeefsp' \
#   --header 'Date: Wed May 20 17:10:09 PST 2020' \
#   --data-raw '{
#       "fspId": "payeefsp",
#       "currency": "USD"
#   }'

  
# Get the participant
curl -v --fail -X GET 'http://account-lookup-service.local:4002/participants/MSISDN/123456789' \
  --header 'Accept: application/vnd.interoperability.participants+json;version=1' \
  --header 'Content-Type: application/vnd.interoperability.participants+json;version=1.0' \
  --header 'FSPIOP-Source: payeefsp' \
  --header 'Date: Wed May 20 17:10:09 PST 2020'

