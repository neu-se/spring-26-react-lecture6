# Base project

This is a base project for CS4530, Software Engineering at Northeastern.

This repository is part of a tree of template-like projects:

```
https://github.com/neu-se/spring-26-base
|
|
v add an Express server and API tests
https://github.com/neu-se/spring-26-express
|
|
v add a Vite frontend for a simple client/server setup
https://github.com/neu-se/spring-26-vite
|
|
v add React to the frontend, remove the backend
https://github.com/neu-se/spring-26-react
```

The functional content of this project is a minimal Express transcript API,
for a very simple transcript server, and tests using Supertest.

The API has the following endpoints:

| Endpoint             | Method | Description                         |
| -------------------- | ------ | ----------------------------------- |
| `/api/addStudent`    | POST   | Add a new student                   |
| `/api/addGrade`      | POST   | Add a grade for an existing student |
| `/api/getTranscript` | POST   | Look up information for a student   |

## Base configuration

### NPM Scripts

This sets up a set of commands that CS4530 projects should consistently
support:

- `npm run check` runs TypeScript
- `npm run lint` runs ESLint, and `npm run lint:fix` runs eslint with the
  `--fix` option
- `npm run prettier` checks formatting, and `npm run prettier:fix` writes
  formatted files back
- `npm run test` runs Vitest tests and reports coverage
- `npm run dev` starts a development server or watch process
- `npm run build` prepares the project for production-style deployment
- `npm start` runs the project in production style

### ESLint

This base project has an opinionated ESLint configuration that relies on
[typed linting](https://typescript-eslint.io/getting-started/typed-linting).

- Frontend code is code that lives in `./frontend` or `./client`. This code
  supports a few different naming conventions, as suitable for React.
- Test code lives in a `**/tests` directory OR has a `*.spec.ts(x)` or a
  `*.test.ts(x)` filename. Tests can use devDependencies, unlike other code.
- Config files all have `*.config.mjs` filenames (vite, vitest, playwright,
  and eslint all follow this convention) and can import devDependencies,
  unlike other code. (Note that this means we're not using TypeScript to check
  our config files.)
- Most everything except for `no-console` and `prettier` should registered as
  `error`; it's distracting in practice to have these be red squigglies

### TypeScript

TypeScript in the project is configured with options that support
[type stripping](https://nodejs.org/api/typescript.html#type-stripping).
Beyond this, on top of regular strict settings, the TypeScript configuration
enables:

- `forceConsistentCasingInFileNames`, to avoid osx/linux compatibility
  heartbreak
- `noFallthroughCasesInSwitch` and `noImplicitReturns`, which are linter-like
  properties that don't seem to be supported by typed linting in ESLint
- `noUncheckedSideEffectImports`, which avoids an unexpected behavior

### Prettier

Includes a `.prettierrc` file with some reasonable settings and a
`.vscode/settings.json` file that sets javascript, typescript, and json files
to use the prettier editor as the default.

### LF Line Endings

The `.prettierrc`, `.gitattributes`, and `.vscode/settings.json` files
conspire to generally force projects to use `\n` file endings instead of
Windows-style `\r\n` line endings (LF instead of CRLF).
