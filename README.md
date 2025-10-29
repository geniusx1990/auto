# 🧪 Practice Task 1. Unit testing.

## Instructions

1. Create a new branch in your empty repository and name it, for example, `/unit_tests`.
2. Copy the provided code to your repository.
3. Cover the code with unit tests using **Mocha** and **Chai**.
4. Configure reporter.
5. Add code coverage analysis using **c8**.
6. Ensure **80% (or more)** code coverage with tests.
7. Add the following scripts to `package.json`:
    - `test` — to run tests and generate an HTML report.
    - `coverage` — to analyze code coverage.
8. Set up a linter (**ESLint**), configure **Babel**, set up **pre-commit hooks**, work with the **GitLab CI/CD pipeline**, and identify and fix errors in the code.
    - **8.1.** Setup ESLint (using `eslint init`) with a style guide. → `eslint.config.js`
    - **8.2.** Setup Babel. → `babel.config.js`
    - **8.3.** Set up GitLab pipeline. → `.gitlab-ci.yml`
    - **8.4.** Setup Husky. Add pre-commit hooks to the `package.json`.

---

## Config files and directory structure

---

Config files and directory structure:

├── .github
│   └── workflows
│       └── eslint.yml
├── babel.config.js
├── eslint.config.js
└── package.json

---

Files eslint.config.js, babel.config.js, .gitlab-ci.yml download here
Attach link to the branch repository with your Practice task. Do not forgot grant appropriate access rights to your lecturer

---

## Acceptance Criteria

1. **Code Coverage:**  
   All functions from the provided files must be more than **80% covered** by unit tests.  
   This includes:
    - Checking for correct values.
    - Checking for edge cases.
    - Checking for errors (e.g. calling with incorrect arguments).

2. **Scripts in `package.json`:**
    - `test` — runs tests using Mocha (or another framework) and generates an HTML report.
    - `coverage` — runs code coverage analysis using c8.
    - `eslint` — runs linter to check code in JS files.

3. The project is correctly initialized.
4. **Babel** is configured and works.
5. **ESLint** is configured and detects errors.
6. **Pre-commit hook** prevents commits with errors.
7. **Github pipeline** successfully performs linting while merging the `unit_tests` branch into `master` (or `main`) branch.