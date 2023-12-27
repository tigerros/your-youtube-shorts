"use strict";

import terser from "@rollup/plugin-terser";
const SRC_MIN = "src/firefox.min";
const JS_PATHS = [
    SRC_MIN + "/background.js",
    SRC_MIN + "/options.js",
    SRC_MIN + "/remove-shorts.js",
];

const configList = [];

for (const jsPath of JS_PATHS) {
    configList.push({
        input: jsPath,
        output: {
            file: jsPath,
            format: "es",
        },
        plugins: [terser(),],
    });
}

export default configList;