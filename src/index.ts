#!/usr/bin/env node

import { Tag, SHA, PullRequest } from './interfaces'
import { githubRequest } from './utils'

export * from './interfaces'
export { formatMarkdown } from './utils'

export const fetchPRs = async (
  repo: string,
  since?: Date,
  otherRepos?: string[]
) => {
  if (!since) {
    const tags = (await githubRequest(repo, 'tags')) as Tag[]
    const commitInfo = (await githubRequest(tags[0].commit.url)) as SHA

    since = new Date(commitInfo.commit.committer.date)
  }

  const sections: { [x: string]: PullRequest[] } = {}

  const reposToFetch = [repo].concat(otherRepos || [])

  for (const r of reposToFetch) {
    const pulls = (await githubRequest(r, 'pulls', {
      state: 'closed'
    })) as PullRequest[]

    const pullsToRelease = pulls.filter(
      p => p.merged_at && new Date(p.merged_at) > since!
    )

    sections[repo] = pullsToRelease
  }

  return sections
}
