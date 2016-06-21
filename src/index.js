import React from 'react'
import ReactDOM from 'react-dom'
import Konva from 'konva'
import {Layer, Rect, Stage} from 'react-konva'

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
        x={10} y={10} width={50} height={50}
        fill={this.state.color}
        shadowBlur={10}
        onClick={this.handleClick}
      />
    )
  }
}

function App () {
  // Stage - is a div wrapper
  // Layer - is a <canvas> element on the page
  // so you can use several canvases. It may help you to improve performance a lot.
  return (
    <Stage width={700} height={700}>
      <Layer>
          <MyRect/>
      </Layer>
    </Stage>
  )
}

ReactDOM.render(<App/>, document.getElementById('container'))
