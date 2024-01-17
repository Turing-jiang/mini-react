import React from './core/React.js'

let index = 10
let props = {id : '123'}
function Counter() {
  return (
    <div>
      <Count num={10}></Count>
    </div>
  )
}
function Count({ num }) {
  function handleClick(){
    console.log("clicked")
    index++
    props = {}
    React.update()
  }
  return <div {...props}><button onClick={handleClick}>count: {index}</button></div>
}

function App() {
  return (
    <div>
      hi <Count></Count> react
    </div>
  )
}

export default App
