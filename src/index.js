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
  panelState: {
    showDOM: false,
    showKonva: false,
    showBabylonKonva: false,
    showBabylon3d: false,
    showVR: false
  },
  panelStateChanged: false,

  togglePanel: function (panelId) {
    let newPanelState = {
      showDOM: this.panelState.showDOM,
      showKonva: this.panelState.showKonva,
      showBabylonKonva: this.panelState.showBabylonKonva,
      showBabylon3d: this.panelState.showBabylon3d,
      showVR: this.panelState.showVR
    }
    newPanelState['show' + panelId] = !newPanelState['show' + panelId]
    this.panelState = newPanelState
    this.panelStateChanged = true
    window.requestAnimationFrame(this.handleNextState)
  },

  handleNextState: function () {
    if (this.currentState !== this.nextState || this.panelStateChanged) {
      this.panelStateChanged = false
      this.currentState = this.nextState
      this.setState(this.panelState)
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

  renderFake: function () {
    return <div>FAKE</div>
  },

  renderView: function (name, panelId, renderer, md) {
    let showPanel = this.state['show' + panelId]
    return (
      <Col md={md} style={{display: 'flex', flexDirection: 'column'}}>
        <Panel fill
            header={
              <div onClick={() => {
                this.togglePanel(panelId)
              }}>
                {showPanel ? name : '?'}
              </div>
            }
            style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          {renderer()}
          {showPanel ? null : <div style={{backgroundColor: '#e0e0e0', position: 'absolute', top: '20%', left: 0, width: '100%', height: '80%'}}></div>}
        </Panel>
      </Col>
    )
  },

  render: function () {
    return (
      <Col>
        <Row className={'show-grid'} style={{display: 'flex', flexWrap: 'wrap'}}>
          {this.renderView('2d Canvas in 3d world', 'BabylonKonva', this.renderBabylon, 4)}
          {this.renderView('2d Canvas', 'Konva', this.renderCanvas, 4)}
          {this.renderView('DOM', 'DOM', this.renderDOM, 4)}
        </Row>
        <Row className={'show-grid'} style={{display: 'flex', flexWrap: 'wrap'}}>
          {this.renderView('FAKE1', 'Babylon3d', this.renderFake, 4)}
          {this.renderView('FAKE2', 'VR', this.renderFake, 8)}
        </Row>
      </Col>
    )
  }
})

ReactDOM.render(<App/>, document.getElementById('app'))
