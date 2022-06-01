import logo from './logo.svg';
import './App.css';
import store from './store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createSlice } from 'redux-inject-helper';
function App() {
  const s = createSlice(store);
  const state = useSelector(state => state[s.name])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {state.ecount}
          Learn React
          {state.count}
        </a>
        <button onClick={() => s.add(1)}>+</button>
        <button onClick={() => s.asyncAdd(3)}>async add</button>
      </header>
    </div>
  );
}

export default App;
