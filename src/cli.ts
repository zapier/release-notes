#!/usr/bin/env node

import program = require('commander')
import { fetchPRs as main } from './index'
import { formatMarkdown } from './utils'
const pj = require('../package.json')

program
  .version(pj.version)
  .usage('[options] <repos ...>')
  .option('-s, --since', 'find all merged PRs since this date')
  .option(
    '-t, --token',
    'GitHub API token. Can also be read from env (GITHUB_API_TOKEN)'
  )
  .parse(process.argv)

if (!program.args.length) {
  console.error(`ERR: specify at least one repo`)
  process.exit(1)
}

const otherRepos = program.args.slice(1)
const token = program.token || process.env.GITHUB_API_TOKEN || undefined

// the program object has the flags set on it when they're present
main(program.args, token, program.since)
  .then(res => {
    console.log(formatMarkdown(res))
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
