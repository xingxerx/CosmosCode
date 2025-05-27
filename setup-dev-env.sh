#!/bin/bash

# Setup both Node.js and Python environments

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Create Python environment
echo "Setting up Python environment..."
micromamba create -n cosmoscode python=3.10 -y

# Activate the environment
eval "$(micromamba shell hook -s bash)"
micromamba activate cosmoscode

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Development environment setup complete!"
echo "To activate the Python environment, run:"
echo "  micromamba activate cosmoscode"