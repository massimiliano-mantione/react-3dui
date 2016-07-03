import React from 'react'
import {Layer, Stage, Group, Rect, Text} from './react-konva'
import {Styler} from 'debonair'
let createStyler = Styler.create

let stageStyler = createStyler({})
let flexStyler = createStyler({flex: 1})
let containerStyler = createStyler(flexStyler, {alignItems: 'stretch'})
let columnStyler = createStyler(containerStyler, {flexDirection: 'column'})
let rowStyler = createStyler(containerStyler, {flexDirection: 'row'})
let marginStyler = createStyler({margin: 5})
let textStyler = createStyler(containerStyler, marginStyler)

let HEIGHT = 30

let TodoElement = React.createClass({
  propTypes: {
    todo: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired
  },

  render: function () {
    let {todo, dispatch} = this.props
    return (
      <Group style={rowStyler()} height={HEIGHT}>
        <Text style={textStyler()} text={todo.text} fill={'black'} align={'left'} fontSize={14}/>
        <Text style={textStyler()} text={todo.done ? 'DONE' : 'TODO'} fill={'black'} align={'center'} fontSize={14}/>
        <Text style={textStyler()} text={'TOGGLE'} fill={'black'} align={'center'} fontSize={14} onClick={() => dispatch('toggle', todo.id)}/>
      </Group>
    )
  }
})

let TodoCanvasView = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired
  },

  render: function () {
    let dispatch = this.props.dispatch
    let state = this.props.dispatch('getState')

    return (
      <Group style={columnStyler()}>
        <Text style={textStyler()} text={state.text} fill={'black'} align={'left'} fontSize={14} height={HEIGHT}/>
        <Group style={columnStyler()}>
          {state.todos.map((todo) => {
            return <TodoElement todo={todo} dispatch={dispatch} key={todo.id}/>
          })}
        </Group>
        <Text style={textStyler()} text={'REMOVE DONE'} fill={'black'} align={'center'} fontSize={14} height={HEIGHT} onClick={() => dispatch('removeDone')}/>
      </Group>
    )
  }
})

module.exports = TodoCanvasView
