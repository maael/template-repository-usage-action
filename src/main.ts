import {promises as fs} from 'fs'
import path from 'path'
import * as core from '@actions/core'
import * as github from '@actions/github'
import simpleGit from 'simple-git/promise'

interface Response {
  repositoryOwner: {
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
    const authorEmail =
      core.getInput('author_email') || 'matt.a.elphy@gmail.com'
    const authorName = core.getInput('author_name') || 'Matthew Elphick'
    const baseDir = path.join(process.cwd(), core.getInput('cwd') || '')
    const readmePath = path.join(
      baseDir,
      core.getInput('readme_path') || 'README.md'
    )
    const readmeContent = await fs.readFile(readmePath, {
      encoding: 'utf-8'
    })
    const headingLevel: number =
      parseInt(core.getInput('heading_level'), 10) || 1
    const headingLevelContent = '#'.repeat(headingLevel)

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
          repositoryOwner(login: $owner) {
            repositories(first: 100, after:$afterCursor, orderBy:{field:CREATED_AT, direction:DESC}) {
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
      nextPageCursor = result.repositoryOwner.repositories.pageInfo.hasNextPage
        ? result.repositoryOwner.repositories.pageInfo.endCursor
        : undefined

      items = items.concat(result.repositoryOwner.repositories.nodes)
    } while (nextPageCursor !== undefined)

    core.info(
      `Checking ${items.length} repositories for repositories from ${repoName}`
    )

    const reposProducedByThis = items
      .filter(
        d =>
          d.templateRepository &&
          d.templateRepository.name === repoName &&
          d.templateRepository.owner.login === org
      )
      .map(d => `[${d.nameWithOwner}](${d.url})`)

    const output = `${headingLevelContent} ${
      reposProducedByThis.length
    } Repositories using ${
      repoName === repo.repo ? 'template' : `${repoName}`
    }\n\n${
      reposProducedByThis.length ? `* ${reposProducedByThis.join('\n* ')}` : ''
    }`

    const updatedReadme = readmeContent.replace(
      /<!-- TEMPLATE_LIST_START -->[\s\S]+<!-- TEMPLATE_LIST_END -->/,
      `<!-- TEMPLATE_LIST_START -->\n${output}\n<!-- TEMPLATE_LIST_END -->`
    )

    await fs.writeFile(readmePath, updatedReadme)

    if (readmeContent !== updatedReadme) {
      core.info('Changes found, committing')
      const git = simpleGit(baseDir)
      await git.addConfig('user.email', authorEmail)
      await git.addConfig('user.name', authorName)
      await git.add(readmePath)
      await git.commit(`docs: 📝 Updating template usage list`, undefined, {
        '--author': `"${authorName} <${authorEmail}>"`
      })
      await git.push()
      core.info('Committed')
    } else {
      core.info('No changes, skipping')
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
