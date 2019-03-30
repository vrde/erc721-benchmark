import React, { Component } from "react";

import { tryCall } from "./utils";
import nft from "./nft";
import config from "./config";
import NFT from "./static/abis/NFT.json";
import Query from "./Query";

export default class Benchmark extends Component {
  async handleSubmit(event) {
    this.setState({ fetching: true });
    const { web3 } = config;
    event.preventDefault();

    const contractAddress = event.target.contract.value;
    const contract = new web3.eth.Contract(NFT, contractAddress);
    window.c = contract;
    const owner = event.target.owner.value;
    const balance = this.setState({
      contract,
      owner,
      balance: (await tryCall(contract, "balanceOf", owner)).toString(10),
      name: await tryCall(contract, "name"),
      fetching: false
    });
  }

  fetchTokens(contract, owner) {}

  render() {
    const { balance, name, fetching, contract, owner } = this.state || {};
    return (
      <div className="Benchmark">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div>
            Contract address:{" "}
            <input
              name="contract"
              defaultValue="0xa98ad92a642570b83b369c4eb70efefe638bc895"
              size="40"
            />
          </div>
          <div>
            Owner address:{" "}
            <input
              name="owner"
              defaultValue="0x61ecb6963840640df2a3c9ee0f2025179f630679"
              size="40"
            />
          </div>
          <input type="submit" disabled={fetching} />
        </form>
        <h2>Metadata</h2>
        <div>Name: {name}</div>
        <div>Balance: {balance}</div>
        <Query
          strategy={nft.tokensViaEvents}
          contract={contract}
          owner={owner}
        />
      </div>
    );
  }
}
