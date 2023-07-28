<p align="center" style="">
  <a href="https://github.com/IamRaduB/eeko" style="">
    <img src="https://github.com/IamRaduB/eeko/raw/master/docs/images/eeko-logo.png" width="64" alt="Eeko logo" style="display: inline-block;" />
  </a>
</p>

<h3 align="center">Say "Hello" to Eeko! An easy-to-use suite of CLI tools designed to help developers maintain clean i18n (JSON) files in their UI applications.</h3>

<p align="center">
  <a href="https://www.npmjs.org/package/@hovrcat/eeko">
    <img src="https://img.shields.io/npm/v/@hovrcat/eeko/latest.svg" alt="NPM Version" />
  </a>
</p>

## Problem
Translation files can very easily get disorganized:
- unordered keys
- orphan keys
- out of sync locale files

### Solution
The starting point of the project, whether you are starting fresh, or have an existing project is a `template` file.
This will be the source of truth for the structure of your language files.

When the UI launches, it will scan for the `template` file and, if it does not exist, it will prompt you to create one.
All 

## Installation
```shell
$ npm i -g @hovrcat/eeko
```
Once installed, the `eeko` CLI utility is available to be run in any Frontend project directory.

## Usage
### Initialize and configure
Run the interactive configuration utility in the FE project of your choice, to get Eeko set up 
```shell
$ cd path-to-project
$ eeko init
```
This will create a `.eekorc.json` file with the configuration options defined above.

### Run the Eeko i18n manager UI
```shell
$ eeko ui
```
This will launch the Eeko i18n manager UI in the default browser.

### CLI

| Command | Description                                                                                 | Status |
|---------|---------------------------------------------------------------------------------------------|--------|
| init    | Initialize the Eeko manager                                                                 | ✅      |
| ui      | Spin up the Eeko manager server                                                             | ✅      |
| scan    | Crawls the frontend application repository and identifies possibly invalid translation keys | ❌      |

### UI
While some actions can be performed via the CLI tool, Eeko comes with a user interface to facilitate the management of your translation files.

#### Features
##### Template
The template is responsible with keeping the single source of truth for the locale files JSON structure.
Actions:
- Add, remove, rename keys
- Toggle conversion of keys from simple to nested
- Import template structure from existing locale file
- Search through the tree to locate specific keys

##### Language file(s)
Language files are generated based on the `template` structure.
Actions:
- Edit values for keys in the locale
- Search through the tree to locate specific keys and values

--------------------
### Roadmap
1. Improve onboarding into new projects
   - Using the tool in an existing project (with possibly out of sync locale files) needs looking into
     - The UI needs to inform the user after importing the template from a locale file, that other locales are out of sync.
2. Destructive actions (Deleting/Converting keys from the template) should propagate across all locale files
3. Scanning feature

--------------------
### Project structure
#### Tech stack

- [NX](https://nx.dev/getting-started/intro) package based repo
- [Vue 3](https://vuejs.org/)
- NodeJS
  - [CommanderJS](https://www.npmjs.com/package/commander)
  - [FastifyJS](https://fastify.dev/)
- Typescript

### Development
For development, the **UI** and **CORE** packages need to be run independently of each other.
For this, they need to be executed in DEV mode.

#### UI
Create a `.env` file in the **UI** package, with the following contents
```dotenv
VITE_CORE_DEVMODE=true
```
This will allow the Vue app to run as standalone and send requests to `http://localhost:2016`.

```shell
$ nx run ui:serve:development
```

#### CORE
```shell
$ cd packages/core
# start the init command
$ npm run start:init
# start the UI server
$ npm run start:ui
```

