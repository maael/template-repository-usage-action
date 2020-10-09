<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Template Repository Usage GitHub Action

A GitHub action to automatically update a template repository README with a list of repos that used it in an organisation.

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
# 7 Repositories using graphql-monorepo-template

* [ThreadsStyling/sales-ops-api](https://github.com/ThreadsStyling/sales-ops-api)
* [ThreadsStyling/product-catalogue-api](https://github.com/ThreadsStyling/product-catalogue-api)
* [ThreadsStyling/chat-assignment-api](https://github.com/ThreadsStyling/chat-assignment-api)
* [ThreadsStyling/notifications-service](https://github.com/ThreadsStyling/notifications-service)
* [ThreadsStyling/graphql.threads.team](https://github.com/ThreadsStyling/graphql.threads.team)
* [ThreadsStyling/inbound-link-resolver](https://github.com/ThreadsStyling/inbound-link-resolver)
* [ThreadsStyling/parcels-graph-api](https://github.com/ThreadsStyling/parcels-graph-api)
<!-- TEMPLATE_LIST_END -->
