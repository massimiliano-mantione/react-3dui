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
  actualPointerEventHandler: null,
  currentState: null,
  nextState: null,

  handleNextState: function () {
    if (this.currentState !== this.nextState) {
      this.currentState = this.nextState
      this.setState()
    }
  },

  getInitialState: function () {
    this.dispatch = createDispatcher((state) => {
      this.nextState = state
      window.requestAnimationFrame(this.handleNextState)
    })
    return {}
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
    return <BabylonScene
      dispatch={this.dispatch}
      setCanvasCallbacks={this.setActualHandlers}
      pointerEventHandler={(e) => {
        if (typeof this.actualPointerEventHandler === 'function') {
          this.actualPointerEventHandler(e)
        }
      }}/>
  },
  renderCanvas: function () {
    return <TodoCanvasView
      dispatch={this.dispatch}
      canvasHandler={(c) => { this.canvasHandler(c) }}
      drawHandler={() => { this.drawHandler() }}
      pointerEventHandler={(h) => { this.actualPointerEventHandler = h }} />
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
