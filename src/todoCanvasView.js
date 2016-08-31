import React from 'react'
import {Layer, Stage, Group, Rect, Text} from './react-konva'
import {Styler} from 'debonair'

import {listElementScale, listElementPosition} from './listElementScale'

const ROW_HEIGTH = 20
const LINE_HEIGTH = 25
const LIST_SIZE = 3.50
const LIST_HEIGTH = LIST_SIZE * ROW_HEIGTH
const HEADER_HEIGTH = LINE_HEIGTH
const FOOTER_HEIGTH = LINE_HEIGTH
const PANEL_WIDTH = 300
const PANEL_HEIGTH = HEADER_HEIGTH + LIST_HEIGTH + FOOTER_HEIGTH
const BACKGROUND_COLOR = 'white'
const BACKGROUND_LINE_COLOR = 'grey'
const TEXT_COLOR = 'black'

let createStyler = Styler.create

let stageStyler = createStyler({})
let flexStyler = createStyler({flex: 1})
let containerStyler = createStyler(flexStyler, {alignItems: 'stretch'})
let columnStyler = createStyler(containerStyler, {flexDirection: 'column'})
let flatStyler = createStyler({flat: true})
let panelColorStyler = createStyler({flat: true})
let listStyler = createStyler({flat: true, height: LIST_SIZE * ROW_HEIGTH})
let rowStyler = createStyler(containerStyler, {flexDirection: 'row'})
let marginStyler = createStyler({margin: 5})
let panelItemStyler = createStyler(containerStyler, marginStyler)

let PanelRow = React.createClass({
  propTypes: {
    y: React.PropTypes.number.isRequired,
    scaleY: React.PropTypes.number,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    dispatch: React.PropTypes.func.isRequired
  },

  render: function () {
    let {y, scaleY, width, height, fill, stroke, children, dispatch} = this.props
    if (scaleY === undefined) {
      scaleY = 1
    }
    if (fill === undefined) {
      fill = 'white'
    }
    if (stroke === undefined) {
      stroke = 'black'
    }
    if (dispatch === undefined) {
      dispatch = () => {}
    }
    return (
      <Group y={y} scaleY={scaleY}>
        <Rect fill={fill} stroke={stroke} height={height} width={width} cornerRadius={4}/>
        <Group style={containerStyler({height: height, width: width})}>
          {children}
        </Group>
      </Group>
    )
  }
})

let PanelHeader = React.createClass({
  propTypes: {},
  render: function () {
    let {children} = this.props
    return (
      <PanelRow y={0} fill={BACKGROUND_LINE_COLOR} stroke={BACKGROUND_LINE_COLOR} height={HEADER_HEIGTH} width={PANEL_WIDTH}>
        {children}
      </PanelRow>
    )
  }
})
let PanelFooter = React.createClass({
  propTypes: {
    y: React.PropTypes.number.isRequired
  },
  render: function () {
    let {y, children} = this.props
    return (
      <PanelRow y={y} fill={BACKGROUND_LINE_COLOR} stroke={BACKGROUND_LINE_COLOR} height={HEADER_HEIGTH} width={PANEL_WIDTH}>
        {children}
      </PanelRow>
    )
  }
})
let PanelBody = React.createClass({
  propTypes: {
    y: React.PropTypes.number.isRequired
  },
  render: function () {
    let {y, children} = this.props
    return (
      <PanelRow y={y} fill={BACKGROUND_COLOR} stroke={BACKGROUND_LINE_COLOR} height={LIST_HEIGTH} width={PANEL_WIDTH}>
        {children}
      </PanelRow>
    )
  }
})

let PanelText = React.createClass({
  propTypes: {
    text: React.PropTypes.string.isRequired,
    fontSize: React.PropTypes.number
  },
  render: function () {
    let {text, fontSize} = this.props
    if (typeof fontSize !== 'number') {
      fontSize = 14
    }
    return (
      <Text style={panelItemStyler()} text={text} fill={TEXT_COLOR} align={'left'} fontSize={fontSize}/>
    )
  }
})

