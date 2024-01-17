function createTextNode(text) {
  console.log('heiheihei!!!!!!!')
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        const isTextNode = typeof child == 'string' || typeof child == 'number'
        return isTextNode ? createTextNode(child) : child
      }),
    },
  }
}

let root = null
function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  }
  root = nextWorkOfUnit
}

let nextWorkOfUnit = null
function workLoop(deadline) {
  let shouldYield = false
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextWorkOfUnit && root) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

function commitRoot() {
  commitWork(root.child)
  root = null
}

function commitWork(fiber) {
  if (!fiber) return
  console.log('fiber in commitwork: ', fiber)
  fiber.parent.dom.append(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function createDom(type) {
  return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type)
}

function updateProps(dom, props) {
  console.log('dom: ', dom, props)
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      dom[key] = props[key]
    }
  })
}

function initChildren(fiber) {
  const children = fiber.props.children
  let prevChild = null
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    prevChild = newFiber
  })
}

function performWorkOfUnit(fiber) {
  if (root == fiber && typeof root.props.children[0] == 'function') {
    let app = root.props.children[0]
    root.props.children[0] = app()
  }

  if (typeof fiber.type === 'function') {
    let childElement = fiber.type(fiber.props)
    console.log('childElement: ', childElement)

    while (typeof childElement.type === 'function') {
      childElement = childElement.type(childElement.props)
    }
    fiber.type = childElement.type
    fiber.props = childElement.props
  }

  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))

    // fiber.parent.dom.append(dom);

    updateProps(dom, fiber.props)
  }

  initChildren(fiber)

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child
  }

  if (fiber.sibling) {
    return fiber.sibling
  }

  let nextFiber = fiber.parent
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
}

requestIdleCallback(workLoop)

const React = {
  render,
  createElement,
}

export default React
