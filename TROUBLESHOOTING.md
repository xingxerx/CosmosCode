# Troubleshooting Guide

## Common Issues

### Python Integration Issues

If you encounter errors related to Python execution:

1. **Use Test Mode**: Set `NODE_ENV=test` to use mock data instead of Python integration:
   ```bash
   export NODE_ENV=test
   npm start
   ```

2. **Check Python Environment**: Ensure your Python environment is properly set up:
   ```bash
   ./setup-python-env.sh
   ```

3. **Verify Python Dependencies**: Make sure all required packages are installed:
   ```bash
   pip install -r requirements.txt
   ```

### CI/CD Pipeline Failures

If the CI/CD pipeline is failing:

1. **Check GitHub Actions Logs**: Review the detailed logs in GitHub Actions.

2. **Ensure Test Mode**: Make sure all test steps have `NODE_ENV=test` set.

3. **Verify Docker Configuration**: Check that the Dockerfile correctly sets up both Node.js and Python environments.

### Local Development Issues

1. **Environment Variables**: Use a `.env` file or set environment variables:
   ```bash
   echo 'NODE_ENV=test' > .env
   ```

2. **Node.js Version**: Ensure you're using Node.js 18 or later:
   ```bash
   node --version
   ```

3. **Package Installation**: Make sure all dependencies are installed:
   ```bash
   npm ci
   ```