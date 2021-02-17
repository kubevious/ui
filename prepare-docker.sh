#!/bin/bash
MY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
MY_DIR="$(dirname $MY_PATH)"
cd $MY_DIR

source configuration.sh

# docker build -f Dockerfile.dev -t kubevious-saas-frontend:dev .

# docker build -t kubevious-ui-react:prod .
# 
docker build --no-cache \
    -m 4000m \
    -t kubevious-ui-react:dev \
    .

echo "*** RUN WITH:"
echo "    $ ./run-docker.sh"
