#!/bin/bash
MY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
MY_DIR="$(dirname $MY_PATH)"

cd ${MY_DIR}

TARGET_MODULE=$1

./sync-public-from-to.sh "${TARGET_MODULE}" "public"

./sync-public-from-to.sh "${TARGET_MODULE}" "src"