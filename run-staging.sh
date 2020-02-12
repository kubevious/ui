#!/bin/bash
MY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
MY_DIR="$(dirname $MY_PATH)"
cd $MY_DIR

export NODE_ENV=production
export BACKEND_URL=http://localhost:4000
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
node src/.