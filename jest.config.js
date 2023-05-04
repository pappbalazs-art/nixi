module.exports = {
	clearMocks: true,
	coverageDirectory: "coverage",
	moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
	moduleNameMapper: {
		"^@helpers(.*)$": "<rootDir>/src/helpers$1",
		"^@core(.*)$": "<rootDir>/src/core$1",
		"^@platform(.*)$": "<rootDir>/src/platform$1",
	},
	testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
};
