export interface GlobalConfig {
  currency: string,
  // Urls to talk to services
  urls: {
    alsAdmin: string,
    centralLedger: string
  },
  // Urls to be passed into internal services
  applicationUrls: {
    oracle: string,
  },
  participants: Array<Participant>
}

export enum ParticipantType {
  DFSP = 'DFSP',
  PISP = 'PISP'
}
export type Participant = DFSPParticipant | PISPParticipant
export interface DFSPParticipant {
  id: string,
  type: ParticipantType.DFSP
  settlementAccountId: string
  fspiopCallbackUrl: '',
  thirdpartyCallbackUrl: ''
}

export interface PISPParticipant {
  id: string,
  type: ParticipantType.PISP
  fspiopCallbackUrl: '',
  thirdpartyCallbackUrl: ''
}

// TODO: parse config with convict or something

const baseUrl = process.env.ELB_URL
const scheme = `http`

const config = {
  currency: 'USD',
  urls: {
    als: `${scheme}://${baseUrl}/account-lookup-service`,
    alsAdmin: `${scheme}://${baseUrl}/account-lookup-service-admin`,
    centralLedger: `${scheme}://${baseUrl}/central-ledger`
  },
  applicationUrls: {
    // TODO: run the simulator for oracles...
    oracle: 'TODO',
  },
  participants: [
    {
      id: 'dfspa',
      type: ParticipantType.DFSP,
      settlementAccountId: '1',
      fspiopCallbackUrl: '',
      thirdpartyBaseUrl: ''
    },
    {
      id: 'dfspb',
      type: ParticipantType.DFSP,
      settlementAccountId: '2',
      fspiopCallbackUrl: '',
      thirdpartyBaseUrl: ''
    },
    {
      id: 'pispa',
      type: ParticipantType.PISP,
      fspiopCallbackUrl: '',
      thirdpartyBaseUrl: ''
    },
  ]
}

export default config
