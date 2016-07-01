import React from 'react'
import ReactDOM from 'react-dom'
import Konva from 'konva'
import {Layer, Stage, Group, Rect, Text} from './react-konva'
import BABYLON from 'babylonjs'
import assign from 'object-assign'

var MyRect = React.createClass({
  getInitialState: function () {
    // FIXME: cannot use construct (used in mixins), but this is not nice
    // setInterval(() => { this.handleClick() }, 2000)
    return { color: 'green' }
  },
  handleClick: function () {
    this.setState({
      color: Konva.Util.getRandomColor()
    })
  },
  render: function () {
    return (
      <Rect
        fill={this.state.color}
        shadowBlur={10}
        onClick={this.handleClick}
        style={this.props.style || {}}
      />
    )
  }
})

var MARGIN = 5
var stageStyle = {}
var layerStyle = {flexDirection: 'column', alignItems: 'stretch', flex: 1}
var lineStyle = {flexDirection: 'row', alignItems: 'stretch', flex: 1}
var textStyle = {
  flex: 1,
  alignItems: 'stretch',
  margin: MARGIN
}
var shapeStyle = {
  flex: 1,
  margin: MARGIN
}
var shapeStyle2 = {
  flex: 2,
  margin: MARGIN
}
var shapeGroupStyle = assign({
  flat: true
}, shapeStyle)

var App2d = React.createClass({
  propTypes: {
    canvasHandler: React.PropTypes.func,
    drawHandler: React.PropTypes.func
  },
  // useCanvas2d, updateDynamicTexture
  // Stage - is a div wrapper
  // Layer - is a <canvas> element on the page
  // so you can use several canvases. It may help you to improve performance a lot.

  // <Circle style={shapeStyle} radius={20} width={40} height={40} fill={'black'}/>

  render: function () {
    return (
      <div>
        <p>Hello</p>
        <Stage width={300} height={200} style={stageStyle}>
          <Layer style={layerStyle} oncanvas={this.props.canvasHandler} ondraw={this.props.drawHandler}>
            <Group style={shapeGroupStyle}>
              <MyRect style={shapeStyle}/>
              <Group style={lineStyle}>
                <Text style={textStyle} text={'Hola!'} fill={'black'} align={'center'} fontSize={24}/>
                <MyRect style={shapeStyle}/>
                <Text style={textStyle} text={'...halo'} fill={'black'} fontSize={24}/>
              </Group>
            </Group>
            <MyRect style={shapeStyle}/>
            <MyRect style={shapeStyle}/>
            <MyRect style={shapeStyle}/>
            <MyRect style={shapeStyle2}/>
          </Layer>
        </Stage>
      </div>
    )
  }
})

var App = React.createClass({
  canvas2d: null,
  dynamicTexture: null,

  setup: function (canvas2d) {
    var canvas3d = document.getElementById('container3d')
    var engine = new BABYLON.Engine(canvas3d, true)

    this.canvas2d = canvas2d

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

    var texture = new BABYLON.DynamicTexture('texture1', canvas2d, scene)
    this.dynamicTexture = texture
    mat.diffuseTexture = texture
    mat.diffuseTexture.hasAlpha = true
    ground.material = mat

    engine.runRenderLoop(function () {
      scene.render()
    })
    window.addEventListener('resize', function () {
      engine.resize()
    })
  },

  updateDynamicTexture: function () {
    if (this.dynamicTexture !== null) {
      this.dynamicTexture.update()
    }
  },

  render: function () {
    return <App2d canvasHandler={(c) => { this.setup(c) }} drawHandler={() => { this.updateDynamicTexture() }} />
  }
})

ReactDOM.render(<App/>, document.getElementById('container2d'))
