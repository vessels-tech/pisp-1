
import { GlobalConfig } from 'seed/config';
import Requests from 'seed/requests';
import { FailureResult, RunResult, SuccessResult } from 'seed/runResult';
import { SeedStep } from "seed/seed";
import { wrapWithRunResult } from 'seed/utils';
import { ConstConfig, GenericSteps } from './genericSteps';




// const config
// This won't change dynamically
const constConfig: ConstConfig =  {
  id: 'hubsteps',
  name: 'Hub Steps',
  description: 'Sets up the hub accounts',
  ignoreFailure: true,
}

// Define steps here
const stepGenerator = (config: GlobalConfig): Array<SeedStep> => {

  return [
    {
      name: 'setup `HUB_MULTILATERAL_SETTLEMENT` account',
      ignoreFailure: false,
      command: wrapWithRunResult(() => Requests.postHubAccount(config.urls.centralLedger, {
        // TODO: better config for different participant ids
        fspiopSource: 'payerfsp',
        body: {
          type: "HUB_MULTILATERAL_SETTLEMENT",
          currency: config.currency
        }
      }))
    },
  ]

}

const hubsteps = (config: any) => new GenericSteps(constConfig, config, stepGenerator)

export default hubsteps
