
import builder from "@daybrush/builder";

export default builder([
    {
        input: "src/index.ts",
        output: "./dist/compat.esm.js",
        exports: "named",
        format: "es",
    },
    {
        input: "src/index.ts",
        output: "./dist/compat.cjs.js",
        exports: "named",
        format: "cjs",
    },
]);
