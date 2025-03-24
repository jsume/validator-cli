import type { Lang } from '@jsume/schema/validator'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import validator from '@jsume/schema/validator'
import cac from 'cac'

const validLangs: Lang[] = [
  'en',
  'ar',
  'ca',
  'cs',
  'de',
  'es',
  'fi',
  'fr',
  'hu',
  'id',
  'it',
  'ja',
  'ko',
  'nb',
  'nl',
  'pl',
  'pt-BR',
  'ru',
  'sk',
  'sv',
  'th',
  'zh',
  'zh-TW',
]

const cli = cac()
cli
  .command('', 'Validate resume data')
  .option('-i, --input <path>', 'Input file path')
  .option('--lang <language>', 'Language for validation (default: en)')
  .action((options) => {
    const filePath = path.resolve(options.input)
    const lang = path.resolve(options.lang || 'en') as Lang
    if (!validLangs.includes(lang)) {
      console.error(`Invalid language: ${lang}. Valid options are: ${validLangs.join(', ')}`)
      return
    }
    const data = readFileSync(filePath, 'utf-8')
    validator(
      JSON.parse(data),
      (valid, errorsText) => {
        if (!valid) {
          console.error(`❌\n${errorsText}`)
        } else {
          console.log('✅')
        }
      },
      lang,
    )
  })

cli.help()
cli.parse()
