import * as got from 'got'

import { values, merge, flatten, last, isEqual, sortBy } from 'lodash'
import { PullRequest } from './interfaces'

const ROOT_URL = 'https://api.github.com/repos'

export const githubRequest = async (
  repo: string,
  path?: string,
  params?: object
) => {
  // sometimes we pass in full urls, oops
  const url = repo.startsWith('https://') ? repo : `${ROOT_URL}/${repo}/${path}`
  const response = await got(url, {
    json: true,
    headers: {
      Accept: 'github.v3; format=json',
      'User-Agent': 'release-notes' // required
      // TODO: AUTH from env
    },
    query: params,
    throwHttpErrors: false
  })

  if (response.statusCode === 403) {
    throw new Error(
      `Rate limit reached! Either add an access token or wait until ${new Date(
        response.headers['X-RateLimit-Reset'] as string
      )}`
    )
  } else if (response.statusCode === 404) {
    throw new Error(
      `Repo "${repo}" not found. You either don't have permissions to view it or it doesn't exist`
    )
  }

  // TODO: paginate
  return response.body
}

const formatPR = (pr: PullRequest) => {
  return `* ${pr.title} ([#${pr.number}](${pr.html_url}))`
}

export const formatMarkdown = (
  input: { [x: string]: PullRequest[] },
  removeOrg?: boolean,
  order?: string[],
  version?: string
) => {
  let keys = Object.keys(input)
  if (removeOrg) {
    keys = keys.map(k => last(k.split('/'))) as string[]
  }

  const s = new Set()

  // take care not to mutate input
  if (order && !isEqual(sortBy(keys), sortBy(order))) {
    throw new Error('the order array has different elements than the repo keys')
  }

  let sections = flatten(
    (order || keys).map(repo => [
      `### ${repo}`,
      input[repo].length ? input[repo].map(formatPR) : 'None!',
      ''
    ])
  )

  return flatten([`## ${version || 'MAJOR.MINOR.PATCH'}`, '', sections]).join(
    '\n'
  )
}
