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

## Vite+Express configuration

The functional content of this project has two parts:

1.  A minimal Express transcript API for a very simple transcript server
2.  A Vite frontend with code that calls that server

The way this project runs in "production mode" versus "development mode" is
very different.

### Production Mode

Production mode is simpler: there's one server running, the Express server, on
port 8000. When when a GET request doesn't match any API endpoints, the
Express server looks in `./frontend/dist` to see if there's a file it can
server there. Files are put in that directory when `npm run build` calls the
`vite build` command. This build process is necessary because we're writing
our frontend code in TypeScript, but browsers can't do type stripping like
Node can — we have to do some transformation on the code we're writing to make
it browser-friendly. (Vite is doing a bunch of other transformations for other
reasons.)

### Development Mode

Development mode is a little trickier, because we want our browser to be
connecting to Vite's "development web server", not Express, because Vite does
a lot of nifty stuff to make sure that when we change our TypeScript code, it
**reloads the web page**. That is very very handy for frontend web
development.

However, this means your "frontend code" — the HTML and JS that the browser is
supposed to run, needs to run separately from your "backend code" — the TS
Express server that Node is supposed to run. If you have these two things on
different ports, you're going to run into annoying problems with something
called CORS. In production mode, your entire website is coming from one
server, and you really want your website look like it's _all_ coming from a
single server during development too.

To handle this, in development mode the server will _only_ respond to API
requests, and the Vite development server forwards all API requests to the
Express server. This is called "proxying".

### Express API

The Express server's API has the following endpoints:

| Endpoint             | Method | Description                         |
| -------------------- | ------ | ----------------------------------- |
| `/api/addStudent`    | POST   | Add a new student                   |
| `/api/addGrade`      | POST   | Add a grade for an existing student |
| `/api/getTranscript` | POST   | Look up information for a student   |

## Base configuration

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

### Minimalism, Mostly

Project configuration should be minimal, and deviations from this principle
should be justified and ideally documented. Notable exceptions are:

- `.gitignore`, which takes a kitchen-sink approach and should freely accept
  additions (for example, if a student accidentally checks in a file that
  could have been ignored)
- The ESLint configuration, which is a maximalist approach at trying to keep
  new TypeScript programmers on the rails in a complicated codebase, and also
  giving them a sense of working inside style conventions of a project that
  may differ from their own. (Rob has told students we banned `i++` with the
  `noPlusPlus` just to give them the experience of being annoyed by the style
  guide of a company they're working for. He may or may not have been
  kidding.)

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
`.vscode/settings.json` file sets javascript, typescript, and json files to
use the prettier editor as the default.

NOTE 2026-01: In the future, this file could be made more minimal and
default-tuned in keeping with the minimalist principles: there's not an
obvious need to use non-default options for `jsxSingleQuote`, `quoteProps`,
`singleQuote`, `arrowParens`, and `bracketSameLine`.

### LF Line Endings

The `.prettierrc`, `.gitattributes`, and `.vscode/settings.json` files
conspire to generally force projects to use `\n` file endings instead of
Windows-style `\r\n` line endings (LF instead of CRLF).
