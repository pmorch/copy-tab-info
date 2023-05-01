# Copy Tab Info

## Prerequisites

You'll need `python3` and `make` to build this software.

## Code and Icon generation

We generate icons and schema validator.

The icons so we don't have to commit any font-awesome icons but use them form npm, and the schema validator because ajv
otherwise tries to compile the schema validator which is not allowed under unsafe-eval in a chrome extension.

That is what the `generate` script is for in `package.json`'s `scripts` section. `run-s` runs multiple npm scripts one after the other.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Dependency Generation

The `./generate` folder generates some dependencies:

### Icons

The extension icons are generated from font awesome

### Schema Validator

When running inside an extension, we cannot use `eval` or `new Function()`
because of the CORS `unsafe-eval` security limitation while running as an
extension.

And `ajv` uses `new Function()` when compiling a schema validator, so that
cannot be done at runtime and so is done here.

### Pre-bundling the Monaco Editor

We're using the [Monaco editor](https://microsoft.github.io/monaco-editor/) for
YAML editing. It _is_ rather huge. Which normally under `vite` dev builds is not
so bad, only that during extension development, we cannot use `vite dev` but
have to use `vite build`, and monaco raises the build time from around 0.6s to
annoying 5.6s. So in `./generate/monaco` we run a separate vite build of monaco,
setting it up with global variables in `window` so the main build becomes much
faster.

I've used [this
example](https://github.com/microsoft/monaco-editor/tree/main/samples/browser-esm-webpack-small),
where I've used the imports from `./index.js`. Keep in mind that this repo uses
a slightly older version of `monaco-editor`, but to update the imports to fit
whatever version we're using e.g. `0.37.1`:

```sh
cd monaco-editor/samples
npm install monaco-editor@0.37.1
cd browser-esm-webpack-small
npm run generate-imports
```

That will update the example's `./index.js` with the imports appropriate for that version.
