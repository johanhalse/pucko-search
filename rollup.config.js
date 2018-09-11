import buble from "rollup-plugin-buble";

// rollup.config.js
export default {
  input: "pucko-search.js",
  output: {
    file: "lib/pucko-search.js",
    format: "cjs"
  },
  plugins: [buble()]
};
