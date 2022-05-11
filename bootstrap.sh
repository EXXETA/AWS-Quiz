#!/bin/bash

pushd lambda
    echo -n "Build Lambda... "
    npm i --silent
    npm run build
    echo "✅"
popd