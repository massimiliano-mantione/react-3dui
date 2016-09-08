import React from 'react'
import ReactDOM from 'react-dom'
import {Panel} from 'react-bootstrap'
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

  renderView: function (name, panelId, renderer, width, left) {
    let showPanel = this.state['show' + panelId]
    return (
      <div style={{position: 'absolute', width: width, left: left}}>
        <Panel
            header={
              <div onClick={() => {
                this.togglePanel(panelId)
              }}>
                {showPanel ? name : '?'}
              </div>
            }
            style={{
              margin: 'auto',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              heigth: '100%'
            }}>
          <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                heigth: '100%',
                visibility: showPanel ? 'visible' : 'hidden'
              }}>
            {renderer()}
          </div>
        </Panel>
      </div>
    )
  },

  render: function () {
    return (
      <div style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0}}>
        <div style={{alignItems: 'stretch', position: 'absolute', width: '100%', height: '50%', top: 0, left: 0}}>
          {this.renderView('Canvas in 3d World', 'BabylonKonva', this.renderBabylon, '100%')}
        </div>
        <div style={{position: 'absolute', width: '100%', height: '50%', top: '50%', left: 0}}>
          {this.renderView('2d Canvas', 'Konva', this.renderCanvas, '50%', 0)}
          {this.renderView('DOM', 'DOM', this.renderDOM, '50%', '50%')}
        </div>
      </div>
    )
  }
})

ReactDOM.render(<App/>, document.getElementById('app'))
