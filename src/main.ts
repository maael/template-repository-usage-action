import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('token')
    const octokit = github.getOctokit(token)
    const {repo} = github.context
    const org = repo.owner

    const {data} = await octokit.repos.listForOrg({
      org
    })

    const reposProducedByThis = data
      .filter(
        d =>
          d.template_repository.name === repo.repo &&
          d.template_repository.owner === org
      )
      .map(d => `[${d.html_url}](${d.full_name})`)
      .join('\n* ')

    const output = `# Repositories using this template\n\n${
      reposProducedByThis.length ? '' : `* ${reposProducedByThis}`
    }`

    core.info(output)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
