#!/usr/bin/env ts-node


import collections from './index'
import { RunResultType } from './runResult'
import { SeedCollection } from './types'
import chalk from 'chalk';

const runCollection = async (collection: SeedCollection) => {
  const collectionNameFormatted = chalk.blue(collection.name)

  console.log(`  ${chalk.bold('Running')}: ${collectionNameFormatted}\n  ${chalk.bold('Description')}: ${collection.description}`)
  console.log(`  |`)
  const result = await collection.run()
  console.log(`  |`)
  switch (result.type) {
    case RunResultType.SUCCESS: {
      console.log(`  ${collectionNameFormatted} Passed`)
      if (result.warnings.length > 0) {
        console.log(`  - passed with warnings: ${result.warnings.join('\n')}`)
      }

      break;
    }
    case RunResultType.FAILURE:
      console.log(`  ${collectionNameFormatted} Failed.`)
      if (result.warnings.length > 0) {
        console.log(`failed with warnings: ${result.warnings.join('\n')}`)
      }
      console.log(`failed with errors: ${result.errors.join('\n')}`)

      break;
  }
}


// TODO: better cli config
runCollection(collections[0])
