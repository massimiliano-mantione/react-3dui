import React from 'react'
import ReactDOM from 'react-dom'
import {Row, Col, Panel} from 'react-bootstrap'
import {createDispatcher} from './todoLogic'
import BabylonScene from './babylonScene'
import TodoCanvasView from './todoCanvasView'
import TodoDomView from './todoDomView'

require('./bootstrap.min.css')
require('./bootstrap-theme.min.css')

var App = React.createClass({
  actualCanvasHandler: null,
  actualDrawHandler: null,

  getInitialState: function () {
    this.dispatch = createDispatcher((state) => this.setState(state))
    return this.dispatch('getState')
  },

  canvasHandler: function (canvas2d) {
    this.actualCanvasHandler(canvas2d)
  },
  drawHandler: function () {
    this.actualDrawHandler()
  },

  setActualHandlers: function (canvasHandler, drawHandler) {
    this.actualCanvasHandler = canvasHandler
    this.actualDrawHandler = drawHandler
  },

  renderBabylon: function () {
    return <BabylonScene setCanvasCallbacks={this.setActualHandlers} />
  },
  renderCanvas: function () {
    return <TodoCanvasView dispatch={this.dispatch} canvasHandler={(c) => { this.canvasHandler(c) }} drawHandler={() => { this.drawHandler() }} />
  },
  renderDOM: function () {
    return <TodoDomView dispatch={this.dispatch}/>
  },

  renderView: function (name, renderer) {
    return (
      <Col md={4} style={{display: 'flex', flexDirection: 'column'}}>
        <Panel fill header={name} style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          {renderer()}
        </Panel>
      </Col>
    )
  },

  render: function () {
    return (
      <Col>
        <Row className={'show-grid'} style={{display: 'flex', flexWrap: 'wrap'}}>
            {this.renderView('Babylon', this.renderBabylon)}
            {this.renderView('Canvas', this.renderCanvas)}
            {this.renderView('DOM', this.renderDOM)}
        </Row>
      </Col>
    )
  }
})

ReactDOM.render(<App/>, document.getElementById('app'))
