import React from 'react'

import {Styler} from 'debonair'
let createStyler = Styler.create
let baseRowStyler = createStyler({
  display: 'flex',
  flexDirection: 'row'
})
function rowStyler (scale) {
  return baseRowStyler({
    transform: 'scaleY(' + scale + ')',
    justifyContent: 'center',
    alignItems: 'stretch',
    flex: scale
  })
}
let columnStyler = createStyler({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch'
})
let descriptionStyler = createStyler({
  flex: 1
})

import listElementScale from './listElementScale'

let TodoElement = React.createClass({
  propTypes: {
    scale: React.PropTypes.number.isRequired,
    todo: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired
  },

  render: function () {
    let {todo, dispatch} = this.props
    return (
      <div style={rowStyler(this.props.scale)}>
        <div style={descriptionStyler()}>{todo.text}</div>
        <div>
          <button onClick={() => dispatch('toggle', todo.id)} type='button' className='btn btn-default'>
            <span className={todo.done ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-remove'}></span>
          </button>
        </div>
      </div>
    )
  }
})

let TodoDomView = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired
  },

  render: function () {
    let dispatch = this.props.dispatch
    let state = this.props.dispatch('getState')

    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <input
            type={'text'}
            autoFocus={'true'}
            value={state.text}
            onChange={function (e) {
              dispatch('setText', e.target.value)
            }}
            onKeyDown={function (e) {
              if (e.which === 13) {
                dispatch('addCurrent')
              }
            }} />
        </div>
        <div className='panel-body'>
          <div style={columnStyler()}>
          {
            state.todos.reduce((todos, todo, todoIndex) => {
              console.log('state.todos.reduce', todos)
              let scale = listElementScale(3, state.scroll, todoIndex)
              if (scale > 0) {
                todos.push(<TodoElement todo={todo} dispatch={dispatch} key={todo.id} scale={scale}/>)
              }
              return todos
            }, [])
          }
          </div>
        </div>
        <div className='panel-footer'>
          <button onClick={() => dispatch('removeDone')}>REMOVE DONE</button>
        </div>
      </div>
    )
  }
})

module.exports = TodoDomView
