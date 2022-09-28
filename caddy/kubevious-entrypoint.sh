#!/bin/sh

echo "Running Kubevious v${KUBEVIOUS_VERSION}"
echo "window.KUBEVIOUS_VERSION = \"v${KUBEVIOUS_VERSION}\";" > /caddy/www/version.js

echo ">>>> CADDY CONFIG BEGIN"
cat /etc/caddy/Caddyfile
echo "<<<< CADDY CONFIG END"

exec "$@"