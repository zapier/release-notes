#!/usr/bin/env node

import { Tag, SHA, PullRequest } from './interfaces'
import { githubRequest } from './utils'

export * from './interfaces'
export { formatMarkdown } from './utils'

export const fetchPRs = async (
  repo: string | string[],
  token?: string,
  since?: Date
  // otherRepos?: string[]
) => {
  const reposToFetch = typeof repo === 'string' ? [repo] : repo

  if (!since) {
    const tags = (await githubRequest(reposToFetch[0], token, 'tags')) as Tag[]
    const commitInfo = (await githubRequest(tags[0].commit.url, token)) as SHA

    since = new Date(commitInfo.commit.committer.date)
  }

  const sections: { [x: string]: PullRequest[] } = {}

  for (const r of reposToFetch) {
    const pulls = (await githubRequest(r, token, 'pulls', {
      state: 'closed'
    })) as PullRequest[]

    const pullsToRelease = pulls.filter(
      p => p.merged_at && new Date(p.merged_at) > since!
    )

    sections[r] = pullsToRelease
  }

  return sections
}
