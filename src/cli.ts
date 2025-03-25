import { readFileSync } from 'node:fs'
import path from 'node:path'
import validator from '@jsume/schema/validator'
import cac from 'cac'
import pkg from '../package.json'

const cli = cac()
cli
  .command('', 'Validate jsume json file')
  .option('-i, --input <path>', 'Input file path')
  .action((options) => {
    const filePath = path.resolve(options.input)
    const fileName = path.basename(filePath)
    const fileContent = readFileSync(filePath, 'utf-8')
    validator(
      JSON.parse(fileContent),
      (valid, errorsText) => {
        if (!valid) {
          console.error(errorsText)
        }
        else {
          console.log(`${fileName} is valid!`)
        }
      },
      'en',
    )
  })

cli.version(pkg.version)
cli.help()
cli.parse()
