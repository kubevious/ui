#!/bin/bash
MY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
MY_DIR="$(dirname $MY_PATH)"
cd $MY_DIR

rm -rf node_modules/

npm install

${MY_DIR}/update-dependencies.sh

${MY_DIR}/dev-sync-public.sh
