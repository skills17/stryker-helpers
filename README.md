# skills17/stryker-helpers

This package provides Stryker helpers for usage in a skills competition environment. It includes:

- Custom output formatter

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

**Requirements:**

- Node `18` or greater

To install this package, run the following command:

```bash
npm install @skills17/stryker-helpers
```

It is suggested to add the following npm scripts:

```json
"scripts": {
"test": "skills17-stryker run",
"test:json": "skills17-stryker run --json"
},
```

This will provide the following commands:

- `npm test` - Run all tests once and show a nice output with the awarded points (useful for the competitors to see
  their points)
- `npm run test:json` - Run all tests once and get a json output (useful for automated marking scripts)

Points can be awarded for coverage of conditionals and deductions for number of mutants survived. If any test fails in
normal execution, no points will be awarded.

## Usage

A `config.yaml` file needs to be created that contains some information about the task. It should be placed in the root
folder of your task, next to the `package.json` file.

See the [`@skills17/task-config`](https://github.com/skills17/task-config#configuration) package for a detailed
description of all available properties in the `config.yaml` file.

### CLI

As seen in the installation instructions, the `skills17-stryker` command is available.

It is a thin wrapper around the `stryker run` command.

All arguments to the command will be forwarded to `stryker` so Stryker can be used exactly the same way if this package
wouldn't be installed.

Additionally, the following new arguments are available:

- `--json` output the test result with scored points in json to standard out

### Scoring

The generated test names are in the following format:

```
[file key]-[mutant name]
```

The file key is the file name being tested with the extension and `src/` removed. Path separators are replace with `.`.
If multiple mutants with the same name are generated, any surviving mutant will make the test fail.

### Extra tests

With `skills17/stryker-helpers` there are no extra tests needed.

## License

[MIT](https://github.com/skills17/stryker-helpers/blob/master/LICENSE)
