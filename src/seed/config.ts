export interface GlobalConfig {
  currency: string,
  urls: {
    centralLedger: string
  }
}

// TODO: parse config with convict or something

const baseUrl = process.env.ELB_URL
const scheme = `http`

const config = {
  currency: 'USD',
  urls: {
    centralLedger: `${scheme}://${baseUrl}/central-ledger`
  }
}

export default config
