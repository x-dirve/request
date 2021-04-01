const { join } = require("path");
const alias = require("rollup-plugin-alias");
const buble = require("rollup-plugin-buble");
const babel = require("rollup-plugin-babel");
const cjs = require("rollup-plugin-commonjs");
const { terser } = require("rollup-plugin-terser");
const resolve = require("rollup-plugin-node-resolve");
const typescript = require("rollup-plugin-typescript2");

const isProduction = process.env.NODE_ENV === "production";
const cwd = __dirname;

const baseConfig = {
    "input": join(cwd, "src/index.ts"),
    "output": [
        {
            "file": join(cwd, "dist/index.js")
            ,"format": "cjs"
            ,"sourcemap": true
            ,"exports": "named"
        }
    ],
    "plugins": [
        resolve({
            "preferBuiltins": false
        })
        ,cjs()
        ,babel({
            "babelrc": false
            ,"presets": [
                ["@babel/preset-env", {
                    "modules": false
                }]
            ]
            ,"plugins": [
                [
                    "import"
                    , {
                        "libraryName": "@x-drive/utils"
                        , "libraryDirectory": "dist/libs"
                        , "camel2DashComponentName": false
                    }
                    , "@x-drive/utils"
                ]
            ]
            , "include": "node_modules/@x-drive"
        })
        ,typescript({
            "tsconfigOverride": {
                "compilerOptions": {
                    "preserveConstEnums": true
                }
            }
        })
        ,buble()
    ]
}

const umdConfig = {
    "input": baseConfig.input
    , "output": [
        {
            "file": join(cwd, "dist/index.umd.js")
            , "format": "umd"
            , "sourcemap": false
            , "exports": "named"
            , "name": "xRequest"
        }
    ]
    , "plugins": [
        ...baseConfig.plugins
        , isProduction && terser()
    ]
}


const esmConfig = Object.assign({}, baseConfig, {
    output: Object.assign({}, baseConfig.output, {
        "sourcemap": true
        ,"format": "es"
        ,"file": join(cwd, "dist/index.esm.js")
    })
    ,"plugins": [
        babel({
            "babelrc": false,
            "presets": [
                ['@babel/preset-env', {
                    "modules": false
                }]
            ],
            "plugins": [
                [
                    "import"
                    , {
                        "libraryName": "@x-drive/utils"
                        , "libraryDirectory": "dist/libs"
                        , "camel2DashComponentName": false
                    }
                    , "@x-drive/utils"
                ]
            ]
            , "include": "node_modules/@x-drive"

        })
        ,alias({
            "entries": [
                {
                    "find": "@x-drive/utils"
                    , "replacement": join(cwd, "node_modules/@x-drive/utils/dist/index.esm")
                }
            ]
        })
        ,typescript()
    ]
})

function rollup() {
    const target = process.env.TARGET

    if (target === "umd") {
        return baseConfig
    } else if (target === "esm") {
        return esmConfig
    } else {
        return [baseConfig, umdConfig, esmConfig]
    }
}
module.exports = rollup()
