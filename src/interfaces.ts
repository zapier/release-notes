// there's a lot more data on these responses, but this is all we need

export interface Tag {
  name: string // 'v5.2.0'
  commit: {
    sha: string
    url: string
  }
}

export interface SHA {
  sha: string
  commit: {
    author: {
      name: string
      email: string
      date: string
    }
    committer: {
      name: string
      email: string
      date: string
    }
    message: string
  }
  // there's a ton more info here
}

export interface PullRequest {
  html_url: string
  title: string
  body: string
  number: number
  state: 'open' | 'closed'
  merged_at: string | null
}
