// Adapted from ReactART:
// https://github.com/reactjs/react-art

var Konva = require('konva')
var React = require('react/lib/React')
var computeLayout = require('css-layout')

var ReactInstanceMap = require('react/lib/ReactInstanceMap')
var ReactMultiChild = require('react/lib/ReactMultiChild')
var ReactUpdates = require('react/lib/ReactUpdates')

var assign = require('object-assign')
var emptyObject = require('fbjs/lib/emptyObject')

// some patching to make Konva.Node looks like DOM nodes
var oldAdd = Konva.Container.prototype.add
Konva.Container.prototype.add = function (child) {
  child.parentNode = this
  oldAdd.apply(this, arguments)
}

Konva.Container.prototype.replaceChild = function (newChild, oldChild) {
  var index = oldChild.index
  var parent = oldChild.parent
  oldChild.destroy()
  parent.add(newChild)
  if (newChild.index !== index) {
    newChild.setZIndex(index)
  }
  var reactElement = parent.reactElement || this.reactElement
  if (reactElement) {
    reactElement.batchRedrawLayer()
  } else {
    parent.getLayer().batchDraw()
  }
}

function createComponent (name) {
  var ReactKonvaComponent = function (element) {
    this.node = null
    this.subscriptions = null
    this.listeners = null
    this._mountImage = null
    this._renderedChildren = null
    this._mostRecentlyPlacedChild = null
    this._initialProps = element.props
    this._currentElement = element
  }

  ReactKonvaComponent.displayName = name

  for (var i = 1, l = arguments.length; i < l; i++) {
    assign(ReactKonvaComponent.prototype, arguments[i])
  }

  return ReactKonvaComponent
}

var ContainerMixin = assign({}, ReactMultiChild.Mixin, {
  moveChild: function (prevChild, lastPlacedNode, nextIndex, lastIndex) {
    var childNode = prevChild._mountImage.node
    if (childNode.index !== nextIndex) {
      childNode.setZIndex(nextIndex)
      this.batchRedrawLayer()
    }
  },

  createChild: function (child, afterNode, mountImage) {
    child._mountImage = mountImage
    var childNode = mountImage.node
    childNode.moveTo(this.node)
    childNode.parentNode = this.node
    if (child._mountIndex !== childNode.index) {
      childNode.setZIndex(child._mountIndex)
    }
    this._mostRecentlyPlacedChild = childNode
    this.batchRedrawLayer()
  },

  removeChild: function (child, node) {
    child._mountImage.node.destroy()
    this.batchRedrawLayer()
  },

  updateChildrenAtRoot: function (nextChildren, transaction) {
    this.updateChildren(nextChildren, transaction, emptyObject)
  },

  mountAndInjectChildrenAtRoot: function (children, transaction) {
    this.mountAndInjectChildren(children, transaction, emptyObject)
  },

  updateChildren: function (nextChildren, transaction, context) {
    this._mostRecentlyPlacedChild = null
    this._updateChildren(nextChildren, transaction, context)
  },

  mountAndInjectChildren: function (children, transaction, context) {
    var mountedImages = this.mountChildren(
      children,
      transaction,
      context
    )
    // Each mount image corresponds to one of the flattened children
    var i = 0
    for (var key in this._renderedChildren) {
      if (this._renderedChildren.hasOwnProperty(key)) {
        var child = this._renderedChildren[key]
        child._mountImage = mountedImages[i]
        // runtime check for moveTo method
        // it is possible that child component with be not Konva.Node instance
        // for instance <noscript> for null element
        var node = mountedImages[i].node
        if ((!node instanceof Konva.Node)) {
          var message =
          'Looks like one of child element is not Konva.Node.' +
            'react-konva do not support in for now.'
          'if you have empty(null) child, replace it with <Group/>'
          console.error(message, this)
          continue
        }
        if (node.parent !== this.node) {
          node.moveTo(this.node)
        }
        i++
      }
    }
  },
  mountAndAddChildren: function () {
    console.log('mountAndAddChildren')
  }
})

