import React from 'react'
import ReactDOM from 'react-dom'
import LayoutWithSidebar from '@containers/LayoutWithSidebar'

import varDocs from './variables.md'
import functionDocs from './function.md'
import stdlibDocs from './stdlib.md'

export default class DocsPage extends React.Component {
  render() {
    return (
      <LayoutWithSidebar>
        <div className="row">
          <div className="col-lg" dangerouslySetInnerHTML={{__html: varDocs}}></div>
        </div>
        <div className="row">
          <div className="col-lg" dangerouslySetInnerHTML={{__html: functionDocs}}></div>
        </div>
        <div className="row">
          <div className="col-lg" dangerouslySetInnerHTML={{__html: stdlibDocs}}></div>
        </div>
      </LayoutWithSidebar>
    )
  }
}
