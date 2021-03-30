#!/bin/bash
MY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
MY_DIR="$(dirname $MY_PATH)"
cd $MY_DIR

source configuration.sh

#  --no-cache --progress=plain 
docker build \
    -m 4000m \
    -t kubevious-ui-react:dev \
    .

echo "*** RUN WITH:"
echo "    $ ./run-dev-docker.sh"
