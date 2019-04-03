import React, { Component } from "react";
import "./static/styles/Benchmark.css";

import { tryCall } from "./utils";
import nft from "./nft";
import config from "./config";
import NFT from "./static/abis/NFT.json";
import Query from "./Query";

export default class Benchmark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "0x6EbeAf8e8E946F0716E6533A6f2cefc83f60e8Ab",
      owner: "0x4eb5c09f266a6681f3a7729cd4587cbb1ae3d41e"
    };
  }
  async handleSubmit(event) {
    this.setState({ fetching: true });
    const { web3 } = config;
    event.preventDefault();

    const contractAddress = event.target.address.value;
    const contract = new web3.eth.Contract(NFT, contractAddress);
    window.c = contract;
    const owner = event.target.owner.value;
    const balance = this.setState({
      contract,
      balance: (await tryCall(contract, "balanceOf", owner)).toString(10),
      name: await tryCall(contract, "name"),
      fetching: false
    });
  }

  render() {
    const { balance, name, fetching, contract, address, owner } =
      this.state || {};
    return (
      <div className="Benchmark">
        <h1>Step 1: Load a Smart Contract</h1>
        Select one example from below:
        <ul>
          <li
            onClick={() =>
              this.setState({
                address: "0x6EbeAf8e8E946F0716E6533A6f2cefc83f60e8Ab",
                owner: "0x4eb5c09f266a6681f3a7729cd4587cbb1ae3d41e"
              })
            }
          >
            Gods Unchained
          </li>
          <li
            onClick={() =>
              this.setState({
                address: "0x8bc67d00253fd60b1afcce88b78820413139f4c6",
                owner: "0xfc7a64183f49f71a1d604496e62c08f20af5b5d6"
              })
            }
          >
            CryptoFlowers
          </li>
          <li
            onClick={() =>
              this.setState({
                address: "0xBd13e53255eF917DA7557db1B7D2d5C38a2EFe24",
                owner: "0xf862c9413f2cc21ebfda534ecfa6df4f59f0b197"
              })
            }
          >
            DozerDoll
          </li>
        </ul>
        Or insert your own custom addresses:
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div>
            Contract address:{" "}
            <input
              name="address"
              value={address}
              onChange={e => this.setState({ address: e.target.value })}
              size="40"
            />
          </div>
          <div>
            Owner address:{" "}
            <input
              name="owner"
              value={owner}
              onChange={e => this.setState({ owner: e.target.value })}
              size="40"
            />
          </div>
          <input type="submit" disabled={fetching} />
        </form>
        {balance && (
          <div>
            <h3>Metadata</h3>
            <div>Name: {name}</div>
            <div>Balance: {balance}</div>
            <h1>Step 2: Test different strategies</h1>
            <p>
              <em>
                Note: if you are aware of any caching mechanism that can
                invalidate those results please tell me.
              </em>
            </p>
            <p>
              Check the{" "}
              <a href="https://github.com/vrde/erc721-benchmark/blob/master/src/nft.js">
                source code
              </a>{" "}
              of the different functions.
            </p>
            <Query
              strategy={nft.tokensViaEvents}
              contract={contract}
              owner={owner}
            />
            {/*
            <Query
              strategy={nft.tokensViaEnum}
              contract={contract}
              owner={owner}
            />
            */}
            <Query
              strategy={nft.tokensViaEnum}
              contract={contract}
              owner={owner}
            />
            <Query
              strategy={nft.tokensViaEnumBatch}
              contract={contract}
              owner={owner}
            />
          </div>
        )}
      </div>
    );
  }
}
