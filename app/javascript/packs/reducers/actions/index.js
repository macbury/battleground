import createActions from 'redux-actions-generator'

export default createActions('', [
  'MATCH_END', 
  'LOG_MESSAGE',
  'EDITOR_RESET',
  'PREVIEW_READY',
  'TANK_STATS_UPDATE',
  'CODE_CHANGED',
  'CODE_COMPILED',
  'CODE_ERROR',
  'RUN',
  'PAUSE',
  'RESUME',
  'HALT'
])
