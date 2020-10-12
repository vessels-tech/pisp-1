
import config, { DFSPParticipant, PISPParticipant } from './config'


// import hubSteps from './steps/hubSteps'
// import oracleSteps from './steps/oracleSteps'
import makeParticipantSteps from './steps/participantSteps'
import { SeedCollection } from './types'


const collections: Array<SeedCollection> = [
  // hubSteps(config),
  // oracleSteps(config),
  // Generate a set of steps for each participant
  // TODO: fix bad types here...
  ...config.participants.map(p => makeParticipantSteps(p as unknown as PISPParticipant | DFSPParticipant)(config))
]

export default collections
