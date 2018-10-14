import React from 'react'
import ReactDOM from 'react-dom'
import MonacoEditor from 'react-monaco-editor'
import _ from 'underscore'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { updateCode, compile, resetEditor } from '@actions/editor'
import { STATE_PENDING } from '@reducers/consts'

const OPTIONS = {
  selectOnLineNumbers: true,
  fontSize: 16,
  autoClosingBrackets: true,
  autoIndent: true,
  matchBrackets: true,
  glyphMargin: true,
  minimap: {
    enabled: false
  },
  showFoldingControls: 'always',
  useTabStops: false
}

class CodeEditor extends React.Component {
  oldDecorations = []

  editorDidMount(editor, monaco) {
    this.editor = editor
    editor.getModel().updateOptions({ tabSize: 2 })

    this.throttledCompile = _.throttle(this.props.compile, 1000)
  }

  onChange(newVal, e) {
    this.props.updateCode(newVal)
    this.throttledCompile(newVal)
  }

  updateEditor() {
    if (this.editor != null) {
      this.editor.layout()
    }
    this.forceUpdate()
  }

  componentDidMount() {
    window.addEventListener('resize', ::this.updateEditor)
    //window.addEventListener('ui:resize', ::this.updateEditor)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', ::this.updateEditor) 
    //window.removeEventListener('ui:resize', ::this.updateEditor) 
    this.props.resetEditor()
  }

  renderErrors() {
    if (this.editor == null) {
      return
    }
    
    let { error } = this.props
    if (error && error.codeLocation) {
      let { codeLocation } = error
      let { lineNum } = codeLocation

      this.oldDecorations = this.editor.deltaDecorations(this.oldDecorations, [
        {
          range: new monaco.Range(lineNum,1,lineNum,1),
          options: {
            isWholeLine: true,
            className: 'error-content',
            glyphMarginClassName: 'error-glyph',
            automaticLayout: true,
          }
        }
      ])
    } else {
      this.oldDecorations = this.editor.deltaDecorations(this.oldDecorations, [])
    }
  }

  get containerStyle() {
    let { width } = this.props
    return {
      width: width ? `${width}px` : '100%',
      height: '100%'
    }
  }

  render() {
    let { content, error } = this.props
    return (
      <div className="preview-editor-container">
        <div style={this.containerStyle}>
          <MonacoEditor
            language="TankLang"
            theme="vs-dark"
            value={content}
            options={OPTIONS}
            onChange={::this.onChange}
            editorDidMount={::this.editorDidMount}
          />
        </div>
      </div>
    )
  }

  componentDidUpdate() {
    let { state } = this.props
    let readOnly = state != STATE_PENDING
    if (this.editor != null) {
      this.editor.layout()
      this.renderErrors()
      this.editor.updateOptions({ readOnly })
    }
  }
}

function mapStateToProps({ editor, testing }) {
  let { content, error, bytecode, sourceMap } = editor
  let { state } = testing
  return { content, error, state }
}

function mapActions(dispatch) {
  return bindActionCreators({ updateCode, compile, resetEditor }, dispatch)
}

export default connect(mapStateToProps, mapActions)(CodeEditor)