let TodoElement = React.createClass({
  propTypes: {
    y: React.PropTypes.number.isRequired,
    scale: React.PropTypes.number.isRequired,
    todo: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired
  },

  render: function () {
    let {y, scale, todo, dispatch} = this.props
    return (
      <PanelRow y={y} scaleY={scale} fill={BACKGROUND_COLOR} stroke={BACKGROUND_LINE_COLOR} height={ROW_HEIGTH} width={PANEL_WIDTH}>
        <Group style={rowStyler()} height={ROW_HEIGTH}>
          <Text style={panelItemStyler()} text={todo.text} fill={'black'} align={'left'} fontSize={14}/>
          <Text style={panelItemStyler()} text={todo.done ? 'DONE' : 'TODO'} fill={'black'} align={'center'} fontSize={14}/>
          <Text style={panelItemStyler()} text={'TOGGLE'} fill={'black'} align={'center'} fontSize={14} onClick={() => dispatch('toggle', todo.id)}/>
        </Group>
      </PanelRow>
    )
  },
  renderXXX: function () {
    let {y, scale, todo, dispatch} = this.props
    return (
      <Group style={{flat: true, height: ROW_HEIGTH, top: y}} scaleY={scale} y={y}>
        <Group style={rowStyler()} height={ROW_HEIGTH}>
          <Text style={panelItemStyler()} text={todo.text} fill={'black'} align={'left'} fontSize={14}/>
          <Text style={panelItemStyler()} text={todo.done ? 'DONE' : 'TODO'} fill={'black'} align={'center'} fontSize={14}/>
          <Text style={panelItemStyler()} text={'TOGGLE'} fill={'black'} align={'center'} fontSize={14} onClick={() => dispatch('toggle', todo.id)}/>
        </Group>
      </Group>
    )
  }
})

let TodoPanel = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired
  },

  render: function () {
    let dispatch = this.props.dispatch
    let state = this.props.dispatch('getState')

    //
    return (
      <PanelRow fill={BACKGROUND_COLOR} stroke={BACKGROUND_LINE_COLOR} height={PANEL_HEIGTH} width={PANEL_WIDTH}>
        <PanelHeader>
          <PanelText text={state.text} fontSize={14}/>
        </PanelHeader>
        <PanelBody y={HEADER_HEIGTH}>
          {
            state.todos.reduce((todos, todo, todoIndex) => {
              let scale = listElementScale(LIST_SIZE, state.scroll, todoIndex)
              let normalizedY = listElementPosition(LIST_SIZE, state.scroll, todoIndex)
              let y = normalizedY * ROW_HEIGTH
              if (scale > 0) {
                todos.push(<TodoElement todo={todo} dispatch={dispatch} key={todo.id} scale={scale} y={y}/>)
              }
              return todos
            }, [])
          }
        </PanelBody>
        <PanelFooter y={PANEL_HEIGTH + LIST_HEIGTH}>
          <PanelText text={'REMOVE DONE'} fontSize={14}/>
        </PanelFooter>
      </PanelRow>
    )
  },

  renderXX: function () {
    let dispatch = this.props.dispatch
    let state = this.props.dispatch('getState')

    //
    return (
      <PanelRow fill={BACKGROUND_COLOR} stroke={BACKGROUND_LINE_COLOR} height={PANEL_HEIGTH} width={PANEL_WIDTH}>
        <PanelRow y={0} fill={BACKGROUND_LINE_COLOR} stroke={BACKGROUND_LINE_COLOR} height={HEADER_HEIGTH} width={PANEL_WIDTH}>
          <Text style={panelItemStyler()} text={state.text} fill={TEXT_COLOR} align={'left'} fontSize={14}/>
        </PanelRow>
        <PanelRow y={HEADER_HEIGTH} fill='green' stroke='blue' height={HEADER_HEIGTH} width={PANEL_WIDTH}>
          <Text style={panelItemStyler()} text={'HOLA'} fill={'black'} align={'left'} fontSize={14}/>
        </PanelRow>
        {withBackground(0, HEADER_HEIGTH, 'blue', 'green',
          <Text style={panelItemStyler()} text={state.text} fill={'black'} align={'left'} fontSize={14} height={ROW_HEIGTH}/>
        )}
        {withBackground(HEADER_HEIGTH, LIST_HEIGTH, 'blue', 'green',
          state.todos.reduce((todos, todo, todoIndex) => {
            let scale = listElementScale(LIST_SIZE, state.scroll, todoIndex)
            let y = listElementPosition(LIST_SIZE, state.scroll, todoIndex) * ROW_HEIGTH
            if (todoIndex === 0) {
              console.log(' *** state.todos.reduce START', LIST_SIZE, state.scroll)
            }
            console.log('     ', todoIndex, scale, y)
            if (scale > 0) {
              todos.push(<TodoElement todo={todo} dispatch={dispatch} key={todo.id} scale={scale} y={y}/>)
            }
            return todos
          }, [])
        )}
        <Text style={panelItemStyler()} text={'REMOVE DONE'} fill={'black'} align={'center'} fontSize={14} height={ROW_HEIGTH} onClick={() => dispatch('removeDone')}/>
      </PanelRow>
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
