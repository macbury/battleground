import Actions from '@actions'
import { STATE_RUNNING, STATE_PENDING, STATE_PAUSED } from './consts'

const INITIAL_STATE = {
  loading: true,
  sourceMap: {},
  bytecode: [],
  state: STATE_PENDING,
  logs: [],
  speed: 1,
  health: 100,
  ip: 0,
  power: {
    left: 0,
    max: 0
  },
  error: null
}

export default function (state = INITIAL_STATE, { type, payload }) {
  switch(type) {
    case Actions.LOG_MESSAGE:
      let { logs } = state
      return {...state, logs: [...logs, payload] }
    break

    case Actions.PREVIEW_READY:
      return {...state, loading: false}
    break

    case Actions.TANK_STATS_UPDATE:
      let { power, maxPower, health, ip } = payload 
      return {...state, health, ip, power: { left: power, max: maxPower } }
    break

    case Actions.RUN:
      let { bytecode, sourceMap } = payload
      return { ...INITIAL_STATE, loading: false, bytecode, sourceMap, state: STATE_RUNNING }
    break

    case Actions.MATCH_END:
    case Actions.HALT:
      return { ...state, state: STATE_PENDING, bytecode: [] }
    break

    case Actions.PAUSE:
      return { ...state, state: STATE_PAUSED }
    break

    case Actions.RESUME:
      return { ...state, state: STATE_RUNNING }
    break

    case Actions.CODE_ERROR:
      let { message, codeLocation } = payload
      
      return { ...state, logs: [], state: STATE_PENDING, error: { message, codeLocation } }
    break

    case Actions.EDITOR_RESET:
      return {...INITIAL_STATE}
    break

    default:
      return state
    break
  }
}
