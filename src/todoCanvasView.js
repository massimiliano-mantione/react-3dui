import React from 'react'
import {Layer, Stage, Group, Rect, Text} from './react-konva'
import {Styler} from 'debonair'

import {listElementScale, listElementPosition} from './listElementScale'

const ROW_HEIGTH = 25
const LINE_HEIGTH = 30
const GAP_HEIGTH = 10
const LIST_SIZE = 3.50
const LIST_HEIGTH = LIST_SIZE * ROW_HEIGTH
const HEADER_HEIGTH = LINE_HEIGTH
const FOOTER_HEIGTH = LINE_HEIGTH
const PANEL_WIDTH = 300
const PANEL_HEIGTH = HEADER_HEIGTH + LIST_HEIGTH + FOOTER_HEIGTH + (3 * GAP_HEIGTH)

const BACKGROUND_COLOR = '#FFFFFF'
const BACKGROUND_LINE_COLOR = '#808080'
const TEXT_COLOR = '#000000'
const OVER_COLOR = '#C0C0C0'
const CLICK_COLOR = '#404040'

let createStyler = Styler.create

let stageStyler = createStyler({})
let flexStyler = createStyler({flex: 1})
let containerStyler = createStyler(flexStyler, {alignItems: 'stretch'})
let rowStyler = createStyler(containerStyler, {flexDirection: 'row'})
let panelItemStyler = createStyler(containerStyler)

let PanelRow = React.createClass({
  propTypes: {
    y: React.PropTypes.number.isRequired,
    scaleY: React.PropTypes.number,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    overFill: React.PropTypes.string,
    overStroke: React.PropTypes.string,
    onClick: React.PropTypes.func,
    onMousemove: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      mouseIsOver: false,
      mouseIsClicked: false
    }
  },

  render: function () {
    let {y, scaleY, width, height, fill, overFill, stroke, overStroke, children, onClick, onMousemove} = this.props
    if (scaleY === undefined) {
      scaleY = 1
    }
    if (fill === undefined) {
      fill = 'white'
    }
    if (overFill === undefined) {
      overFill = fill
    }
    if (stroke === undefined) {
      stroke = 'black'
    }
    if (overStroke === undefined) {
      overStroke = stroke
    }
    let listening = (typeof onClick === 'function') || (typeof onMousemove === 'function')

    let onMouseInEvent = (e) => {
      let newState = {
        mouseIsOver: true,
        mouseIsClicked: e.evt.buttons === 1
      }
      if (this.state.mouseIsOver !== newState.mouseIsOver || this.state.mouseIsClicked !== newState.mouseIsClicked) {
        this.setState(newState)
      }
    }
    let onMouseOutEvent = (e) => {
      let newState = {
        mouseIsOver: false,
        mouseIsClicked: false
      }
      if (this.state.mouseIsOver !== newState.mouseIsOver || this.state.mouseIsClicked !== newState.mouseIsClicked) {
        this.setState(newState)
      }
    }

    if (this.state.mouseIsOver) {
      stroke = overStroke
    }
    if (this.state.mouseIsClicked) {
      fill = overFill
    }

    return (
      <Group y={y} scaleY={scaleY}>
        <Rect
          onClick={onClick}
          onMousedown={onMouseInEvent}
          onMouseup={onMouseInEvent}
          onMousemove={(e) => {
            if (typeof onMousemove === 'function') {
              onMousemove(e)
            }
            onMouseInEvent(e)
          }}
          onMouseout={onMouseOutEvent}
          listening={listening}
          fill={fill}
          stroke={stroke}
          height={height}
          width={width}
          cornerRadius={5}/>
        <Group style={containerStyler({height: height, width: width})}>
          {children}
        </Group>
      </Group>
    )
  }
})

let PanelHeader = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func
  },
  render: function () {
    let {children, onClick} = this.props
    return (
      <PanelRow onClick={onClick} y={GAP_HEIGTH} fill={BACKGROUND_LINE_COLOR} overFill={CLICK_COLOR} stroke={BACKGROUND_LINE_COLOR} overStroke={OVER_COLOR} height={HEADER_HEIGTH} width={PANEL_WIDTH}>
        {children}
      </PanelRow>
    )
  }
})
let PanelFooter = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func,
    y: React.PropTypes.number.isRequired
  },
  render: function () {
    let {y, children, onClick} = this.props
    return (
      <PanelRow onClick={onClick} y={y} fill={BACKGROUND_LINE_COLOR} overFill={CLICK_COLOR} stroke={BACKGROUND_LINE_COLOR} overStroke={OVER_COLOR} height={HEADER_HEIGTH} width={PANEL_WIDTH}>
        {children}
      </PanelRow>
    )
  }
})
let PanelBody = React.createClass({
  propTypes: {
    y: React.PropTypes.number.isRequired,
    onMousemove: React.PropTypes.func
  },
  render: function () {
    let {y, onMousemove, children} = this.props
    return (
      <PanelRow y={y} onMousemove={onMousemove} fill={BACKGROUND_COLOR} stroke={BACKGROUND_LINE_COLOR} height={LIST_HEIGTH} width={PANEL_WIDTH}>
        {children}
      </PanelRow>
    )
  }
})

