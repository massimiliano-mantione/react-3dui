import React from 'react'
import ReactDOM from 'react-dom'
import TestComponent from './testComponent'
import BabylonScene from './babylonScene'
import TodoApp from './todoApp'

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
      <div className={'container row'}>
        <div className={'container column'}>
          <p>Babylon</p>
          <BabylonScene setCanvasCallbacks={this.setActualHandlers} />
        </div>
        <div className={'container column'}>
          <p>Canvas</p>
          <TestComponent canvasHandler={(c) => { this.canvasHandler(c) }} drawHandler={() => { this.drawHandler() }} />
        </div>
        <div className={'container column'}>
          <p>DOM</p>
          <TodoApp/>
        </div>
      </div>
    )
  }
})

ReactDOM.render(<App/>, document.getElementById('app'))
