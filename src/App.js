import React, { Component } from "react";
import Benchmark from "./Benchmark";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>ERC721 Benchmark</h1>
          <p>
            Note: there might be some errors not handled yet, please keep the
            browser debugging console open.
          </p>
        </header>
        <Benchmark />
      </div>
    );
  }
}

export default App;
