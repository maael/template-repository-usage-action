import {promises as fs} from 'fs'
import * as core from '@actions/core'
import * as github from '@actions/github'

interface Response {
  organization: {
    repositories: {
      pageInfo: {
        hasNextPage: boolean
        endCursor?: string
      }
      nodes: Item[]
    }
  }
}
interface Item {
  name: string
  nameWithOwner: string
  url: string
  templateRepository: null | {
    name: string
    owner: {
      login: string
    }
  }
}

async function run(): Promise<void> {
  try {
    const readmePath = core.getInput('readmePath') || 'README.md'
    const readmeContent = await fs.readFile(readmePath, {
      encoding: 'utf-8'
    })

    const token: string = core.getInput('token')
    const octokit = github.getOctokit(token, {
      previews: ['baptiste']
    })
    const {repo} = github.context
    const org = core.getInput('org') || repo.owner
    const repoName = core.getInput('repo') || repo.repo

    let items: Item[] = []
    let nextPageCursor: string | null | undefined = null

    do {
      const result: Response = await octokit.graphql(
        `
        query orgRepos($owner: String!, $afterCursor: String) {
          organization(login: $owner) {
            repositories(first: 100, after:$afterCursor, orderBy:{field:PUSHED_AT, direction:DESC}) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                name
                nameWithOwner
                url
                templateRepository {
                  name
                  owner {
                    login
                  }
                }
              }
            }
          }
        }
      `,
        {
          owner: org,
          afterCursor: nextPageCursor
        }
      )
      nextPageCursor = result.organization.repositories.pageInfo.hasNextPage
        ? result.organization.repositories.pageInfo.endCursor
        : undefined

      items = items.concat(result.organization.repositories.nodes)
    } while (nextPageCursor !== undefined)

    core.info(`${items.length} items`)

    const reposProducedByThis = items
      .filter(
        d =>
          d.templateRepository &&
          d.templateRepository.name === repoName &&
          d.templateRepository.owner.login === org
      )
      .map(d => `[${d.url}](${d.nameWithOwner})`)

    const output = `# ${reposProducedByThis.length} Repositories using ${
      repoName === repo.repo ? '' : `${repoName} `
    }template\n\n${
      reposProducedByThis.length ? `* ${reposProducedByThis.join('\n* ')}` : ''
    }`

    core.info(
      readmeContent.replace(
        /<!-- TEMPLATE_LIST_START -->[\s\S]+<!-- TEMPLATE_LIST_END -->/,
        `<!-- TEMPLATE_LIST_START -->\n${output}\n<!-- TEMPLATE_LIST_END -->`
      )
    )

    await fs.writeFile(
      readmePath,
      readmeContent.replace(
        /<!-- TEMPLATE_LIST_START -->[\s\S]+<!-- TEMPLATE_LIST_END -->/,
        `<!-- TEMPLATE_LIST_START -->\n${output}\n<!-- TEMPLATE_LIST_END -->`
      )
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
