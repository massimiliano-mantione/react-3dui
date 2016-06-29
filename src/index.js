import React from 'react'
import ReactDOM from 'react-dom'
import Konva from 'konva'
import {Layer, Rect, Stage} from '../lib/react-konva'

class MyRect extends React.Component {
  constructor (...args) {
    super(...args)
    this.state = {
      color: 'green'
    }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick () {
    this.setState({
      color: Konva.Util.getRandomColor()
    })
  }
  render () {
    return (
      <Rect
        fill={this.state.color}
        shadowBlur={10}
        onClick={this.handleClick}
        style={this.props.style || {}}
      />
    )
  }
}

var MARGIN = 5
var stageStyle = {}
var layerStyle = {flexDirection: 'column', alignItems: 'stretch', flex: 1}
var shapeStyle = {
  flex: 1,
  margin: MARGIN
}
var shapeStyle2 = {
  flex: 2,
  margin: MARGIN
}

function App () {
  // Stage - is a div wrapper
  // Layer - is a <canvas> element on the page
  // so you can use several canvases. It may help you to improve performance a lot.
  return (
    <Stage width={700} height={700} style={stageStyle}>
      <Layer style={layerStyle}>
          <MyRect style={shapeStyle}/>
          <MyRect style={shapeStyle}/>
          <MyRect style={shapeStyle}/>
          <MyRect style={shapeStyle2}/>
      </Layer>
    </Stage>
  )
}

ReactDOM.render(<App/>, document.getElementById('container'))
