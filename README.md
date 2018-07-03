# release-notes

![npm](https://img.shields.io/npm/v/release-notes.svg)

Generate markdown from all of the PRs that have been closed since your last release!

Originally used to generate notes for [zapier-platform-cli](https://github.com/zapier/zapier-platform-cli) and its related repos.

## Usage

In its simplest form, invoking this pulls the names of all of the closed PRs since the last time the given repo had a release. If passed multiple repos, it'll use the most recent release of the first as the date to filter against.

For more info, run:

> % release-notes -h

### Limitations

Currently, this is only set up to pull from Github. It can be expanded to use other providers if there's interest though!

### Private Repos

If you need to access private repos, use either the `-t` flag or set your `GITHUB_API_TOKEN` before invoking the CLI.

## API

In addition to a CLI, this package exports two functions for use javascript:

### releaseNotes

The main method, this does calls to the github API and returns an object with a list of closed PRs grouped by repo name.

### formatMarkdown

Takes the above object of PRs and returns a nicely formatted markdown file. This is separate so if you want to build/parse the output yourself, it's easy to do.

It accepts an object with the following keys as the second parameter (all of which are optional):

| Key       | Type       | Description                                                                       |
| --------- | ---------- | --------------------------------------------------------------------------------- |
| `keepOrg` | `boolean`  | if true, list the repo as `<ORG>/<REPO>` instead of `<REPO>`. Defaults to `false` |
| `order`   | `string[]` | print the repos in this order (which can be different than the supplied order)    |
| `version` | `string`   | pre-fills the version number. Prints `MAJOR.MINOR.PATCH` if missing               |
