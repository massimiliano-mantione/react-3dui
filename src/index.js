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
        <Layer style={layerStyle} canvasHandler={useCanvas2d} drawHandler={updateDynamicTexture}>
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

var canvas2d = null
var dynamicTexture = null

var createScene = function () {
  // create a basic BJS Scene object
  var scene = new BABYLON.Scene(engine)

  // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
  var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
  // target the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero())
  // attach the camera to the canvas
  camera.attachControl(canvas3d, false)

  // create a basic light, aiming 0,1,0 - meaning, to the sky
  var light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)
  light1.diffuse = new BABYLON.Color3(1, 1, 1)
  light1.specular = new BABYLON.Color3(1, 1, 1)
  light1.groundColor = new BABYLON.Color3(0, 0, 0)

  // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
  var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene)
  sphere.position.y = 1

  // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
  var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene)
  var mat = new BABYLON.StandardMaterial('mat1', scene)
  mat.alpha = 1.0
  mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5)

  console.log('CANVAS', canvas2d)

  var texture = new BABYLON.DynamicTexture('texture1', canvas2d, scene)
  dynamicTexture = texture
  mat.diffuseTexture = texture
  // mat.diffuseTexture.hasAlpha = true
  ground.material = mat

  // return the created scene
  return scene
}

function useCanvas2d (canvas) {
  canvas2d = canvas
  var scene = createScene()
  engine.runRenderLoop(function () {
    scene.render()
  })
  window.addEventListener('resize', function () {
    engine.resize()
  })
}
function updateDynamicTexture () {
  if (dynamicTexture !== null) {
    dynamicTexture.update()
  }
}

ReactDOM.render(<App/>, document.getElementById('container2d'))
