import { config } from 'dotenv'
import { githubRequest, processTimestamp } from '../src/utils'

config()

describe('utils', () => {
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

  test('process timestamp', () => {
    const d = new Date(1528847764000)

    expect(processTimestamp()).toBeUndefined()

    expect(() => processTimestamp('asdf')).toThrow()

    expect(processTimestamp('1528847764')).toEqual(d)

    expect(processTimestamp('1528847764000')).toEqual(d)
  })
})
