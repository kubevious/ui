#!/bin/bash
MY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
MY_DIR="$(dirname $MY_PATH)"
cd $MY_DIR

docker run \
    -it \
    --rm \
    --name 'kubevious-ui' \
    -p 4000:80 \
    --network kubevious \
    -v ${MY_DIR}/nginx:/etc/nginx/conf.d \
    kubevious-ui-react:prod
