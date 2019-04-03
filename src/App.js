import React, { Component } from "react";
import Benchmark from "./Benchmark";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>ERC721 Benchmark</h1>
          <p>
            <em>
              Note: there might be some errors not handled yet, please keep the
              browser debugging console open.
            </em>
          </p>
          <p>
            Source code on GitHub:{" "}
            <a href="https://www.github.com/vrde/erc721-benchmark">
              github.com/vrde/erc721-benchmark
            </a>
            .
          </p>
          <p>
            The{" "}
            <a href="https://eips.ethereum.org/EIPS/eip-721">ERC721 standard</a>{" "}
            interface doesn't expose any method to get the list of token ids
            owned by a user. A method to query the tokens of a user would result
            would be too expensive to run on chain(
            <a href="https://github.com/OpenZeppelin/openzeppelin-solidity/issues/1064#issuecomment-462837092">
              comment 1
            </a>
            ,{" "}
            <a href="https://github.com/OpenZeppelin/openzeppelin-solidity/pull/856#issuecomment-406723880">
              comment 2
            </a>
            ), and this would result in a security hole. Instead,{" "}
            <code>tokensOf</code> returns the <strong>total amount</strong> of
            tokens owned by a user. The standard enforces to emit a{" "}
            <code>
              Transfer(address indexed _from, address indexed _to, uint256
              indexed _tokenId)
            </code>{" "}
            every time a token is transferred. Events can be used to get the
            list of tokens owned by a user. This approach queries the{" "}
            <code>Transfer</code> events emitted by the smart contract that
            holds the tokens. As we will see later, quering for events is a slow
            operation that might fail.
          </p>
          <p>
            ERC721 describes an optional enumeration extension to make the list
            of tokens fully discoverable. The <a href="">ERC721Enumerable</a>{" "}
            interface defines a new method{" "}
            <code>tokenOfOwnerByIndex(address _owner, uint256 _index)</code>.
            This combined with <code>balanceOf</code> allow us to iterate over
            the tokens of a user to get the token ids. This approach is much
            faster and reliable.
          </p>
          <h2>Playground</h2>
          <p>
            Try the different fetching strategies yourself. Load a smart
            contract and test the performance.
          </p>
        </header>
        <Benchmark />
      </div>
    );
  }
}

export default App;
