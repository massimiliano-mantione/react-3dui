import React from 'react'
import ReactDOM from 'react-dom'
import {createDispatcher} from './todoLogic'
import BabylonScene from './babylonScene'
import CanvasView from './canvasView'
import TodoDomView from './todoDomView'

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

  render: function () {
    return (
      <div className={'container row'}>
        <div className={'container column'}>
          <p>Babylon</p>
          <BabylonScene setCanvasCallbacks={this.setActualHandlers} />
        </div>
        <div className={'container column'}>
          <p>Canvas</p>
          <CanvasView dispatch={this.dispatch} canvasHandler={(c) => { this.canvasHandler(c) }} drawHandler={() => { this.drawHandler() }} />
        </div>
        <div className={'container column'}>
          <p>DOM</p>
          <TodoDomView dispatch={this.dispatch}/>
        </div>
      </div>
    )
  }
})

ReactDOM.render(<App/>, document.getElementById('app'))
