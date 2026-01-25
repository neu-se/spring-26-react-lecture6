# CS4530 Template Project

This is a template project for CS4530, Software Engineering at Northeastern.
It is part of a tree of template projects:

```
Base configuration:
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

## Express Configuration

The functional content of this project is a minimal Express transcript API for
a very simple transcript server.

### Express API

The Express server's API has the following endpoints:

| Endpoint             | Method | Description                         |
| -------------------- | ------ | ----------------------------------- |
| `/api/addStudent`    | POST   | Add a new student                   |
| `/api/addGrade`      | POST   | Add a grade for an existing student |
| `/api/getTranscript` | POST   | Look up information for a student   |

## Base configuration

The base project configuration follows a philosophy of "minimalism, mostly."
Project configuration should be minimal and have a bias towards implicit
defaults. Deviations from this principle should be justified and documented
(here or elsewhere).

Notable exceptions to this principle:

- `.gitignore` takes a kitchen-sink approach and should freely accept
  additions. (For example, if a student accidentally checks in a file that
  could have been ignored, it makes sense to add that file here.)
- The ESLint configuration is a maximalist attempt at keeping new TypeScript
  programmers on the rails in a complicated codebase, and also giving them a
  sense of working inside style conventions of a project that may differ from
  their own.

  (Rob has told students we banned `i++` with `noPlusPlus` just to give them
  the experience of being annoyed by the style guide of a company they're
  working for. He was only sort of kidding.)

- If we can have all project variants using the _exact_ same `tsconfig.json`
  file or `eslint.config.mjs` file by adding a bit of cruft to the base
  configuration, that's a reasonable trade. Things are going to inevitably get
  copy-pasted, and so the fewer copies of configuration files there are, the
  better.

  This is why the `.vscode/settings.json` applies Prettier to html and css
  files even though that's not relevant to the base project, and why
  `eslint.config.mjs` includes React's Rules of Hooks despite most of the
  project variants not including any React code.

### NPM Scripts

This sets up a set of commands that CS4530 templates should consistently
support:

- `npm run check` runs TypeScript
- `npm run lint` runs ESLint, and `npm run lint:fix` runs eslint with the
  `--fix` option
- `npm run prettier` checks formatting, and `npm run prettier:fix` writes
  formatted files back to disk
- `npm run test` runs Vitest tests and reports coverage
- `npm run dev` starts a development server or watch process
- `npm run build` prepares the project for production-style deployment
- `npm start` runs the project in production style

These are tested by github actions in `.github/workflows/main.yml`.

### ESLint

This base project has an opinionated ESLint configuration that relies on
[typed linting](https://typescript-eslint.io/getting-started/typed-linting).
The ESLint configuration makes some assumptions about project structure:

- Frontend code is code that lives in `./frontend` or `./client`, and uses
  React and JSX. (This code is subject to different linter rules.)
- Test code lives in a `**/tests` directory OR has a `*.spec.ts(x)` or a
  `*.test.ts(x)` filename. Tests can use devDependencies, unlike other code.
- Config files all have `*.config.mjs` filenames (vite, vitest, playwright,
  and eslint all follow this convention) and can import devDependencies,
  unlike other code. (Note that this means we're not using TypeScript to check
  our config files.)
- Most everything should be registered as `error`. Warnings don't fail CI
  checks. Exceptions should have a documented reason. Notable exceptions:
  - `no-console` is `warn` because no-console regularly gets turned off by
    line or file specific rules: we want to discourage excessive `no-console`
    use but it is more like the admonition to not check in commented-out code:
    it's mostly a problem when done excessively and it's easy to check in
    visual inspection
  - `prettier` is `warn` because red squigglies for `prettier` are especially
    distracting and we can check for prettier failures in CI separately
  - `import/extensions` is `warn` because the rule was added entirely a matter
    of consistency, not correctness. Extensions are required in non-frontend
    projects because of the type-stripping setup; adding them to Vite-managed
    frontend code keeps the codebase more consistent.

### TypeScript

TypeScript is configured with options that support
[type stripping](https://nodejs.org/api/typescript.html#type-stripping).
Beyond this, on top of regular strict settings, the TypeScript configuration
enables:

- `forceConsistentCasingInFileNames`, to avoid osx/linux compatibility
  heartbreak
- `noFallthroughCasesInSwitch` and `noImplicitReturns`, which are linter-like
  properties that don't seem to be supported by typed linting in ESLint
- `noUncheckedSideEffectImports`, which avoids an unexpected behavior

### Prettier

The `.prettierrc` file is intended to use some reasonable defaults. A
`.vscode/settings.json` file is added to encourage Visual Studio Code to treat
Prettier as the default formatter for javascript, typescript, json, css, and
html files even if a students' global configuration uses other defaults.

### LF Line Endings

The `.prettierrc`, `.gitattributes`, and `.vscode/settings.json` files
conspire to generally force projects to use `\n` file endings instead of
Windows-style `\r\n` line endings (LF instead of CRLF).