function createLayoutNode (konvaNode, keepSize) {
  var children = []
  var subRoots = []
  if (keepSize !== true) {
    keepSize = false
  }

  var result = {
    node: konvaNode,
    layout: {
      width: undefined, // computeLayout will mutate
      height: undefined, // computeLayout will mutate
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    style: assign({}, konvaNode.reactElement.getStyle()),
    children: children,
    subRoots: subRoots
  }

  applySizeToStyle(konvaNode, result.style, keepSize)

  if (typeof konvaNode.getChildren === 'function') {
    let konvaNodeChildren = konvaNode.getChildren()
    konvaNodeChildren.forEach(function (child) {
      if (child.reactElement && child.reactElement.hasStyle()) {
        let childLayout = createLayoutNode(child, false)
        if (result.style.flat) {
          subRoots.push(childLayout)
        } else {
          children.push(childLayout)
        }
      }
    })
  }

  return result
}

function nodeHasOwnSize (konvaNode) {
  let className = konvaNode.getClassName()
  return (className === 'Stage' || className === 'Layer' || className === 'FastLayer')
}

function nodeHasMinimumSize (konvaNode) {
  if (konvaNode.reactElement) {
    let style = konvaNode.reactElement.getStyle()
    return style && style.minFromSize
  } else {
    return false
  }
}

function applySizeToStyle (konvaNode, style, keepSize) {
  if (keepSize || nodeHasOwnSize(konvaNode)) {
    style.x = konvaNode.x()
    style.y = konvaNode.y()
    style.width = konvaNode.width()
    style.height = konvaNode.height()
  } else if (nodeHasMinimumSize(konvaNode)) {
    style.minWidth = konvaNode.width()
    style.minHeight = konvaNode.height()
  }
}

function applyLayoutData (style, konvaNode, layoutNode, parentLeft, parentTop) {
  konvaNode.x(layoutNode.layout.left + parentLeft)
  konvaNode.y(layoutNode.layout.top + parentTop)
  konvaNode.width(layoutNode.layout.width)
  konvaNode.height(layoutNode.layout.height)
  if (style.autoClip) {
    konvaNode.clipX(0)
    konvaNode.clipY(0)
    konvaNode.clipWidth(konvaNode.width())
    konvaNode.clipHeight(konvaNode.height())
  }
}

function applyLayout (layoutNode, parentLeft, parentTop) {
  parentLeft = (typeof parentLeft === 'number') ? parentLeft : 0
  parentTop = (typeof parentTop === 'number') ? parentTop : 0

  if (!nodeHasOwnSize(layoutNode.node)) {
    applyLayoutData(layoutNode.style, layoutNode.node, layoutNode, parentLeft, parentTop)
  }

  if (layoutNode.children && layoutNode.children.length > 0) {
    layoutNode.children.forEach(function (child) {
      applyLayout(child, layoutNode.node.x(), layoutNode.node.y())
    })
  }
  if (layoutNode.subRoots && layoutNode.subRoots.length > 0) {
    layoutNode.subRoots.forEach(function (subRoot) {
      applyLayoutData({}, subRoot.node, layoutNode, layoutNode.node.x(), layoutNode.node.y())
      subRoot.style.x = subRoot.node.x()
      subRoot.style.y = subRoot.node.y()
      subRoot.style.width = subRoot.node.width()
      subRoot.style.height = subRoot.node.height()
      subRoot.node.reactElement.recomputeLayout()
    })
  }
}

var NodeMixin = {
  hasStyle: function () {
    var element = this._currentElement || this
    let result = (typeof element.props === 'object' && typeof element.props.style === 'object')
    return result
  },

  getStyle: function () {
    var element = this._currentElement || this
    return this.hasStyle() ? element.props.style : {}
  },

  // This should be called only on layer and stage nodes
  recomputeLayout: function () {
    if (this.hasStyle()) {
      var layoutTree = createLayoutNode(this.node, true)
      computeLayout(layoutTree)
      applyLayout(layoutTree, 0, 0)
    }
  },

  batchRedrawLayer: function () {
    var layer = this.node.getLayer()
    if (layer) {
      layer.reactElement.recomputeLayout()
      layer.batchDraw()
    }
  },

  construct: function (element) {
    this._currentElement = element
  },

  receiveComponent: function (nextComponent, transaction, context) {
    var props = nextComponent.props
    var oldProps = this._currentElement.props || this._initialProps
    this.applyNodeProps(oldProps, props)
    this.updateChildren(props.children, transaction, context)
    this._currentElement = nextComponent
  },

  getPublicInstance: function () {
    return this.node
  },

  putEventListener: function (type, listener) {
    // NOPE...
  },

  handleEvent: function (event) {
    // NOPE...
  },

  getNativeNode: function () {
    return this.node
  },

  applyNodeProps: function (oldProps, props) {
    var updatedProps = {}
    var hasUpdates = false
    for (let key in oldProps) {
      let isEvent = key.slice(0, 2) === 'on'
      var toRemove = oldProps[key] !== props[key]
      if (isEvent && toRemove) {
        this.node.off(key.slice(2, key.length).toLowerCase(), oldProps[key])
      }
    }
    for (let key in props) {
      if (key === 'children') {
        continue
      }
      let isEvent = key.slice(0, 2) === 'on'
      var toAdd = oldProps[key] !== props[key]
      if (isEvent && toAdd) {
        this.node.on(key.slice(2, key.length).toLowerCase(), props[key])
      }
      if (!isEvent && ((props[key] !== oldProps[key]) || (props[key] !== this.node.getAttr(key)))) {
        hasUpdates = true
        updatedProps[key] = props[key]
      }
    }

    if (hasUpdates) {
      this.node.setAttrs(updatedProps)
      this.batchRedrawLayer()
      var val, prop
      for (prop in updatedProps) {
        val = updatedProps[prop]
        if (val instanceof Image && !val.complete) {
          var self = this
          val.addEventListener('load', function () {
            self.batchRedrawLayer()
          })
        }
      }
    }
  },

  unmountComponent: function () {},

  mountComponentIntoNode: function (rootID, container) {
    throw new Error(
      'You cannot render a Konva component standalone. ' +
      'You need to wrap it in a Stage.'
    )
  }

}

var Stage = React.createClass({
  propTypes: {
    width: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    height: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ])
  },
  displayName: 'Stage',

  mixins: [ContainerMixin],

  componentDidMount: function () {
    this.node = new Konva.Stage({
      container: this.domNode,
      width: this.props.width,
      height: this.props.height
    })
    this.node.reactElement = this
    this.applyNodeProps(emptyObject, this.props)
    this._debugID = this._reactInternalInstance._debugID
    var transaction = ReactUpdates.ReactReconcileTransaction.getPooled()

    transaction.perform(
      this.mountAndInjectChildren,
      this,
      this.props.children,
      transaction,
      ReactInstanceMap.get(this)._context
    )
    ReactUpdates.ReactReconcileTransaction.release(transaction)

    this.recomputeLayout()
    this.node.draw()
  },

  getStage: function () {
    return this.node
  },

  componentDidUpdate: function (oldProps) {
    this.applyNodeProps(oldProps, this.props)

    var transaction = ReactUpdates.ReactReconcileTransaction.getPooled()
    transaction.perform(
      this.updateChildren,
      this,
      this.props.children,
      transaction,
      ReactInstanceMap.get(this)._context
    )
    ReactUpdates.ReactReconcileTransaction.release(transaction)
  },

  componentWillUnmount: function () {
    this.unmountChildren()
  },

  applyNodeProps: NodeMixin.applyNodeProps,

  hasStyle: NodeMixin.hasStyle,
  getStyle: NodeMixin.getStyle,
  recomputeLayout: NodeMixin.recomputeLayout,
  batchRedrawLayer: NodeMixin.batchRedrawLayer,

  render: function () {
    var props = this.props
    var self = this

    return (
      React.createElement('div', {
        ref: function (c) { return (self.domNode = c) },
        className: props.className,
        role: props.role,
        style: props.style,
        tabindex: props.tabindex,
        title: props.title}
      )
    )
  }
})

