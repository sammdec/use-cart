import babel from "rollup-plugin-babel"
import sourceMaps from "rollup-plugin-sourcemaps"
import { terser } from "rollup-plugin-terser"
import { sizeSnapshot } from "rollup-plugin-size-snapshot"
import pkg from "./package.json"

export default [
  {
    input: "src/use-cart.js",
    external: ["react"],
    plugins: [
      babel({
        exclude: ["node_modules/**"]
      }),
      sourceMaps(),
      sizeSnapshot(),
      terser({
        sourcemap: true,
        output: { comments: false },
        compress: {
          keep_infinity: true,
          pure_getters: true
        },
        warnings: true,
        ecma: 5,
        toplevel: true
      })
    ],
    output: [
      { file: pkg.main, format: "cjs", sourcemap: true },
      { file: pkg.module, format: "es", sourcemap: true }
    ]
  }
]
