import { log } from './log'

export const logFn = (modName: string, fnName: string) => {
  console.log("")
  // log("blue", "*********")
  log("blue", `== ${modName}-${fnName} ==========`)
  // log("blue", '---------')
}
