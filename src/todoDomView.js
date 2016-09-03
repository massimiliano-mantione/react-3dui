import React from 'react'

const LIST_SIZE = 3.50
const ROW_HEIGTH = 40

import {Styler} from 'debonair'
let createStyler = Styler.create
let baseRowStyler = createStyler({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center'
})
function rowStyler (scale) {
  return baseRowStyler({
    transform: 'scaleY(' + scale + ')',
    height: ROW_HEIGTH * scale
  })
}
let listStyler = createStyler({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  height: ROW_HEIGTH * LIST_SIZE
})
let descriptionStyler = createStyler({
  flex: 1
})

import {listElementScale} from './listElementScale'

let TodoElement = React.createClass({
  propTypes: {
    scale: React.PropTypes.number.isRequired,
    todo: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired
  },

  render: function () {
    let {scale, todo, dispatch} = this.props
    return (
      <div style={rowStyler(scale)}>
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

let previousY = -1
function mouseMoveHandler (e, dispatch) {
  if (e.buttons === 1) {
    let y = e.clientY
    if (previousY >= 0 && y > 0) {
      let delta = y - previousY
      dispatch('moveScroll', -delta / ROW_HEIGTH, LIST_SIZE)
      e.preventDefault()
    }
    previousY = y
  }
}

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
            autoFocus={'false'}
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
          <div
            style={listStyler()}
            onMouseMove={function (e) {
              mouseMoveHandler(e, dispatch)
            }}
          >
          {
            state.todos.reduce((todos, todo, todoIndex) => {
              let scale = listElementScale(LIST_SIZE, state.scroll, todoIndex)
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
