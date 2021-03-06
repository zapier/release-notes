#!/usr/bin/env node

import program = require('commander')
import { releaseNotes as main, formatMarkdown } from './index'
import { processTimestamp } from './utils'
const pj = require('../package.json')

program
  .version(pj.version)
  .usage('[options] <repos ...>')
  .option('-s, --since', 'find all merged PRs since this unix timestamp')
  .option(
    '-t, --token',
    'GitHub API token. Can also be read from env (GITHUB_API_TOKEN)'
  )
  .parse(process.argv)

if (!program.args.length) {
  console.error(`ERR: specify at least one repo`)
  process.exit(1)
}

const token: string | undefined =
  program.token || process.env.GITHUB_API_TOKEN || undefined

// the program object has the flags set on it when they're present
main(program.args, token, processTimestamp(program.since))
  .then(res => {
    console.log(formatMarkdown(res))
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
