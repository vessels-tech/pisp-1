#!/usr/bin/env bash

PATH=$(npm bin):$PATH
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

newman run \
  --delay-request=2000 \
  --folder='Hub Account' \
  --environment=${DIR}/../environments/Mojaloop-Local-Docker-Compose.postman_environment.json \
  ${DIR}/../OSS-New-Deployment-FSP-Setup.postman_collection.json
