import type { ValidatorCallback } from '@jsume/schema/validator'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import validator from '@jsume/schema/validator'
import cac from 'cac'
import pkg from '../package.json'

// get resume data from gist
async function getJson(url: string): Promise<string> {
  // const response = await fetch(`https://gist.githubusercontent.com/${username}/${id}/raw`)
  const response = await fetch(url)
  const json = await response.json()
  return json
}

function validatorCallbackFactory(pathToJsonFile: string): ValidatorCallback {
  return function cb(valid, errorsText) {
    if (!valid) {
      console.error(`${pathToJsonFile} is INVALID:\n${errorsText}`)
    }
    else {
      console.log(`${pathToJsonFile} is valid!`)
    }
  }
}

const cli = cac()
cli
  .command('', 'Validate jsume json file')
  .option('-i, --input <path>', 'Input file path')
  .option('-u, --url <url>', 'URL to the jsume json file')
  .action(async (options) => {
    const { input, url } = options
    if (!input && !url) {
      throw new Error('Please provide an input file path or a URL.')
    }
    else if (input && url) {
      throw new Error('Please provide only one of input file path or URL.')
    }
    else if (input) {
      const filePath = path.resolve(input)
      const fileName = path.basename(filePath)
      const fileContent = readFileSync(filePath, 'utf-8')
      validator(
        JSON.parse(fileContent),
        validatorCallbackFactory(fileName),
        'en',
      )
    }
    else {
      let json = ''
      try {
        json = await getJson(url)
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (_) {
        const e = new Error('Error fetching the JSON file from the URL.')
        e.name = 'FetchError'
        throw e
      }
      validator(
        json,
        validatorCallbackFactory('This online JSON file'),
        'en',
      )
    }
  })

cli.version(pkg.version)
cli.help()

try {
  cli.parse(process.argv, { run: false })
  await cli.runMatchedCommand()
}
catch (error: any) {
  const errorName = error.name || ''
  const errorMessage = error.message
  const knownErrors = ['FetchError', 'CACError']
  if (knownErrors.includes(errorName)) {
    console.error(`ERROR: ${errorMessage}`)
  }
  else {
    console.error(error.stack)
  }
  process.exit(1)
}
