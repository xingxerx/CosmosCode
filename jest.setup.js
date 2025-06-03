// This file runs before Jest loads any tests
// It ensures that Jest globals are properly set up

// Make sure Jest globals are available
global.jest = global.jest || require('@jest/globals').jest;
global.expect = global.expect || require('@jest/globals').expect;
global.test = global.test || require('@jest/globals').test;
global.describe = global.describe || require('@jest/globals').describe;
global.beforeAll = global.beforeAll || require('@jest/globals').beforeAll;
global.afterAll = global.afterAll || require('@jest/globals').afterAll;
global.beforeEach = global.beforeEach || require('@jest/globals').beforeEach;
global.afterEach = global.afterEach || require('@jest/globals').afterEach;
