import { FailureResult, RunResult, SuccessResult } from './runResult'

/**
 * @function wrapWithRunResult
 * @description A simple wrapper around an anonymous function
 *  if the function throws an error, the wrapper will return a FailureResult
 * @param func
 */
export function wrapWithRunResult (func: () => any): () => Promise<RunResult> {
  return async () => {
    try {
      await func()
      return SuccessResult.makeSuccessResult()
    } catch (err) {
      return FailureResult.makeFailureResult([err])
    }
  }
}
