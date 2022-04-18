<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Template Repository Usage GitHub Action

A GitHub action to automatically update a template repository README with a list of repos that used it in an organisation.

## How to use

1. Specify somewhere in a README that you want the list, and add:

```txt
<!-- EXAMPLE_TEMPLATE_LIST_START -->
<!-- EXAMPLE_TEMPLATE_LIST_END -->
```

Removing the `EXAMPLE_` prefix, done here so the example below doesn't match the text above.

2. Add the GitHub action, and set it to run nightly

### Options

| Option          | Required | Description                                                                                                                                                                        |
| --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `token`         | ✅        | A personal access token that can access your organisation repos, see [here](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) for more. |
| `org`           | ❌        | A way to override the organisation the action is checking for usage of the template, otherwise it uses the org that owns the repo where the action is running.                     |
| `repo`          | ❌        | A way to override the repo the action is checking for usage of in the given org, otherwise it uses the repo where the action is running.                                           |
| `readme_path`   | ❌        | The path to the README to update.                                                                                                                                                  |
| `heading_level` | ❌        | The heading level for the usage section in the README file. (default: 1)                                                                                                           |
| `author_name`   | ❌        | The name of the user that will be displayed as the author of the commit.                                                                                                           |
| `author_email`  | ❌        | The email of the user that will be displayed as the author of the commit.                                                                                                          |
| `cwd`           | ❌        | The directory where your repository is located. You should use actions/checkout first to set it up.                                                                                |

## Code in Main

Install the dependencies

```bash
$ npm install
```

Build the typescript and package it for distribution

```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:

```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder.

Then run [ncc](https://github.com/zeit/ncc) and push the results:

```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

The action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action

## Example:

<!-- TEMPLATE_LIST_START -->
## 22 Repositories using next-template

* [maael/vibe-check](https://github.com/maael/vibe-check)
* [maael/gladius-codex](https://github.com/maael/gladius-codex)
* [maael/morning-greeting](https://github.com/maael/morning-greeting)
* [maael/what-now](https://github.com/maael/what-now)
* [maael/factory](https://github.com/maael/factory)
* [maael/info](https://github.com/maael/info)
* [maael/cached-proxy](https://github.com/maael/cached-proxy)
* [maael/twitch-guild-wars-2-build-viewer](https://github.com/maael/twitch-guild-wars-2-build-viewer)
* [maael/discord-slash-commands](https://github.com/maael/discord-slash-commands)
* [maael/meow-are-you](https://github.com/maael/meow-are-you)
* [maael/where-am-i](https://github.com/maael/where-am-i)
* [maael/dessa-site](https://github.com/maael/dessa-site)
* [maael/tweetem](https://github.com/maael/tweetem)
* [maael/observatory](https://github.com/maael/observatory)
* [maael/gh-short-url](https://github.com/maael/gh-short-url)
* [maael/who-was](https://github.com/maael/who-was)
* [maael/tilted](https://github.com/maael/tilted)
* [maael/bopsy](https://github.com/maael/bopsy)
* [maael/iono](https://github.com/maael/iono)
* [Bodmass/guildy](https://github.com/Bodmass/guildy)
* [maael/hydratwitch](https://github.com/maael/hydratwitch)
* [maael/betrayal-game](https://github.com/maael/betrayal-game)
<!-- TEMPLATE_LIST_END -->
