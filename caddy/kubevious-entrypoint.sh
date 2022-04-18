#!/bin/sh

echo "Running Kubevious v${KUBEVIOUS_VERSION}"
echo "window.KUBEVIOUS_VERSION = \"v${KUBEVIOUS_VERSION}\";" > /caddy/www/version.js

exec "$@"