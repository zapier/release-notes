import * as got from 'got'

import { flatten, last, isEqual, sortBy } from 'lodash'
import { PullRequest } from './interfaces'

const ROOT_URL = 'https://api.github.com/repos'

const generateUrl = (repoOrUrl: string, path?: string) => {
  if (repoOrUrl.startsWith('https://')) {
    return repoOrUrl
  }

  // trailing slash is an error. so let's not do that
  const parts = [ROOT_URL, repoOrUrl]
  if (path) {
    parts.push(path)
  }

  return parts.join('/')
}

export const processTimestamp = (ts?: string) => {
  if (ts === undefined) {
    return ts
  }

  // short, standard unix timestamp
  if (ts.length === 10) {
    return new Date(parseInt(ts, 10) * 1000)
  } else if (ts.length === 13) {
    return new Date(parseInt(ts, 10))
  } else {
    throw new Error(
      `"${ts}" isn't a valid timestamp: use a unix timestamp instead`
    )
  }
}

export const githubRequest = async (
  repoOrUrl: string,
  token?: string,
  path?: string,
  params?: object
) => {
  // sometimes we pass in full urls, oops
  const url = generateUrl(repoOrUrl, path)

  const response = await got(url, {
    json: true,
    headers: {
      Accept: 'github.v3; format=json',
      'User-Agent': 'release-notes', // required
      Authorization: token ? `token ${token}` : undefined
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
      `Repo "${repoOrUrl}" not found. You either don't have permissions to view it or it doesn't exist`
    )
  } else if (response.statusCode! >= 400) {
    throw new Error(response.statusMessage)
  }

  // TODO: paginate if there's a lot of PRs
  return response.body
}

const formatPR = (pr: PullRequest) => {
  return `* ${pr.title} ([#${pr.number}](${pr.html_url}))`
}

const repoName = (s: string) => last(s.split('/')) as string

const repoHeader = (repo: string, numRepos: number, keepOrg: boolean) => {
  if (numRepos === 1) {
    return ''
  }
  return `\n### ${keepOrg ? repo : repoName(repo)}`
}

export const formatMarkdown = (
  input: { [x: string]: PullRequest[] },
  {
    keepOrg = false,
    order,
    version = 'MAJOR.MINOR.PATCH'
  }: {
    keepOrg?: boolean
    order?: string[]
    version?: string
  } = {}
) => {
  const keys = Object.keys(input)

  // take care not to mutate input
  if (order && !isEqual(sortBy(keys), sortBy(order))) {
    throw new Error('the order array has different elements than the repo keys')
  }

  const sections = flatten(
    (order || keys).map(repo => [
      repoHeader(repo, keys.length, keepOrg),
      input[repo].length ? input[repo].map(formatPR) : 'None!'
    ])
  )

  return flatten([`## ${version}`, sections]).join('\n')
}
