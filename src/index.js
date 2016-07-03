import React from 'react'
import ReactDOM from 'react-dom'
import TestComponent from './testComponent'
import BabylonScene from './babylonScene'

var App = React.createClass({
  actualCanvasHandler: null,
  actualDrawHandler: null,

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
      <div>
        <BabylonScene setCanvasCallbacks={this.setActualHandlers} />
        <TestComponent canvasHandler={(c) => { this.canvasHandler(c) }} drawHandler={() => { this.drawHandler() }} />
      </div>
    )
  }
})

ReactDOM.render(<App/>, document.getElementById('app'))
