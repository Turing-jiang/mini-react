function createTextEl(text) {
  return {
    type: "text-element",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "string" ? createTextEl(child) : child;
      }),
    },
  };
}

function render(el, container) {
  nextTask = {
    dom: container,
    props: {
      children: [el],
    },
  };
}

let nextTask = null;
function taskLoop(deadline) {
  let quit = false;
  while (!quit && nextTask) {
    console.log("nextTask: ", nextTask);
    nextTask = runTask(nextTask);

    quit = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(taskLoop);
}

function createTextNode() {
  return document.createTextNode("");
}

function createNornalNode(type) {
  return document.createElement(type);
}

function runTask(fiber) {
  if (!fiber.dom) {
    fiber.dom =
      fiber.type == "text-element"
        ? createTextNode()
        : createNornalNode(fiber.type);

    Object.keys(fiber.props).forEach((prop) => {
      if (prop != "children") {
        fiber.dom[prop] = fiber.props[prop];
      }
    });
    fiber.parent.dom.append(fiber.dom);
  }

  let prevChild = null;
  fiber.props.children.forEach((child, index) => {
    let newChild = {
      parent: fiber,
      type: child.type,
      props: child.props,
      child: null,
      dom: null,
      brother: null,
    };
    if (index == 0) {
      fiber.child = newChild;
    } else {
      prevChild.brother = newChild;
    }
    prevChild = newChild;
  });

  if (fiber.child) {
    return fiber.child;
  }

  if (fiber.brother) {
    return fiber.brother;
  }

  return fiber.parent?.brother;
}

requestIdleCallback(taskLoop);

const React = {
  render,
  createElement,
};

export default React;
