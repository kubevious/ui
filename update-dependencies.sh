#!/bin/bash
MY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
MY_DIR="$(dirname $MY_PATH)"
cd $MY_DIR

npm update \
    the-lodash \
    @kubevious/ui-framework \
    @kubevious/ui-middleware \
    @kubevious/ui-components \
    @kubevious/ui-diagram \
    @kubevious/ui-alerts \
    @kubevious/ui-properties \
    @kubevious/ui-rule-engine \
    @kubevious/ui-time-machine \
    @kubevious/helpers \
    @kubevious/websocket-client
