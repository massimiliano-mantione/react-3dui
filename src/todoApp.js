import React from 'react'
import {createDispatcher} from './todoLogic'
import TodoDomView from './todoDomView'

let TodoApp = React.createClass({
  getInitialState: function () {
    this.dispatch = createDispatcher((state) => this.setState(state))
    return this.dispatch('getState')
  },

  render: function () {
    return (
      <div>
        <TodoDomView dispatch={this.dispatch}/>
      </div>
    )
  }
})

module.exports = TodoApp
