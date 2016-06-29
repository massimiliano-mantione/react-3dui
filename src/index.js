import React from 'react'
import ReactDOM from 'react-dom'
import Konva from 'konva'
import {Layer, Rect, Stage} from '../lib/react-konva'
import React3 from 'react-three-renderer'
import THREE from 'three'

class Simple extends React.Component {
  constructor (props, context) {
    super(props, context)

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.
    this.cameraPosition = new THREE.Vector3(0, 0, 5)

    this.state = {
      cubeRotation: new THREE.Euler()
    }

    this._onAnimate = () => {
      // we will get this callback every frame

      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cubeRotation: new THREE.Euler(
          this.state.cubeRotation.x + 0.1,
          this.state.cubeRotation.y + 0.1,
          0
        )
      })
    }
  }

  render () {
    const width = 300 // canvas width
    const height = 200 // canvas height

    return (<React3
      mainCamera = 'camera' // this points to the perspectiveCamera which has the name set to "camera" below
      width={width}
      height={height}

      onAnimate={this._onAnimate}
    >
      <scene>
        <perspectiveCamera
          name='camera'
          fov={75}
          aspect={width / height}
          near={0.1}
          far={1000}

          position={this.cameraPosition}
        />
        <mesh
          rotation={this.state.cubeRotation}
        >
          <boxGeometry
            width={1}
            height={1}
            depth={1}
          />
          <meshBasicMaterial
            color={0x00ff00}
          />
        </mesh>
      </scene>
    </React3>)
  }
}

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
    <div>
      <Stage width={300} height={200} style={stageStyle}>
        <Layer style={layerStyle}>
            <MyRect style={shapeStyle}/>
            <MyRect style={shapeStyle}/>
            <MyRect style={shapeStyle}/>
            <MyRect style={shapeStyle2}/>
        </Layer>
      </Stage>
      <Simple/>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('container'))
