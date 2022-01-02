import React, { useEffect } from 'react';
import logo from './logo.svg';
import init, { fib } from './wasm/algo_visualizer';
import './App.css';

declare global {
  const wasm: any | undefined;
}

async function loadWasm(): Promise<void> {
  console.log(typeof wasm);
  if (typeof wasm !== 'undefined') {
    console.log('wasm already loaded');
    return;
  }

  await init();
  console.log('wasm loaded!');
}

function App() {
  let f = 0;

  async function doFib(): Promise<void> {
    for (let i = 0; i < 15; i++) {
      await loadWasm();
    f = fib(6);
    console.log(f);
    }
    
  }

  useEffect(() => {
    doFib();
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload {f}.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
