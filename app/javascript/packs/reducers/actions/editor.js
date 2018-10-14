import Actions from '@actions'
import Compiler from '@language/compiler'

export function updateCode(code) {
  return function(dispatch) {
    dispatch({ type: Actions.CODE_CHANGED, payload: code })
  }
}

export function resetEditor() {
  return { type: Actions.EDITOR_RESET }
}

export function compile(content) {
  let compiler = new Compiler()
  try {
    let bytecode = compiler.compile(content)
    let { sourceMap, code } = bytecode.toProgram()
    return { type: Actions.CODE_COMPILED, payload: { sourceMap, code } }
  } catch (e) {
    let { message, codeLocation } = e
    return { type: Actions.CODE_ERROR, payload: { message, codeLocation } }
  }
}
