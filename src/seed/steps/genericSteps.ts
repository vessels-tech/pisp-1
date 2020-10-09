import chalk from 'chalk';
import { GlobalConfig } from '../config';
import { Result, RunResult, RunResultType } from '../runResult';
import { SeedCollection, SeedStep } from '../types';


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
    let warnings: Array<string> = []
    let errors: Array<Error> = []

    await Promise.all(this.steps.map(async step => {
      console.log("  - step:", chalk.magenta(step.name))
      const result = await step.command()

      warnings = warnings.concat(result.warnings)
      if (result.type === RunResultType.FAILURE) {
        console.log('result', result.errors)
        errors = errors.concat(result.errors)
      }
    }))

    if (errors.length > 0) {
      return Result.makeFailureResult(errors, warnings)
    }

    return Result.makeSuccessResult(warnings)
  }
}
