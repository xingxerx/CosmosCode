# CosmosCode Testing Guide

This document provides instructions on how to run and maintain the test suite for the CosmosCode project.

## Running Tests

### Basic Test Run

To run all unit and integration tests:

```bash
./run-tests.sh
```

This will skip E2E tests by default, as they require additional dependencies.

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

### Benchmark Test Performance

To compare standard and JIT-optimized test performance:

```bash
./benchmark-tests.sh
```

### Running E2E Tests

To run E2E tests (requires additional dependencies):

```bash
./run-tests.sh --with-e2e
```

Or to run only E2E tests:

```bash
./run-e2e-tests.sh
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

### JIT Compilation

The JIT-optimized test runner uses V8 optimization flags to improve performance:

- `--jitless=false`: Ensures JIT compilation is enabled
- `--opt`: Enables optimizations
- `--turbo-inlining`: Enables function inlining for better performance
- `--turbo-instruction-scheduling`: Optimizes instruction scheduling

### Jest Configuration

The Jest configuration is optimized for performance:

- Caching test results for faster reruns
- Using a percentage of available CPU cores
- Optimizing for CI environments

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
