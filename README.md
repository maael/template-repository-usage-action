<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Template Repository Usage GitHub Action

A GitHub action to automatically update a template repository README with a list of repos that used it in an organisation.

## How to use

1. Specify somewhere in a README that you want the list, and add:

```txt
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
