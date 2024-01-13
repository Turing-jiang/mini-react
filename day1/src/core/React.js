function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}

function render(el, container) {
  let dom;
  if (typeof el == "string") {
    dom = document.createTextNode("");
    dom.nodeValue = el;
  } else {
    dom = document.createElement(el.type);
    Object.keys(el.props).forEach((prop) => {
      if (prop != "children") {
        dom.prop = el.props.prop;
      }
    });
    console.log("childer: ", el.props);
    el.props.children.forEach((child) => {
      render(child, dom);
    });
  }

  container.append(dom);
}
const React = {
  render,
  createElement,
};

export default React;
