import React from 'react'
import SplitPane from 'react-split-pane'
import LayoutWithSidebar from '@containers/LayoutWithSidebar'

import Console from './Console'
import CodeEditor from './CodeEditor'
import Preview from './preview'
import Toolbar from './toolbar'

const HORIZONTAL_SIZE = 640

export default class EditorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      horizontalWidth: null,
    }
  }

  onResize() {
    setTimeout(() => {
      window.dispatchEvent(new Event('ui:resize'))
    }, 1)
    return true
  }

  onHorizontalResize(horizontalWidth) {
    const SIDEBAR_WIDTH = 100
    horizontalWidth = window.innerWidth - SIDEBAR_WIDTH -  horizontalWidth
    this.setState({ horizontalWidth })
    this.onResize()
    return true
  }

  render() {
    return (
      <LayoutWithSidebar>
        <SplitPane primary="first" split="vertical" minSize={480} defaultSize={700} onChange={::this.onHorizontalResize}>
          <SplitPane primary="first" split="horizontal" minSize={480} defaultSize={600} onChange={::this.onResize}>
            <div className="preview-game">
              <Preview />
              <Toolbar />
            </div>
            <Console logs={['Hello world']} />
          </SplitPane>
          <CodeEditor width={this.state.horizontalWidth} />
        </SplitPane>
      </LayoutWithSidebar>
    )
  }
}
