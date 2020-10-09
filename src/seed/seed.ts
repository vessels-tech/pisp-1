

export interface SeedStep {
  ignoreFailure: boolean
  command: unknown
}

export interface SeedCollection {
  id: string,
  name: string,
  description?: string,
  steps: Array<SeedStep>
  ignoreFailure: boolean
}

const collections: Array<SeedCollection> = [
  {
    id: 'hub-account',
    name: 'Hub Account',
    steps: [

    ],
    ignoreFailure: true,
  },
  {
    id: 'oracle',
    name: 'Oracle',
    steps: [

    ],
    ignoreFailure: false,
  },
  {
    id: 'dfspa',
    name: 'DFSP A',
    steps: [

    ],
    ignoreFailure: false,
  },
  {
    id: 'dfspb',
    name: 'DFSP B',
    steps: [

    ],
    ignoreFailure: false,
  },
  {
    id: 'pisp',
    name: 'PISP',
    steps: [

    ],
    ignoreFailure: false,
  },
]
