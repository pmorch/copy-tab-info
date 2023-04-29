// There was a problem with using
// ajv compile -s public/config-schema.yaml --spec=jtd  -o > src/generated-code/config-schema-validate.cjs
// It generated CommonJS code. vite (for vuejs) doesn't like that.
// So this will generate ESM code instead.
// And for JSON Schema (not jtd) there is a bug)

import Ajv from "ajv/dist/jtd.js";
import standaloneCode from "ajv/dist/standalone/index.js"
import { readFile, writeFile } from "fs/promises"
import { parse } from 'yaml'
import prettier from 'prettier'

const ajvOptions = {
    strict: true,
    allErrors: true,
    messages: true,
    code: {
        source: true,
        esm: true,
        lines: true
    },
};

const ajv = new Ajv(ajvOptions);

// console.error(process.argv)
const schemaFile = process.argv[2]

async function compileJsonSchema(schemaFile) {
    try {
        console.error('compiling', schemaFile)
        const schemaYAML = await (await readFile(schemaFile)).toString()
        // console.error(schemaFile, schemaYAML)
        const schema = parse(schemaYAML)

        // Compile schema via AJV
        const compiled = ajv.compile(schema);

        // Build output module file content via AJV's standalone
        const moduleCode = standaloneCode(ajv, compiled)

        // Write file to parent directory of source file
        const formatted = prettier.format(moduleCode, { parser: "babel" })
        console.log(formatted)
        // await writeFile("./schema.js", moduleCode, "utf-8");
    } catch (err) {
        console.error(err);
    }
}

compileJsonSchema(schemaFile);