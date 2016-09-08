import React from 'react'
import BABYLON from 'babylonjs'

var BabylonScene = React.createClass({
  propTypes: {
    setCanvasCallbacks: React.PropTypes.func.isRequired,
    pointerEventHandler: React.PropTypes.func.isRequired,
    useVrCamera: React.PropTypes.bool.isRequired
  },

  canvas3d: null,
  canvas2d: null,
  dynamicTexture: null,
  engine: null,
  scene: null,
  guiMesh: null,
  camera: null,
  pointerX: 0,
  pointerY: 0,
  isShiftPressed: false,
  pointerMovedWithShiftPressed: false,

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
    this.engine = engine

    this.canvas2d = canvas2d

    // create a basic BJS Scene object
    var scene = new BABYLON.Scene(engine)
    this.scene = scene

    // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
    this.camera = camera
    // target the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero())
    // attach the camera to the canvas
    camera.attachControl(canvas3d, true)

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
    this.guiMesh = ground
    ground.renderingGroupId = 1
    var mat = new BABYLON.StandardMaterial('mat1', scene)
    mat.alpha = 1.0
    mat.emissiveColor = new BABYLON.Color3(0.4, 0.4, 0.4)

    var texture = new BABYLON.DynamicTexture('texture1', canvas2d, scene)
    this.dynamicTexture = texture
    mat.diffuseTexture = texture
    mat.diffuseTexture.hasAlpha = true
    ground.material = mat

    scene.onPointerObservable.add((e) => {
      if (e.type === BABYLON.PointerEventTypes.POINTERMOVE) {
        let px = e.event.layerX
        let py = e.event.layerY
        let picked = this.scene.pick(px, py, (m) => { return m === this.guiMesh }, false, this.camera)
        if (picked.hit && picked.pickedMesh === this.guiMesh) {
          let point2d = picked.getTextureCoordinates()
          let x2d = point2d.x * canvas2d.width
          let y2d = (1 - point2d.y) * canvas2d.height
          this.pointerX = x2d
          this.pointerY = y2d
          this.props.pointerEventHandler({
            type: 'pointermove3d',
            x: x2d,
            y: y2d,
            buttons: this.isShiftPressed ? 1 : 0
          })
          e.event.preventDefault()
          // camera.inputs.attached.mouse.detachControl()
        } else {
          // camera.inputs.attached.mouse.attachControl()
        }
      }
    })

    function animatePositions () {
      var t = Date.now()
      var p5 = 2 * Math.PI * (t % 5000) / 5000
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

  onCanvas3d: function (c) {
    c.addEventListener('mouseover', (e) => {
      this.focus()
    })
    c.addEventListener('mouseout', (e) => {
      this.blur()
    })
    this.canvas3d = c
  },

  keyPressHandler: function (e) {
    let {dispatch} = this.props
    this.isShiftPressed = e.shiftKey
    if (e.keyCode === 13) {
      dispatch('addCurrent')
    } else if (e.keyCode === 8) {
      dispatch('removeLastTextCharacter')
      e.preventDefault()
      e.stopPropagation()
      return false
    } else if (e.key === 'Shift') {
      this.props.pointerEventHandler({
        type: 'pointerpick3d',
        x: this.pointerX,
        y: this.pointerY,
        buttons: 1
      })
    } else if (e.key.length === 1) {
      dispatch('appendText', e.key)
    }
  },
  focus: function () {
    document.body.addEventListener('keydown', this.keyPressHandler)
  },
  blur: function () {
    document.body.removeEventListener('keydown', this.keyPressHandler)
  },

  render: function () {
    return (
      <canvas width={1400} height={450} ref={this.onCanvas3d} />
    )
  }
})

module.exports = BabylonScene
