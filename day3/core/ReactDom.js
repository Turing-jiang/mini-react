import React from "./React.js";
const ReactDOM = {
  createRoot(container) {
    return {
      render(App) {
        console.log("app: ", App);
        React.render(App, container);
      },
    };
  },
};

export default ReactDOM;
