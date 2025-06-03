# CosmosCode
Cosmology and Medicine Codebase

## Overview
CosmosCode is a project that combines cosmology simulations with medical applications.

## Installation

### Node.js Dependencies
```bash
npm install
```

### Python Dependencies
We use micromamba to manage Python environments:

```bash
# Install micromamba if you don't have it
# See: https://mamba.readthedocs.io/en/latest/installation.html

# Setup Python environment
./setup-python-env.sh
```

Or set up both environments at once:
```bash
./setup-dev-env.sh
```

## Usage

### Node.js Only
```bash
node index.js
```

### With Python Integration
```bash
./run-with-python.sh
```

## Testing

### Running Tests in Test Mode
For development and CI/CD, we use a test environment that mocks Python dependencies:

```bash
# Set environment variable
export NODE_ENV=test

# Run tests
npm test
```

### JIT-Optimized Tests
For faster test execution (42% improvement), use the JIT-optimized test runner:

```bash
./run-tests-jit.sh
```

### Node.js Tests
```bash
npm test
```

### Python Tests
```bash
./run-python-tests.sh
```

## CI/CD Pipeline

Our GitHub Actions workflow automatically:
1. Runs tests in test mode
2. Builds and tests Docker images
3. Deploys to staging/production environments

See `.github/workflows/ci.yml` for details.

## Features
- Cosmology simulations
- Medical data analysis
- Python integration for advanced calculations
- ...

## Contributing
Contributions welcome! Please read our contributing guidelines.
