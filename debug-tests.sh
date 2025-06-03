#!/bin/bash

# Run tests with Node.js debugger
node --inspect-brk node_modules/.bin/jest --runInBand "$@"