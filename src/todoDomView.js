import React from 'react'

let TodoElement = React.createClass({
  propTypes: {
    todo: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired
  },

  render: function () {
    let {todo, dispatch} = this.props
    return (
      <tr>
        <td>{todo.text}</td>
        <td>
          <button onClick={() => dispatch('toggle', todo.id)} type='button' className='btn btn-default'>
            <span className={todo.done ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-remove'}></span>
          </button>
        </td>
      </tr>
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
          <table className='table table-striped' fill responsive>
            {state.todos.map((todo) => {
              return <TodoElement todo={todo} dispatch={dispatch} key={todo.id}/>
            })}
          </table>
        </div>
        <div className='panel-footer'>
          <button onClick={() => dispatch('removeDone')}>REMOVE DONE</button>
        </div>
      </div>
    )
  }
})

module.exports = TodoDomView
