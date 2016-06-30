import React from 'react'
import ReactDOM from 'react-dom'
import Konva from 'konva'
import {Layer, Rect, Stage} from './react-konva'
import BABYLON from 'babylonjs'

class MyRect extends React.Component {
  constructor (...args) {
    super(...args)
    this.state = {
      color: 'green'
    }
    this.handleClick = this.handleClick.bind(this)
    setInterval(this.handleClick, 2000)
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
    <div>
      <p>Hello</p>
      <Stage width={300} height={200} style={stageStyle}>
        <Layer style={layerStyle}>
            <MyRect style={shapeStyle}/>
            <MyRect style={shapeStyle}/>
            <MyRect style={shapeStyle}/>
            <MyRect style={shapeStyle2}/>
        </Layer>
      </Stage>
    </div>
  )
}

var canvas3d = document.getElementById('container3d')
var engine = new BABYLON.Engine(canvas3d, true)

var createScene = function() {
  // create a basic BJS Scene object
  var scene = new BABYLON.Scene(engine)

  // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
  var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
  // target the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero())
  // attach the camera to the canvas
  camera.attachControl(canvas3d, false)

  // create a basic light, aiming 0,1,0 - meaning, to the sky
  new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene)

  // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
  var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene)

  // move the sphere upward 1/2 of its height
  sphere.position.y = 1

  // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
  var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene)

  // return the created scene
  return scene
}

var scene = createScene()
engine.runRenderLoop(function () {
  scene.render()
})
window.addEventListener('resize', function () {
  engine.resize()
})

ReactDOM.render(<App/>, document.getElementById('container2d'))
