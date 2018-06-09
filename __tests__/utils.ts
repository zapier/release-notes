import { config } from 'dotenv'
import { githubRequest } from '../src/utils'

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
})
