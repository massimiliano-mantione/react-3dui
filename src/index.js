import React from 'react'
import ReactDOM from 'react-dom'
import TestComponent from './testComponent'
import BABYLON from 'babylonjs'

var App = React.createClass({
  canvas3d: null,
  canvas2d: null,
  dynamicTexture: null,

  setup: function (canvas2d) {
    var canvas3d = this.canvas3d
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
    return (
      <div>
        <canvas style={{width: 600, height: 400}} ref={(c) => { this.canvas3d = c }} />
        <TestComponent canvasHandler={(c) => { this.setup(c) }} drawHandler={() => { this.updateDynamicTexture() }} />
      </div>
    )
  }
})

ReactDOM.render(<App/>, document.getElementById('app'))
