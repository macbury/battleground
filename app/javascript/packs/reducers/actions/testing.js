import Actions from '@actions'
import Compiler from '@language/compiler'

export function logMessage(message) {
  return { type: Actions.LOG_MESSAGE, payload: message }
}

export function previewReady() {
  return { type: Actions.PREVIEW_READY }
}

export function runCode(content) {
  let compiler = new Compiler()
  try {
    let bytecode = compiler.compile(content)
    let { sourceMap, code } = bytecode.toProgram()
    return { type: Actions.RUN, payload: { sourceMap, bytecode: code } }
  } catch (e) {
    let { message, codeLocation } = e
    return { type: Actions.CODE_ERROR, payload: { message, codeLocation } }
  }
}

export function programError({ message, codeLocation, ip }) {
  return { type: Actions.CODE_ERROR, payload: { message, codeLocation, ip } }
}

export function haltProgram() {
  return { type: Actions.HALT }
}

export function pauseProgram() {
  return { type: Actions.PAUSE }
}

export function resumeProgram() {
  return { type: Actions.RESUME }
}

export function updateStats(stats) {
  return { type: Actions.TANK_STATS_UPDATE, payload: stats } 
}
