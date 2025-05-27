#!/bin/bash

# Clear any existing proxy settings
npm config delete proxy
npm config delete https-proxy
npm config delete registry

# Set npm to use the public registry directly
npm config set registry https://registry.npmjs.org/

echo "NPM proxy settings cleared and registry set to public npm registry"