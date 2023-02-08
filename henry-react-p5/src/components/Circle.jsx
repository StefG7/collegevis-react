// https://www.google.com/search?q=react+interactive+svg&rlz=1C1ONGR_enUS994US994&oq=react+interactive+svg&aqs=chrome..69i57j0i512j0i22i30l2j0i390l4.7850j0j4&sourceid=chrome&ie=UTF-8
// https://medium.com/hackernoon/5-ways-to-animate-a-reactjs-app-in-2019-56eb9af6e3bf


// import { CSSTransitionGroup } from 'react-transition-group'

// class TodoList extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = {items: ['hello', 'world', 'click', 'me']};
//       this.handleAdd = this.handleAdd.bind(this);
//     }
  
//     handleAdd() {
//       const newItems = this.state.items.concat([
//         prompt('Enter some text')
//       ]);
//       this.setState({items: newItems});
//     }
  
//     handleRemove(i) {
//       let newItems = this.state.items.slice();
//       newItems.splice(i, 1);
//       this.setState({items: newItems});
//     }
  
//     render() {
//       const items = this.state.items.map((item, i) => (
//         <div key={item} onClick={() => this.handleRemove(i)}>
//           {item}
//         </div>
//       ));
  
//       return (
//         <div>
//           <button onClick={this.handleAdd}>Add Item</button>
//           <CSSTransitionGroup
//             transitionName="example"
//             transitionEnterTimeout={500}
//             transitionLeaveTimeout={300}>
//             {items}
//           </CSSTransitionGroup>
//         </div>
//       );
//     }
// }
// export default TodoList

import React from 'react'
import './Circle.css'


class MYTEXT extends React.Component {

  render() {

    return (
        <p className="text">Additional Text</p>
    )
  }
}

class Circle extends React.Component {
  render() {

    return (
      <div>
          <div className="square">
              <p className="text">Square text</p>
              <MYTEXT />
          </div>
          <div className="circle">
              <p className="text">Circle text</p>
          </div>
      </div>
    )
  }
}


// function Circle() {

//     return (
//         <div>
//             <div class="square">
//                 <p class="text">Square text</p>
//             </div>
//             <div class="circle">
//                 <p class="text">Circle text</p>
//             </div>
//         </div>
//     )

//     // const [count, setCount] = useState(0)
  
//     // return (
//     //   <div className="App">
//     //     <div>
//     //       <a href="https://vitejs.dev" target="_blank">
//     //         <img src="/vite.svg" className="logo" alt="Vite logo" />
//     //       </a>
//     //       <a href="https://reactjs.org" target="_blank">
//     //         <img src={reactLogo} className="logo react" alt="React logo" />
//     //       </a>
//     //     </div>
//     //     <h1>Vite + React</h1>
//     //     <div className="card">
//     //       <button onClick={() => setCount((count) => count + 1)}>
//     //         count is {count}
//     //       </button>
//     //       <p>
//     //         Edit <code>src/App.jsx</code> and save to test HMR
//     //       </p>
//     //     </div>
//     //     <p className="read-the-docs">
//     //       Click on the Vite and React logos to learn more
//     //     </p>
//     //   </div>
//     // )
// }

export default Circle
