#!/bin/bash
MY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
MY_DIR="$(dirname $MY_PATH)"

cd ${MY_DIR}/..

TARGET_MODULE=$1
DEST_ROOT_DIR=$2

echo "* Syncing public from ${TARGET_MODULE} to ${DEST_ROOT_DIR}..."

SOURCE_DIR="node_modules/${TARGET_MODULE}/public/img"

if [[ ! -d "${SOURCE_DIR}" ]]; then
    echo "    Missing directory: ${SOURCE_DIR}..."
    exit 1
fi


GIT_IGNORE_FILE=${DEST_ROOT_DIR}/img/.gitignore
echo "GIT IGNORE: ${GIT_IGNORE_FILE}"

SOURCE_FILES_ARRAY=()
while IFS=  read -r -d $'\0'; do
    SOURCE_FILES_ARRAY+=("$REPLY")
done < <(find "${SOURCE_DIR}" -print0)

for SOURCE_FILE in "${SOURCE_FILES_ARRAY[@]}"
do
    if [[ -f "${SOURCE_FILE}" ]]; then
        echo "  - Copying Source: ${SOURCE_FILE}"
        SRC_FILE=${SOURCE_FILE#"${SOURCE_DIR}/"}
        REL_FILE=img/${SRC_FILE}
        echo "        Rel Source: ${SRC_FILE}"

        DEST_FILE="${DEST_ROOT_DIR}/${REL_FILE}"
        echo "              Dest: ${DEST_FILE}"

        echo "${SRC_FILE}" >> ${GIT_IGNORE_FILE}

        DEST_DIR="$(dirname ${DEST_FILE})"
        mkdir -p "${DEST_DIR}"
        cp -f "${SOURCE_FILE}" "${DEST_FILE}"
    fi
done