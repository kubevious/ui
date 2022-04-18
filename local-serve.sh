#!/bin/bash
MY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
MY_DIR="$(dirname $MY_PATH)"
cd ${MY_DIR}

echo "**** RUNNING HTTP-SERVER ***"
echo "**** INSTALL USING: npm install http-server -g"
http-server -p 4001 ./build
