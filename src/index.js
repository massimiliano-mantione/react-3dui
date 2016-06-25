import React from 'react'
import ReactDOM from 'react-dom'
import Konva from 'konva'
import {Layer, Rect, Stage} from '../lib/react-konva'
import {Akkad, Scene, cameras, lights, shapes} from 'akkad'

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

const {ArcRotateCamera} = cameras
const {HemisphericLight} = lights
const {Box} = shapes

class App3d extends React.Component {
  render () {
    return (
      <Akkad>
        <Scene>
          <ArcRotateCamera
            position={[3, 4, -5]}
            target={[0, 1, 0]}
          />
          <HemisphericLight />
          <Box />
        </Scene>
      </Akkad>
    )
  }
}

function App () {
  // Stage - is a div wrapper
  // Layer - is a <canvas> element on the page
  // so you can use several canvases. It may help you to improve performance a lot.
  return (
    <div>
      <Stage width={300} height={300} style={stageStyle}>
        <Layer style={layerStyle}>
            <MyRect style={shapeStyle}/>
            <MyRect style={shapeStyle}/>
            <MyRect style={shapeStyle}/>
            <MyRect style={shapeStyle2}/>
        </Layer>
      </Stage>
      <App3d/>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('container'))
