在这个系列的博客中，我将介绍一个简化版的 `React.js` 实现。

## day1
day1展示了 `React` 的核心功能之一——如何创建和渲染元素。
这个迷你版的 `React` 包含了基本的元素创建和渲染逻辑，足以理解 `React` 在更复杂应用中的工作原理。
1. `createElement` 函数
`createElement` 是 `React` 中用于创建虚拟 DOM 元素的函数。在我们的迷你版实现中，这个函数接收元素类型、属性和子元素，然后返回一个描述 DOM 结构的对象。
```
  function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}
```
2. `render` 函数
`render` 函数负责将虚拟 DOM 元素渲染到真实的 DOM 中。它检查元素类型，创建对应的 DOM 节点，应用属性，并递归地处理子元素。
```
  function render(el, container) {
  let dom;
  if (typeof el == "string") {
    dom = document.createTextNode(el);
  } else {
    dom = document.createElement(el.type);
    Object.keys(el.props).forEach((prop) => {
      if (prop != "children") {
        dom.prop = el.props.prop;
      }
    });
    el.props.children.forEach((child) => {
      render(child, dom);
    });
  }
  container.append(dom);
}
```
3. 迷你 `React` 和 `ReactDOM` 的结构
我们将 `createElement` 和 `render` 封装在一个名为 React 的对象中，并导出。
```
const React = {
  render,
  createElement,
};
export default React;
```
另外，我们实现了一个简单的 `ReactDOM` 对象，其中 `createRoot` 函数接收一个容器元素，并返回一个具有 `render` 方法的对象。
```
import React from "./React";
const ReactDOM = {
  createRoot(container) {
    return {
      render(el) {
        React.render(el, container);
      },
    };
  },
};
export default ReactDOM;
```
4. 使用迷你 `React`
在 `App.jsx` 中，我们使用 `createElement` 创建一个简单的元素并导出。这展示了如何使用我们的迷你 `React` 来定义和导出组件。
```
import React  from "./core/React.js"
const App = React.createElement("div", { id: "app" }, "app", "test");
export default App;
```
总结
虽然这个迷你 `React` 实现非常简化，但它涵盖了 `React` 核心功能的基础：创建虚拟 DOM 元素和将它们渲染到真实 DOM 中。
## day2
day2的版本是在day1的基础上添加了任务调度功能。
1. `render` 函数和 `taskLoop` 函数共同实现了组件的递归渲染。 使用 `requestIdleCallback` 来调度任务是 `React` 中的一个高级特性，它允许浏览器在主线程空闲时执行背景工作。
2. Fiber 架构的初步实现
- 任务调度的复杂性， `taskLoop` 函数中实现任务的分割和调度。通过 `requestIdleCallback` 在浏览器空闲时执行任务，以及通过 `deadline.timeRemaining()` 控制任务执行时间，避免长时间占用主线程。
- Fiber 树的构建. 构建和管理 Fiber 树以及处理每个 `Fiber` 节点的状态。为每个元素创建对应的 Fiber 节点，并为每个 Fiber 节点定义清晰的属性.
- 真实 DOM 的创建和更新。 在 `runTask` 函数中，根据 `Fiber` 节点的类型创建对应的真实 DOM，并处理属性更新。使用 `Object.keys` 遍历 `Fiber` 节点的属性，并将它们应用到对应的 DOM 元素上。
## day3
day3版本添加了对函数组件的支持.
当节点为函数组件的时候，`fiber.type`为`function`类型，所以在调用initChildren的时候就不能使用原有的`fiber.props.children`了，
而是应该使用`[fiber.tpye()]`。
## day4
day4是对前三天的学习进行复习和整理。
## day5
day5版本引入了`update`函数，它允许在状态改变时触发组件的重新渲染，这是对 `React` 的核心功能之一——组件状态管理的一个重要实现。
通过对`props`的处理和事件监听的绑定，day5版本展示了如何将属性（如 id）和事件（如 onClick）动态绑定到 DOM 元素。
在 `updateProps` 函数中，检查属性中的事件监听器，并使用 `addEventListener` 将它们绑定到对应的 DOM 元素。
在组件中通过传递新的 `props` 或更改现有的 `props` 来触发更新，然后在 `updateProps` 中更新 DOM 元素的属性。
## day6
day6版本的mini-react实现中，引入了类似于`React.js`中的Diff算法，它能够高效地更新 DOM。
通过比较新旧两个`Fiber`树的节点来确定哪些部分需要更新。这是通过`performWorkOfUnit`函数中的逻辑实现的，其中对比当前`Fiber`节点与其对应的旧节点（alternate）。
查看`Fiber`节点上标记标签（effectTag），如果此标签为`placement`说明节点是在最初的渲染阶段, 如果`Fiber`节点上标记标签为 `update`说明在重新渲染阶段。
在`commitWork`阶段对 DOM 进行相应的操作，比如添加新的 DOM 元素或更新现有的 DOM 元素。在需要删除节点时，使用`commitDeletion` 函数处理。
## day7
day7版本实现了`useState`钩子，允许组件拥有内部状态，并在状态变化时重新渲染。
`useState` 为每个组件实例创建了一个状态存储。这通过定义 `stateHooks` 数组来实现，该数组存储了组件的所有状态钩子。
当组件首次渲染时，`useState` 会初始化状态。这通过传递给 `useState` 的初始值参数来实现。`useState` 返回一个状态值和一个更新该状态的函数（`setState`）。当调用 `setState` 时，它会将一个更新操作添加到状态钩子的 `queue` 中。在状态更新后，`setState` 会触发组件的重新渲染。这是通过设置新的`nextWorkOfUnit`并重新启动渲染流程来实现的。
## day8
day8版本中新增了`useEffect`钩子，允许执行副作用操作（如数据获取、订阅等），并在组件渲染后执行。
在函数组件中调用`useEffect`时，会创建一个包含回调函数和依赖数组的`effect`对象，并将其添加到当前`fiber`节点的`effectHooks`数组中。在组件渲染过程中（具体是在`commitRoot`阶段），`React`会遍历所有的`effect`钩子，并根据依赖项的变化来决定是否执行回调函数。`useEffect`检查提供的依赖数组，以确定是否需要执行或重新执行回调函数。如果依赖数组中的项与上次渲染时相比发生了变化，或者如果依赖数组为空（表示每次渲染后都执行），则执行回调函数。`useEffect`的回调函数可以返回一个清理函数，用于在组件卸载或依赖项变化前执行清理操作，如取消订阅或清除计时器等。

