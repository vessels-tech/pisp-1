
import config from './config'


import hubSteps from './steps/hubSteps'
import oracleSteps from './steps/oracleSteps'
import makeParticipantSteps from './steps/participantSteps'
import { SeedCollection } from './types'


const collections: Array<SeedCollection> = [
  hubSteps(config),
  oracleSteps(config),
  // Generate a set of steps for each participant
  ...config.participants.map(p => makeParticipantSteps(p)(config))
]

export default collections


// const collections: Array<SeedCollection> = [
//   {
//     id: 'hub-account',
//     name: 'Hub Account',
//     steps: [

//     ],
//     ignoreFailure: true,
//   },
//   {
//     id: 'oracle',
//     name: 'Oracle',
//     steps: [

//     ],
//     ignoreFailure: false,
//   },
//   {
//     id: 'dfspa',
//     name: 'DFSP A',
//     steps: [

//     ],
//     ignoreFailure: false,
//   },
//   {
//     id: 'dfspb',
//     name: 'DFSP B',
//     steps: [

//     ],
//     ignoreFailure: false,
//   },
//   {
//     id: 'pisp',
//     name: 'PISP',
//     steps: [

//     ],
//     ignoreFailure: false,
//   },
// ]
