import React from 'react'
import BABYLON from 'babylonjs'

var BabylonScene = React.createClass({
  propTypes: {
    setCanvasCallbacks: React.PropTypes.func.isRequired
  },

  canvas3d: null,
  canvas2d: null,
  dynamicTexture: null,

  componentDidMount: function () {
    var self = this
    this.props.setCanvasCallbacks(
      (canvas2d) => {
        self.setup(canvas2d)
      },
      () => {
        self.updateDynamicTexture()
      }
    )
  },

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

    // create skybox
    var skybox = BABYLON.Mesh.CreateBox('skyBox', 100.0, scene)
    skybox.renderingGroupId = 0
    var skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene)
    skyboxMaterial.backFaceCulling = false
    skyboxMaterial.disableLighting = true
    skybox.material = skyboxMaterial
    skybox.infiniteDistance = true
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('static/textures/skybox', scene)
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE

    // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
    var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene)
    var sphereMat = new BABYLON.StandardMaterial('sphereMat', scene)
    sphereMat.alpha = 1
    sphereMat.diffuseTexture = new BABYLON.Texture('static/textures/moonmap1k.jpg', scene)
    sphereMat.specularColor = new BABYLON.Color3(0, 0, 0)
    sphere.material = sphereMat
    sphere.renderingGroupId = 1

    // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
    var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene)
    ground.renderingGroupId = 1
    var mat = new BABYLON.StandardMaterial('mat1', scene)
    mat.alpha = 1.0
    mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5)

    var texture = new BABYLON.DynamicTexture('texture1', canvas2d, scene)
    this.dynamicTexture = texture
    mat.diffuseTexture = texture
    mat.diffuseTexture.hasAlpha = true
    ground.material = mat

    function animatePositions () {
      var t = Date.now()
      var p5 = 2 * Math.PI * (t % 5000) / 5000
      var p10 = 2 * Math.PI * (t % 10000) / 10000
      var p20 = 2 * Math.PI * (t % 20000) / 20000
      ground.rotation.x = -((Math.PI / 2) * 0.9)
      ground.rotation.x += Math.sin(p5) * 0.1
      ground.rotation.z = Math.sin(p20) * 0.05

      sphere.rotation.x = Math.PI / 2
      sphere.rotation.y = p5
      sphere.position.x = 4 * Math.sin(p20)
      sphere.position.y = 1 + -2 * Math.cos(p20)
      sphere.position.z = -4 * Math.cos(p20)
    }

    engine.runRenderLoop(function () {
      animatePositions()
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
      <canvas style={{width: '100%', height: '100%'}} ref={(c) => { this.canvas3d = c }} />
    )
  }
})

module.exports = BabylonScene
