#!/bin/bash

# yarn add gatsby-cli  #update if need be
# export GATSBY_GRAPHQL_IDE=playground # Enable playground

./personal.sh # Load personal env vars
# ./example.sh  # Load example env vars
processid=`ps aux | grep "gatsby develop" | grep "node" | awk '{print $2}'`

[ "$processid" ] && kill -9 $processid || gatsby develop &