import React from "./core/React.js";




function Counter({num}){
    return <div>counter: {num}</div>
}
function App() { return <div>hi-mini-react <Counter num={20}></Counter><Counter num={50}></Counter></div>}

export default App;
