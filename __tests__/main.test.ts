import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {promises as fs} from 'fs'
import {rest} from 'msw'
import {setupServer} from 'msw/node'

const worker = setupServer(
  rest.get('https://github.com/octocat', (req, res, ctx) => {
    return res(
      ctx.delay(1500),
      ctx.status(202, 'Mocked status'),
      ctx.json({
        message: 'Mocked response JSON body'
      })
    )
  })
)

beforeAll(() => {
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
})

test('should do the thing', async () => {
  process.env['INPUT_TOKEN'] = 'test-token'
  process.env['INPUT_ORG'] = 'maael'
  process.env['INPUT_REPO'] = 'doesnt-exist'
  const actionPath = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {
    env: process.env
  }
  const r = await fs.stat(actionPath)
  const child = cp.spawnSync(`node ${actionPath}`, options)
  if (child.error) {
    console.error(child.error)
  } else {
    console.info('Done', child.stdout)
  }
})
