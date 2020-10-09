import { GlobalConfig } from 'seed/config';
import { RunResult, SuccessResult } from 'seed/runResult';
import { SeedCollection, SeedStep } from 'seed/types';


export interface ConstConfig {
  id: string,
  name: string,
  description?: string,
  ignoreFailure: boolean,
}

export class GenericSteps implements SeedCollection {
  id: string;
  name: string;
  description?: string;
  steps: SeedStep[];
  ignoreFailure: boolean;

  constructor(constConfig: ConstConfig, globalConfig: GlobalConfig, stepGenerator: (config: GlobalConfig) => Array<SeedStep>) {
    this.id = constConfig.id
    this.name = constConfig.name
    this.description = constConfig.description
    this.ignoreFailure = constConfig.ignoreFailure

    this.steps = stepGenerator(globalConfig)
  }


  public async run(): Promise<RunResult> {
    //TODO: run the steps!

    return SuccessResult.makeSuccessResult()
  }
}
