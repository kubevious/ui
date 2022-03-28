#!/bin/bash
MY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
MY_DIR="$(dirname $MY_PATH)"
cd $MY_DIR

cd src
npm run cy:run -- --spec 'cypress/integration/mock/**/*.js'
# -- --spec "cypress/integration/startPage.spec.js"
