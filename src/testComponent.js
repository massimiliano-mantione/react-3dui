import React from 'react'
import Konva from 'konva'
import {Layer, Stage, Group, Rect, Circle, Text} from './react-konva'
import {Styler} from 'debonair'
let createStyler = Styler.create

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

let stageStyler = createStyler({})
let flexStyler = createStyler({flex: 1})
let containerStyler = createStyler(flexStyler, {alignItems: 'stretch'})
let verticalStyler = createStyler(flexStyler, {flexDirection: 'column'})
let horizontalStyler = createStyler(flexStyler, {flexDirection: 'row'})
let marginStyler = createStyler({margin: 5})
let textStyler = createStyler(containerStyler, marginStyler)
let shapeStyler1 = createStyler(marginStyler, {flex: 1})
let shapeStyler2 = createStyler(marginStyler, {flex: 2})
let flatStyler = createStyler(flexStyler, {flat: true})

var TestComponent = React.createClass({
  propTypes: {
    canvasHandler: React.PropTypes.func,
    drawHandler: React.PropTypes.func
  },
  // useCanvas2d, updateDynamicTexture
  // Stage - is a div wrapper
  // Layer - is a <canvas> element on the page
  // so you can use several canvases. It may help you to improve performance a lot.

  // <Rect style={shapeStyler1()} x={10} y={10} width={200} height={30} fill={'red'}/>
  // <Text style={textStyler()} text={'Hola!'} fill={'black'} align={'center'} fontSize={8}/>
  // <Rect style={shapeStyler1()} fill={'blue'}/>
  // <Text style={textStyler()} text={'...halo'} fill={'black'} fontSize={8}/>
  // <Group style={flatStyler({autoClip: true})}>
  //   <Rect style={flexStyler({left: 5, top: 5, right: -5, bottom: -5})} fill={'red'} />
  // <Rect style={shapeStyler1({left: 0, width: 40})}/>
  // <Rect style={shapeStyler1({left: 80, width: 40})}/>
  // <Rect style={shapeStyler1({left: 40, width: 40})}/>
  // <Rect style={shapeStyler1({left: 120, width: 40})}/>
  // </Group>

  render: function () {
    return (
      <div>
        <p>Hello</p>
        <Stage width={600} height={400} style={stageStyler()}>
          <Layer style={verticalStyler()} oncanvas={this.props.canvasHandler} ondraw={this.props.drawHandler}>
            <Group style={flatStyler({autoClip: true})}>
              <Circle fill={'black'} stroke={'red'} radius={5} x={0} y={10} />
              <Circle fill={'black'} stroke={'red'} radius={10} x={10} y={0} />
              <Circle fill={'black'} stroke={'red'} radius={5} x={300} y={10} />
              <Circle fill={'black'} stroke={'red'} radius={10} x={300} y={0} />
              <Group x={0} y={0} width={300} height={300}>
                <Group style={horizontalStyler()} x={5} y={5} width={200} height={30}>
                  <Text style={textStyler()} text={'Hola!'} fill={'black'} align={'center'} fontSize={14}/>
                  <Rect style={shapeStyler1()} fill={'blue'}/>
                  <Text style={textStyler()} text={'...halo'} fill={'black'} fontSize={14}/>
                </Group>
              </Group>
            </Group>
            <Group style={flatStyler({autoClip: true})}>
              <Rect style={flexStyler()} fill={'yellow'} />
              <Group style={flatStyler({left: -10})}>
                <Rect style={flexStyler({left: 0, width: 40})} fill={'blue'}/>
                <Rect style={flexStyler({left: 40, width: 40})} fill={'red'}/>
                <Rect style={flexStyler({left: 80, width: 40})} fill={'black'}/>
                <Rect style={flexStyler({left: 120, width: 40})} fill={'white'}/>
              </Group>
            </Group>
            <Group style={flatStyler({autoClip: true})}>
              <Rect style={flexStyler()} fill={'green'} />
              <Group style={flatStyler({proportionalRight: 0, proportionalRightAnchor: 0, width: 160})}>
                <Rect style={flexStyler({left: 0, width: 40})} fill={'blue'}/>
                <Rect style={flexStyler({left: 40, width: 40})} fill={'red'}/>
                <Rect style={flexStyler({left: 80, width: 40})} fill={'black'}/>
                <Rect style={flexStyler({left: 120, width: 40})} fill={'white'}/>
              </Group>
            </Group>
            <MyRect style={shapeStyler1()}/>
            <MyRect style={shapeStyler1()}/>
            <MyRect style={shapeStyler2()}/>
          </Layer>
        </Stage>
      </div>
    )
  }
})

module.exports = TestComponent
