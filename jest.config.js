module.exports = {
  maxWorkers: 1,
  testEnvironment: 'node',
  testRegex: '.+\\/tests\\/integration\\/.*\\.test.ts$',
  testPathIgnorePatterns: ['/node_modules/', '/\\.stryker-tmp/'],
};
