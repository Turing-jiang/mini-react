import React from './core/React.js'

function Counter() {
  return (
    <div>
      <Count num={10}></Count>
      <Count num={10}></Count>
    </div>
  )
}
function Count({ num }) {
  return <div>count: {num}</div>
}

function App() {
  return (
    <div>
      hi <Counter></Counter> mini <Counter></Counter>react
    </div>
  )
}

export default App
