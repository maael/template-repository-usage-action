import * as process from 'process'
import path from 'path'
import {promises as fs} from 'fs'
import mockFs from 'mock-fs'
import {rest, graphql} from 'msw'
import {setupServer} from 'msw/node'
import {run} from '../src/main'

const worker = setupServer(
  rest.get('https://github.com/octocat', (req, res, ctx) => {
    console.info('!?!?!')
    return res(
      ctx.delay(1500),
      ctx.status(202, 'Mocked status'),
      ctx.json({
        message: 'Mocked response JSON body'
      })
    )
  }),
  graphql.query('orgRepos', (req, res, ctx) => {
    return res(
      ctx.data({
        repositoryOwner: {
          repositories: {
            pageInfo: {
              hasNextPage: false,
              endCursor: undefined
            },
            nodes: [
              {
                name: 'example-repo',
                nameWithOwner: 'maael/example-repo',
                url: 'url',
                templateRepository: {
                  name: 'doesnt-exist',
                  owner: {
                    login: 'maael'
                  }
                }
              },
              {
                name: 'different-repo',
                nameWithOwner: 'maael/different-repo',
                url: 'url',
                templateRepository: {
                  name: 'different-doesnt-exist',
                  owner: {
                    login: 'maael'
                  }
                }
              }
            ]
          }
        }
      })
    )
  })
)

describe('#action', () => {
  beforeAll(() => {
    mockFs(
      {
        'README.md': `
        # Example

        <!-- TEMPLATE_LIST_START -->

        <!-- TEMPLATE_LIST_END -->
      `,
        node_modules: mockFs.load(path.resolve(__dirname, '../node_modules'))
      },
      {createCwd: true, createTmp: true}
    )
    worker.listen({
      onUnhandledRequest(req) {
        console.error(
          'Found an unhandled %s request to %s',
          req.method,
          req.url.href
        )
      }
    })
  })

  afterAll(() => {
    worker.close()
    mockFs.restore()
  })

  test('should do the thing', async () => {
    process.env['INPUT_TOKEN'] = 'test-token'
    process.env['GITHUB_REPOSITORY'] = 'maael/doesnt-exist'
    process.env['INPUT_ORG'] = 'maael'
    process.env['INPUT_REPO'] = 'doesnt-exist'
    await run()
    const content = await fs.readFile('README.md', 'utf-8')
    expect(content).toMatchInlineSnapshot(`
      "
              # Example

              <!-- TEMPLATE_LIST_START -->
      # 1 Repositories using template

      * [maael/example-repo](url)
      <!-- TEMPLATE_LIST_END -->
            "
    `)
  })

  test('should respect heading level', async () => {
    process.env['INPUT_TOKEN'] = 'test-token'
    process.env['GITHUB_REPOSITORY'] = 'maael/doesnt-exist'
    process.env['INPUT_ORG'] = 'maael'
    process.env['INPUT_HEADING_LEVEL'] = '2'
    process.env['INPUT_REPO'] = 'doesnt-exist'
    await run()
    const content = await fs.readFile('README.md', 'utf-8')
    expect(content).toMatchInlineSnapshot(`
      "
              # Example

              <!-- TEMPLATE_LIST_START -->
      ## 1 Repositories using template

      * [maael/example-repo](url)
      <!-- TEMPLATE_LIST_END -->
            "
    `)
  })
})
