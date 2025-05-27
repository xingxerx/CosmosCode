#!/bin/bash

# Setup complete development environment for CosmosCode

echo "Setting up CosmosCode development environment..."

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Create .env file for development
echo "Creating .env file..."
cat > .env << EOL
NODE_ENV=test
PORT=3000
DATABASE_URL=mongodb://localhost:27017/cosmoscode
EOL

# Set up Git hooks
echo "Setting up Git hooks..."
mkdir -p .git/hooks
cat > .git/hooks/pre-commit << EOL
#!/bin/bash
npm run lint
EOL
chmod +x .git/hooks/pre-commit

# Setup Python environment if needed
if command -v micromamba &> /dev/null; then
  echo "Setting up Python environment with micromamba..."
  ./setup-python-env.sh
else
  echo "Setting up Python environment with pip..."
  pip install -r requirements.txt
fi

echo "Development environment setup complete!"
echo "To start the application in test mode, run: npm start"