import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import Book from './components/book'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Book/>
      </header>
    </div>
  );
}

export default App;
