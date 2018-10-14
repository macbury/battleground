import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { reducer as form } from 'redux-form'

import thunkMiddleware from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'

import editor from './editor'
import testing from './testing'
import match from './match'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const history = createHistory()
const reducers = combineReducers({
  form,
  editor,
  testing,
  match
})

const middlewares = applyMiddleware(
  routerMiddleware(history),
  thunkMiddleware
)

const store = createStore(connectRouter(history)(reducers), composeEnhancers(middlewares))

export { store, history }
