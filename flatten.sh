#!/bin/bash

DEST="./flattened"

FLATTER_COMMAND="node_modules/.bin/truffle-flattener"

SPDX_FILTER="SPDX-License-Identifier"
SPDX_LINE="// SPDX-License-Identifier: Apache-2.0"
PRAGMA_SOL_FILTER="pragma solidity"
PRAGMA_SOL_LINE="pragma solidity ^0.8.2;"
PRAGMA_EXPR_FILTER="pragma experimental"
PRAGMA_EXPR_LINE="pragma experimental ABIEncoderV2;"

declare -a all_contracts=(
    "contracts/MoodyBrainsNFT.sol"
    "contracts/Collection.sol"
)

mkdir -p $DEST

for contract in "${all_contracts[@]}"
do
    file_name=`basename $contract .sol`
    echo "flattening ${contract} ..."
    dest_file="$DEST/${file_name}_flat.sol"
    $FLATTER_COMMAND "../$contract" \
        | grep -v "$SPDX_FILTER" \
        | grep -v "$PRAGMA_SOL_FILTER" > $dest_file

    headers="$SPDX_LINE\n$PRAGMA_SOL_LINE"
    if grep -q "$PRAGMA_EXPR_FILTER" $dest_file; then
        headers="$headers\n$PRAGMA_EXPR_LINE"
        cat $dest_file | grep -v "$PRAGMA_EXPR_FILTER" > "${dest_file}.tmp0" && mv "${dest_file}.tmp0" $dest_file
    fi

    (echo -e "$headers" && cat $dest_file ) > "${dest_file}.tmp" && mv "${dest_file}.tmp" $dest_file

    echo "${file_name}.sol successfully flattened, saved to ${dest_file}"
done

