
// Strict typing of run results
export enum RunResultType {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

// export type RunResult = SuccessResult | FailureResult

// export type SuccessResult = {
//   type: RunResultType.SUCCESS,
//   warnings: Array<string>
// }

// export type FailureResult = {
//   type: RunResultType.FAILURE,
//   warnings: Array<string>,
//   errors: Array<Error>
// }



export interface RunResult {
  type: RunResultType
}


export class SuccessResult implements RunResult {
  type: RunResultType.SUCCESS
  warnings: Array<string>

  constructor(warnings?: Array<string>) {
    this.type = RunResultType.SUCCESS
    if (warnings) {
      this.warnings = warnings
    } else {
      this.warnings = []
    }
  }

  public static makeSuccessResult(warnings?: Array<string>) {
    return new SuccessResult(warnings)
  }
}

export class FailureResult implements RunResult {
  type: RunResultType.FAILURE
  warnings: Array<string>
  errors: Array<Error>

  constructor(errors: Array<Error>, warnings?: Array<string>) {
    this.type = RunResultType.FAILURE;
    this.errors = errors
    if (warnings) {
      this.warnings = warnings
    } else {
      this.warnings = []
    }
  }

  public static makeFailureResult(errors: Array<Error>, warnings?: Array<string>) {
    return new FailureResult(errors, warnings)
  }
}
