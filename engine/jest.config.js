module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
      },
    },
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    fakeTimers: {
      enableGlobally: true,
    },
  };
  