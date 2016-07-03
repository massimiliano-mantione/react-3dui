import React from 'react'

let TodoElement = React.createClass({
  propTypes: {
    todo: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired
  },

  render: function () {
    let {todo, dispatch} = this.props
    return (
      <div className={'container row'}>
        <p>{todo.text}</p>
        <p>{todo.done ? 'DONE' : 'TODO'}</p>
        <button onClick={() => dispatch('toggle', todo.id)}>TOGGLE</button>
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
      <div className={'container column'}>
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
        <div className={'container column'}>
          {state.todos.map((todo) => {
            return <TodoElement todo={todo} dispatch={dispatch} key={todo.id}/>
          })}
        </div>
        <button onClick={() => dispatch('removeDone')}>REMOVE DONE</button>
      </div>
    )
  }
})

module.exports = TodoDomView
