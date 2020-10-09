export interface GlobalConfig {
  currency: string,
  urls: {
    centralLedger: string
  }
}

// TODO: parse config with convict or something

const config = {
  currency: 'USD',
  urls: {
    centralLedger: 'localhost:4001'
  }
}

export default config
