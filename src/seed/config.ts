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
export interface Participant {
  id: string,
  type: ParticipantType
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
      type: ParticipantType.DFSP
    },
    {
      id: 'dfspb',
      type: ParticipantType.DFSP
    },
    {
      id: 'pispa',
      type: ParticipantType.PISP
    },
  ]
}

export default config
