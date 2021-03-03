#!/bin/bash
MY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
MY_DIR="$(dirname $MY_PATH)"
cd $MY_DIR

cd src

rm -rf node_modules/

npm install
npm update @kubevious/helpers the-lodash the-promise @kubevious/ui-framework @kubevious/ui-middleware @kubevious/ui-components @kubevious/websocket-client @kubevious/ui-alerts

