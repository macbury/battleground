import Actions from '@actions'

export function matchEnd(winnerId) {
  return { type: Actions.MATCH_END, payload: winnerId }
}
