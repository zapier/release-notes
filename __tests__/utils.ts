import { config } from 'dotenv'
import { githubRequest, processTimestamp, formatMarkdown } from '../src/utils'
import { PullRequest } from '../src/interfaces'

config()

describe('utils', () => {
  describe('github request', () => {
    test('grabs public info', async () => {
      const response = await githubRequest('zapier/zapier-platform-cli')
      expect(response.name).toEqual('zapier-platform-cli')
    })

    test('grabs private info', async () => {
      const response = await githubRequest(
        'zapier/secret-test',
        process.env.GITHUB_API_TOKEN
      )
      expect(response.name).toEqual('secret-test')
    })
  })

  describe('process timestamp', () => {
    test('process timestamp', () => {
      const d = new Date(1528847764000)

      expect(processTimestamp()).toBeUndefined()

      expect(() => processTimestamp('asdf')).toThrow()

      expect(processTimestamp('1528847764')).toEqual(d)

      expect(processTimestamp('1528847764000')).toEqual(d)
    })
  })

  describe('format markdown', () => {
    const onePr: { [x: string]: PullRequest[] } = {
      'org/thing': [
        {
          title: 'thing',
          html_url: 'https://github.com/org/thing',
          body: 'did the thing',
          number: 5,
          state: 'closed',
          merged_at: new Date().toISOString()
        }
      ]
    }

    const twoPR: { [x: string]: PullRequest[] } = {
      'org/other-thing': [
        {
          title: 'other-thing',
          html_url: 'https://github.com/org/other-thing',
          body: 'did the other thing',
          number: 6,
          state: 'closed',
          merged_at: new Date().toISOString()
        }
      ],
      ...onePr
    }

    describe('while keeping org', () => {
      test('single repo should not list repo', () => {
        expect(formatMarkdown(onePr, { keepOrg: true })).not.toContain('###')
      })

      test('two repos should not list repo', () => {
        expect(formatMarkdown(twoPR, { keepOrg: true })).toContain(
          '### org/thing'
        )
      })
    })

    describe('without org', () => {
      test('single repo should not list repo', () => {
        expect(formatMarkdown(onePr)).not.toContain('###')
      })

      test('two repos should list repo', () => {
        expect(formatMarkdown(twoPR)).toContain('### thing')
      })
    })
  })
})
