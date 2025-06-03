# CosmosCode Testing Guide

This document provides instructions on how to run and maintain the test suite for the CosmosCode project.

## Running Tests

### Basic Test Run

To run all unit and integration tests:

```bash
./run-tests.sh
```

This will skip E2E tests by default, as they require additional dependencies.

### Comprehensive Test Run

To run all tests including E2E tests:

```bash
./run-all-tests.sh --with-e2e
```

### JIT-Optimized Test Run

For faster test execution using V8's JIT compiler:

```bash
./run-tests-jit.sh
```

### Test Summary

For a nicely formatted summary of test results:

```bash
./test-summary.sh
```

### Detailed Test Report

For a comprehensive test report:

```bash
./test-report.sh
```

### Benchmark Test Performance

To compare standard and JIT-optimized test performance:

```bash
./benchmark-tests.sh
```

### Running E2E Tests

To run only E2E tests:

```bash
./run-e2e-tests.sh
```

### Running Specific Test Types

The `run-all-tests.sh` script supports various options:

```bash
# Run only unit tests
./run-all-tests.sh --unit-only

# Run only integration tests
./run-all-tests.sh --integration-only

# Run only E2E tests
./run-all-tests.sh --e2e-only

# Run only network tests
./run-all-tests.sh --with-network --network-only

# Run with verbose output
./run-all-tests.sh --verbose
```

## Test Structure

The project uses Jest for testing and follows these conventions:

1. **Unit Tests**: Located alongside the source files with `.test.js` or `.spec.js` extensions
2. **Integration Tests**: Located in `src/__tests__/integration/`
3. **E2E Tests**: Located in `e2e/`

## Mocking

The tests use Jest's mocking capabilities to isolate components:

```javascript
// Example of mocking a module
jest.mock('../path/to/module', () => ({
  functionName: jest.fn(() => Promise.resolve('mocked result'))
}));
```

## Performance Optimization

### Test Execution

The test runners are optimized for performance:

- `run-tests.sh`: Standard test runner
- `run-tests-jit.sh`: Optimized test runner with garbage collection and memory management
- `run-e2e-tests.sh`: Specialized runner for E2E tests

Our benchmarks show that the JIT-optimized test runner is approximately 42% faster than the standard test runner, which can significantly reduce CI/CD pipeline execution time.

### Node.js Optimization

The optimized test runner uses Node.js flags to improve performance:

- `--expose-gc`: Exposes garbage collection for better memory management
- `--max-old-space-size=4096`: Increases memory limit to 4GB for larger test suites

### Jest Configuration

The Jest configuration is optimized for performance:

- `--runInBand`: Runs tests serially in the current process
- `--detectOpenHandles`: Identifies asynchronous operations that might keep the process alive
- Caching test results for faster reruns
- Using a percentage of available CPU cores
- Setting appropriate timeouts for different test types

## Troubleshooting

### Common Issues

1. **E2E Test Failures**: Make sure you have all required dependencies installed:
   ```bash
   sudo apt-get install libnss3-dev
   ```

2. **Test Timeouts**: For long-running tests, you may need to increase the timeout:
   ```javascript
   jest.setTimeout(30000); // 30 seconds
   ```

3. **Hanging Tests**: If tests don't exit properly, run with:
   ```bash
   ./run-tests.sh --detectOpenHandles
   ```

4. **Validation Warnings**: If you see Jest configuration validation warnings, check the configuration files for invalid options.

### Cleaning Up Test Files

If you encounter issues with conflicting test files:

```bash
./cleanup-tests.sh
```

## Adding New Tests

When adding new tests:

1. Follow the naming convention: `*.test.js` or `*.spec.js`
2. Use the appropriate location based on test type (unit, integration, E2E)
3. Make sure to mock external dependencies
4. Keep tests focused and fast

## Test Coverage

To generate a test coverage report:

```bash
npx jest --coverage
```

The report will be available in the `coverage/` directory.
