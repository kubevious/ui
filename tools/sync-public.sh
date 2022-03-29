#!/bin/bash
MY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
MY_DIR="$(dirname $MY_PATH)"

cd ${MY_DIR}

PUBLIC_GIT_IGNORE=${MY_DIR}/../public/img/.gitignore
rm ${PUBLIC_GIT_IGNORE}
touch ${PUBLIC_GIT_IGNORE}

PUBLIC_GIT_IGNORE=${MY_DIR}/../src/img/.gitignore
rm ${PUBLIC_GIT_IGNORE}
touch ${PUBLIC_GIT_IGNORE}

./sync-public-from.sh '@kubevious/ui-components'
./sync-public-from.sh '@kubevious/ui-properties'
./sync-public-from.sh '@kubevious/ui-alerts'
./sync-public-from.sh '@kubevious/ui-rule-engine'
./sync-public-from.sh '@kubevious/ui-time-machine'
./sync-public-from.sh '@kubevious/ui-browser'
./sync-public-from.sh '@kubevious/entity-meta'


PUBLIC_GIT_IGNORE=${MY_DIR}/../public/img/.gitignore
PUBLIC_GIT_IGNORE_2=${PUBLIC_GIT_IGNORE}x
touch ${PUBLIC_GIT_IGNORE_2} 
sort -u ${PUBLIC_GIT_IGNORE} > ${PUBLIC_GIT_IGNORE_2} 
rm ${PUBLIC_GIT_IGNORE}
mv ${PUBLIC_GIT_IGNORE_2} ${PUBLIC_GIT_IGNORE}

PUBLIC_GIT_IGNORE=${MY_DIR}/../src/img/.gitignore
PUBLIC_GIT_IGNORE_2=${PUBLIC_GIT_IGNORE}x
touch ${PUBLIC_GIT_IGNORE_2} 
sort -u ${PUBLIC_GIT_IGNORE} > ${PUBLIC_GIT_IGNORE_2} 
rm ${PUBLIC_GIT_IGNORE}
mv ${PUBLIC_GIT_IGNORE_2} ${PUBLIC_GIT_IGNORE}

exit 0
