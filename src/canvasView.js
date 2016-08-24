import React from 'react'
import {Layer, Stage} from './react-konva'
import {Styler} from 'debonair'
let createStyler = Styler.create
import TodoCanvasView from './todoCanvasView'

let stageStyler = createStyler({})
let flexStyler = createStyler({flex: 1})

var CanvasView = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    canvasHandler: React.PropTypes.func,
    drawHandler: React.PropTypes.func
  },

  render: function () {
    return (
      <Stage width={300} height={200} style={stageStyler()}>
        <Layer style={flexStyler()} oncanvas={this.props.canvasHandler} ondraw={this.props.drawHandler}>
          <TodoCanvasView dispatch = {this.props.dispatch}/>
        </Layer>
      </Stage>
    )
  }
})

module.exports = CanvasView
