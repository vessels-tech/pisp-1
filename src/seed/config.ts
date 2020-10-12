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
  fspiopCallbackUrl: string,
  thirdpartyCallbackUrl: string
}

export interface PISPParticipant {
  id: string,
  type: ParticipantType.PISP
  fspiopCallbackUrl: string,
  thirdpartyCallbackUrl: string
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
    // {
    //   id: 'dfspa',
    //   type: ParticipantType.DFSP,
    //   settlementAccountId: '1',
    //   // For our demo, Participants are on the same deployment
    //   fspiopCallbackUrl: `${scheme}://${baseUrl}/dfspa/sdk-scheme-adapter/inbound`,
    //   thirdpartyBaseUrl: `${scheme}://${baseUrl}/dfspa/thirdparty-scheme-adapter/inbound`
    // },
    // {
    //   id: 'dfspb',
    //   type: ParticipantType.DFSP,
    //   settlementAccountId: '2',
    //   fspiopCallbackUrl: `${scheme}://${baseUrl}/dfspb/sdk-scheme-adapter/inbound`,
    //   thirdpartyBaseUrl: `${scheme}://${baseUrl}/dfspb/thirdparty-scheme-adapter/inbound`
    // },
    {
      id: 'pispa',
      type: ParticipantType.PISP,
      // For PISP, 3p-scheme-adapter gets callbacks from switch
      fspiopCallbackUrl: `${scheme}://${baseUrl}/pispa/thirdparty-scheme-adapter/inbound`,
      thirdpartyBaseUrl: `${scheme}://${baseUrl}/pispa/thirdparty-scheme-adapter/inbound`
    },
  ]
}

export default config
