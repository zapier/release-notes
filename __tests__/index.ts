import { config } from 'dotenv'
import { releaseNotes } from '../src/'

config()

describe('indexs', () => {
  test('fetches release notes', async () => {
    await releaseNotes(
      [
        'zapier/zapier-platform-cli',
        'zapier/zapier-platform-core',
        'zapier/zapier-platform-schema'
      ],
      process.env.GITHUB_API_TOKEN
    )
  })
})
