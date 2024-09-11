export default {
    testEnvironment: 'jsdom',  // Use jsdom for React components
    moduleNameMapper: {
      '\\.(css|less|sass|scss)$': 'identity-obj-proxy'  // Mock CSS imports
    },
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',  // Transform JavaScript files using babel-jest
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],  // Extend Jest matchers for DOM testing
  };
  