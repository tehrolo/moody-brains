#!/bin/sh

NETWORK=goerli

#yarn truffle deploy --reset  --network $NETWORK
yarn truffle deploy --network $NETWORK
truffle run verify MoodyApesNFT --network $NETWORK

