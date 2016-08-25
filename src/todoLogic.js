function cloneArray (a) {
  return a.slice(0)
}

function buildState (nextId, text, todos, scroll) {
  return {nextId, text, todos, scroll}
}

function initialState () {
  return buildState(1, '', [], 0)
}

function buildTodo (id, text, done) {
  return {id, text, done}
}

function getState (state) {
  return state
}

function addCurrent (state) {
  if (state.text.length === 0) {
    return state
  }
  let todos = cloneArray(state.todos)
  todos.push(buildTodo(state.nextId, state.text, false))
  return buildState(state.nextId + 1, '', todos, state.scroll)
}

function toggle (state, id) {
  return buildState(
    state.nextId,
    state.text,
    state.todos.map((todo) => {
      if (todo.id !== id) {
        return todo
      } else {
        return buildTodo(
          todo.id,
          todo.text,
          !(todo.done)
        )
      }
    }),
    state.scroll
  )
}

function removeDone (state) {
  return buildState(
    state.nextId,
    state.text,
    state.todos.filter((todo) => {
      return !(todo.done)
    }),
    state.scroll)
}

function setText (state, text) {
  return buildState(state.nextId, text, state.todos, state.scroll)
}

function appendText (state, text) {
  return buildState(state.nextId, state.text + text, state.todos, state.scroll)
}

function removeLastTextCharacter (state) {
  return buildState(state.nextId, state.text.slice(0, -1), state.todos, state.scroll)
}

function moveScroll (state, movement, listSize) {
  let scroll = state.scroll + movement
  if (scroll < 0) {
    scroll = 0
  } else {
    let upperLimit = state.todos.length - listSize
    if (scroll > upperLimit) {
      scroll = upperLimit
    }
  }
  return buildState(state.nextId, state.text, state.todos, scroll)
}

let actions = {
  getState,
  addCurrent,
  toggle,
  removeDone,
  setText,
  appendText,
  removeLastTextCharacter,
  moveScroll
}

function createDispatcher (stateHandler) {
  let state = initialState()
  return function dispatch (action, argument1, argument2) {
    let newState = actions[action](state, argument1, argument2)
    if (state !== newState) {
      state = newState
      stateHandler(state)
    }
    return state
  }
}

module.exports = {
  initialState,
  createDispatcher
}
