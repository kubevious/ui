#!/bin/bash
MY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
MY_DIR="$(dirname $MY_PATH)"

cd ${MY_DIR}

./sync-public-from.sh '@kubevious/ui-components'
./sync-public-from.sh '@kubevious/ui-properties'
./sync-public-from.sh '@kubevious/ui-diagram'
./sync-public-from.sh '@kubevious/ui-alerts'
./sync-public-from.sh '@kubevious/ui-rule-engine'
./sync-public-from.sh '@kubevious/ui-time-machine'

cd ${MY_DIR}/../public
touch gitignore
sort -o gitignore .gitignore
rm .gitignore
mv gitignore .gitignore

exit 0
