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
