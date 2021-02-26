#!/bin/bash
MY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
MY_DIR="$(dirname $MY_PATH)"
cd $MY_DIR

export BACKEND_URL=http://localhost:4001
export SKIP_PREFLIGHT_CHECK=true

cd src
npm start
