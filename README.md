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

When appropriate, projects should also have the following scripts:

- `npm run dev` starts a development server or watch process
- `npm run build` prepares the project for production-style deployment
- `npm start` runs the project in production style

### ESLint

This base project has an opinionated eslint configuration that heavily relies
on typescript-eslint.

- Frontend code is code that lives in `./frontend` or `./client`. This code
  supports a few different naming conventions, as suitable for React.
- Test code lives in a `**/tests` directory OR has a `*.spec.ts(x)` or a
  `*.test.ts(x)` filename. Tests can use devDependencies, unlike other code.
- Config files all have `*.config.mjs` filenames (vite, vitest, playwright,
  and eslint all follow this convention) and can import devDependencies,
  unlike other code. (Note that this means we're not using TypeScript to check
  our config files.)
- Everything except for `no-console` and `prettier` is registered as `error`.

### Prettier

Includes a `.prettierrc` file with some reasonable settings and a
`.vscode/settings.json` file that sets javascript, typescript, and json files
to use the prettier editor as the default.

### LF Line Endings

The `.prettierrc`, `.gitattributes`, and `.vscode/settings.json` files
conspire to generally force projects to use `\n` file endings instead of
Windows-style `\r\n` line endings (LF instead of CRLF).
