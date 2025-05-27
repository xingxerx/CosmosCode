#!/bin/bash

# Activate Python environment
eval "$(micromamba shell hook -s bash)"
micromamba activate cosmoscode

# Run the application
node src/index.js