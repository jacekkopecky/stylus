# Build this project

## Preparation

1. Install [Node.js](https://nodejs.org/en/).
2. Install PNPM e.g. run `npm install -g pnpm` or use another method for your OS, see https://pnpm.io/installation
3. Go to the project root, run `pnpm i`. This will install all required dependencies.

## Build

| type                  | command                 |
| --------------------- | ----------------------- |
| MV2 for any browser   | `pnpm build-mv2`        |
| MV2 Firefox optimized | `pnpm build-firefox`    |
| MV3 Chrome/Chromiums  | `pnpm build-chrome-mv3` |

⚠ `dist` folder is not cleared.

## Watch / develop

| type | command          |
| ---- | ---------------- |
| MV2  | `pnpm watch-mv2` |
| MV3  | `pnpm watch-mv3` |

⚠ `dist` folder is not cleared.

## Create ZIP files for an extension gallery

The files are created in the project root directory.

| type            | command                    |
| --------------- | -------------------------- |
| All             | `pnpm zip`                 |
| MV2 Firefox     | `pnpm zip-firefox`         |
| MV2 Chrome      | `pnpm zip-chrome-mv2`      |
| MV3 Chrome      | `pnpm zip-chrome-mv3`      |
| MV3 Chrome beta | `pnpm zip-chrome-mv3-beta` |

## Tag a release/Bump the version

| type     | command            |
| -------- | ------------------ |
| Beta/Dev | `pnpm bump`        |
| Stable   | `pnpm bump-stable` |

There are some scripts that will run automatically before/after tagging a version. Includes:

1. Test.
2. Update version number in `manifest.json`.
3. Generate the ZIP file.
4. Push the tag to github.
