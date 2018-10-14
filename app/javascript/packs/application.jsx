require("@styles")

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router-dom'

import { store, history } from '@reducers'

import EditorPage from '@pages/editor'
import DocsPage from '@pages/docs'

document.addEventListener('DOMContentLoaded', () => {
  const spinner = document.querySelector('#main-spinner')
  spinner.remove()
  
  const root = document.querySelector('#root')

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/" component={EditorPage} />
          <Route exact path="/documentation" component={DocsPage} />
        </Switch>
      </ConnectedRouter>
    </Provider>, root
  )
})
