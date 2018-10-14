import Actions from '@actions'

const INITIAL_STATE = {
  winner: null
}

export default function (state = INITIAL_STATE, { type, payload }) {
  switch(type) {
    case Actions.CODE_ERROR:
    case Actions.RUN:
      return {...INITIAL_STATE}
    case Actions.MATCH_END:
      return { winner: payload }
    default:
      return state
  }
}
