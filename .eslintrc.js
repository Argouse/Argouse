module.exports = {
	root: true,
	env: {
		node: false,
		browser: true,
		es6: true,
	},
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: '@babel/eslint-parser',
    requireConfigFile:false,
  },
};