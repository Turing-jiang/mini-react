function createTextNode(text) {
  console.log("heiheihei!!!!!!!");
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  console.log("createEle: ", type, props, children);
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        const isTextNode = typeof child == "string" || typeof child == "number";
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

let root = null;
function render(el, container) {
  console.log("render: ", el);
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  console.log("first nextworkL ", nextWorkOfUnit);
  root = nextWorkOfUnit;
}

let nextWorkOfUnit = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);

    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextWorkOfUnit && root) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

function commitRoot() {
  commitWork(root.child);
  root = null;
}

function commitWork(fiber) {
  if (!fiber) return;

  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.dom) fiberParent.dom.append(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function initChildren(fiber, children) {
  // const children = fiber.props.children;
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

function performWorkOfUnit(fiber) {
  const isFunc = typeof fiber.type == "function";
  if (!isFunc) {
    if (!fiber.dom) {
      console.log("fiber1: ", fiber);
      const dom = (fiber.dom = createDom(fiber.type));

      // fiber.parent.dom.append(dom);

      updateProps(dom, fiber.props);
    }
  }

  const children = isFunc ? [fiber.type(fiber.props)] : fiber.props.children;
  initChildren(fiber, children);

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

requestIdleCallback(workLoop);

const React = {
  render,
  createElement,
};

export default React;