var GroupMixin = {
  mountComponent: function (transaction, nativeParent, nativeContainerInfo, context) {
    this.node = new Konva[this.constructor.displayName]()
    this.node.reactElement = this
    nativeParent.node.add(this.node)
    var props = this._initialProps
    this.applyNodeProps(emptyObject, props)
    this.mountAndInjectChildren(props.children, transaction, context)

    if (this.constructor.displayName === 'Layer' || this.constructor.displayName === 'FastLayer') {
      var self = this
      var layer = this.node

      let initialProps = self.props || props
      if (initialProps) {
        let canvasHandler = initialProps.oncanvas
        if (typeof canvasHandler !== 'function') {
          canvasHandler = initialProps.onCanvas
        }
        if (typeof canvasHandler === 'function') {
          var canvas = layer.getCanvas().getContext().canvas._canvas
          canvasHandler(canvas)
        }
      }
    }

    return {
      children: [],
      node: this.node,
      html: null,
      text: null
    }
  },

  unmountComponent: function () {
    this.unmountChildren()
  }
}

var ShapeMixin = {
  construct: function (element) {
    this._currentElement = element
    this._oldPath = null
  },

  mountComponent: function (transaction, nativeParent, nativeContainerInfo, context) {
    this.node = new Konva[this.constructor.displayName]()
    this.node.reactElement = this
    if (nativeParent) {
      nativeParent.node.add(this.node)
    }
    this.applyNodeProps(emptyObject, this._initialProps)
    return {
      children: [],
      node: this.node,
      html: null,
      text: null
    }
  },

  receiveComponent: function (nextComponent, transaction, context) {
    var props = nextComponent.props
    var oldProps = this._currentElement.props || this._initialProps
    this.applyNodeProps(oldProps, props)
    this._currentElement = nextComponent
  }

}

var Group = createComponent('Group', NodeMixin, ContainerMixin, GroupMixin)
var Layer = createComponent('Layer', NodeMixin, ContainerMixin, GroupMixin)
var FastLayer = createComponent('FastLayer', NodeMixin, ContainerMixin, GroupMixin)

var Label = createComponent('Label', NodeMixin, ContainerMixin, GroupMixin)

var ReactKonva = {
  Stage: Stage,
  Group: Group,
  Layer: Layer,
  FastLayer: FastLayer,
  Label: Label
}

var shapes = [
  'Rect', 'Circle', 'Ellipse', 'Wedge', 'Line', 'Sprite', 'Image', 'Text', 'TextPath',
  'Star', 'Ring', 'Arc', 'Tag', 'Path', 'RegularPolygon', 'Arrow', 'Shape'
]

shapes.forEach(function (shapeName) {
  ReactKonva[shapeName] = createComponent(shapeName, NodeMixin, ShapeMixin)
})

module.exports = ReactKonva
