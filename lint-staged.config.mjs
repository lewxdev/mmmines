const lintStagedConfig = {
  "*": "prettier --cache --ignore-unknown --write",
  "*.{js,jsx,ts,tsx}": "eslint --fix",
};

export default lintStagedConfig;
