import Actions from '@actions'

const INITIAL_STATE = {
  content: "loop { rotateCannon(-90); fire(); }",
  sourceMap: {},
  bytecode: [],
  error: null
}

export default function (state = INITIAL_STATE, { type, payload }) {
  switch(type) {
    case Actions.CODE_CHANGED:
      return { ...state, content: payload }
    break

    case Actions.CODE_COMPILED:
      let { code, sourceMap } = payload
      return { ...state, bytecode: code, sourceMap, error: null }
    break

    case Actions.RUN:
      return { ...state, error: null }
    break

    case Actions.CODE_ERROR:
      let { message, codeLocation, ip } = payload
      if (state.sourceMap && state.sourceMap[ip]) {
        let newCodeLocation = state.sourceMap[ip]
        let newMessage = `${message} at line ${newCodeLocation.lineNum}`
        return { ...state, bytecode: [], sourceMap: {}, error: { message: newMessage, codeLocation: newCodeLocation } }
      } else {
        return { ...state, bytecode: [], sourceMap: {}, error: { message, codeLocation } }
      }
    break

    case Actions.EDITOR_RESET:
      return {...INITIAL_STATE}
    break
    
    default:
      return state
    break
  }
}
