module.exports = {
  "roots": [
    "<rootDir>/tests",
    "<rootDir>/src",
  ],
  "testMatch": [
    "**/tests/**/*def*.(spec|test).(ts|tsx|js)",
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
}
