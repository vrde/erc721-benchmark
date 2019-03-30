import React, { Component } from "react";
import Enumerate from "./Enumerate";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">ERC721 Benchmark</header>
        <Enumerate />
      </div>
    );
  }
}

export default App;
