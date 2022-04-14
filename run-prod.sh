#!/bin/bash
MY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
MY_DIR="$(dirname $MY_PATH)"
cd $MY_DIR

source configuration.sh

export NODE_ENV=development
echo "NODE_ENV=${NODE_ENV}"

export REACT_APP_APP_ROOT_URL="http://localhost:${API_GATEWAY_PORT}"

npm start
