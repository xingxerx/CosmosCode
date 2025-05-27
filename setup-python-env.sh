#!/bin/bash

# Create a new Python environment for CosmosCode
micromamba create -n cosmoscode python=3.10 -y

# Activate the environment
eval "$(micromamba shell hook -s bash)"
micromamba activate cosmoscode

# Install Python dependencies
pip install -r requirements.txt

echo "Python environment 'cosmoscode' created and activated"