import path from "node:path";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  "*": "prettier --cache --ignore-unknown --write",
  "*.{js,jsx,ts,tsx}": (filenames) =>
    `next lint --fix ${filenames
      .map((filename) => `--file ${path.relative(process.cwd(), filename)}`)
      .join(" ")}`,
};