let HeaderText = React.createClass({
  propTypes: {
    text: React.PropTypes.string.isRequired,
    align: React.PropTypes.string
  },
  render: function () {
    let {text, align} = this.props
    if (typeof align !== 'string') {
      align = 'center'
    }
    if (align === 'left') {
      text = ' ' + text
    }
    if (align === 'right') {
      text = text + ' '
    }
    let fontSize = 16
    return (
      <Text listening={false} style={panelItemStyler()} text={text} fill={TEXT_COLOR} align={align} fontSize={fontSize} offsetY={(fontSize / 2) - (LINE_HEIGTH / 2)}/>
    )
  }
})
let TodoText = React.createClass({
  propTypes: {
    text: React.PropTypes.string.isRequired,
    align: React.PropTypes.string
  },
  render: function () {
    let {text, align} = this.props
    if (typeof align !== 'string') {
      align = 'center'
    }
    if (align === 'left') {
      text = ' ' + text
    }
    if (align === 'right') {
      text = text + ' '
    }
    let fontSize = 14
    return (
      <Text listening={false} style={panelItemStyler()} text={text} fill={TEXT_COLOR} align={align} fontSize={fontSize} offsetY={(fontSize / 2) - (ROW_HEIGTH / 2)}/>
    )
  }
})

let TodoElement = React.createClass({
  propTypes: {
    y: React.PropTypes.number.isRequired,
    scale: React.PropTypes.number.isRequired,
    todo: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    onMousemove: React.PropTypes.func
  },

  render: function () {
    let {y, scale, todo, dispatch, onMousemove} = this.props
    let clickHandler = () => dispatch('toggle', todo.id)
    return (
      <PanelRow onClick={clickHandler} onMousemove={onMousemove} y={y} scaleY={scale} fill={BACKGROUND_COLOR} overFill={OVER_COLOR} stroke={BACKGROUND_LINE_COLOR} overStroke={OVER_COLOR} height={ROW_HEIGTH} width={PANEL_WIDTH}>
        <Group style={rowStyler()} height={ROW_HEIGTH}>
          <TodoText text={todo.text} align={'left'}/>
          <TodoText text={todo.done ? '\u2713' : '\u2613 '} align={'right'}/>
        </Group>
      </PanelRow>
    )
  }
})

let TodoPanel = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired
  },

  previousMouseY: -1,
  onMousemove: function (e, dispatch) {
    if (e.evt.buttons === 1) {
      let y = e.evt.layerY
      if (this.previousMouseY >= 0 && y > 0) {
        let delta = y - this.previousMouseY
        dispatch('moveScroll', -delta / ROW_HEIGTH, LIST_SIZE)
      }
      this.previousMouseY = y
    }
  },

  panelChildren: function (state, dispatch, panel) {
    let children = state.todos.reduce((todos, todo, todoIndex) => {
      let scale = listElementScale(LIST_SIZE, state.scroll, todoIndex)
      let normalizedY = listElementPosition(LIST_SIZE, state.scroll, todoIndex)
      let y = normalizedY * ROW_HEIGTH
      if (scale > 0) {
        todos.push(<TodoElement todo={todo} dispatch={dispatch} onMousemove={(e) => { panel.onMousemove(e, dispatch) }} key={todo.id} scale={scale} y={y}/>)
      }
      return todos
    }, [])
    return children
  },

  render: function () {
    let panel = this
    let dispatch = this.props.dispatch
    let clickHandler = () => dispatch('removeDone')
    let state = this.props.dispatch('getState')

    return (
      <Group>
        <PanelHeader>
          <HeaderText text={state.text} align={'left'}/>
        </PanelHeader>
        <PanelBody y={HEADER_HEIGTH + (2 * GAP_HEIGTH)} onMousemove={(e) => { panel.onMousemove(e, dispatch) }}>
          {
            panel.panelChildren(state, dispatch, panel)
          }
        </PanelBody>
        <PanelFooter onClick={clickHandler} y={HEADER_HEIGTH + LIST_HEIGTH + (3 * GAP_HEIGTH)}>
          <HeaderText onClick={clickHandler} text={'REMOVE DONE'} align={'center'}/>
        </PanelFooter>
      </Group>
    )
  }
})

var TodoCanvasView = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    canvasHandler: React.PropTypes.func,
    drawHandler: React.PropTypes.func
  },

  render: function () {
    return (
      <Stage width={PANEL_WIDTH} height={PANEL_HEIGTH * 2} style={stageStyler()}>
        <Layer style={flexStyler()} oncanvas={this.props.canvasHandler} ondraw={this.props.drawHandler}>
          <TodoPanel dispatch = {this.props.dispatch}/>
        </Layer>
      </Stage>
    )
  }
})

module.exports = TodoCanvasView
