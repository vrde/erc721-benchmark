import { sha3, padLeft } from "web3-utils";

import { hasMethod } from "./utils";
import config from "./config";
import NFT from "./static/abis/NFT.json";

export default class ERC721 {
  constructor(address) {
    this.web3 = config.web3;
    this.address = address;
    this.contract = new this.web3.eth.Contract(NFT, address);
  }

  async isEnumerable() {
    return await hasMethod(
      this.web3,
      this.address,
      "tokenOfOwnerByIndex(address,uint256)"
    );
  }

  async name() {
    return await this.contract.methods.name().call();
  }

  // Inspired by:
  // https://github.com/TimDaub/ERC721-wallet/blob/master/src/sagas/fetchTransactions.js
  async *tokensViaEvents(owner) {
    const outputs = await this.contract.getPastEvents("Transfer", {
      fromBlock: 0,
      toBlock: "latest",
      topics: [
        sha3("Transfer(address,address,uint256)"),
        padLeft(owner, 64),
        null
      ]
    });

    const inputs = await this.contract.getPastEvents("Transfer", {
      fromBlock: 0,
      toBlock: "latest",
      topics: [
        sha3("Transfer(address,address,uint256)"),
        null,
        padLeft(owner, 64)
      ]
    });

    for (let i = 0; i < outputs.length; i++) {
      const outputTokenId = outputs[i].returnValues.tokenId;
      for (let j = 0; j < inputs.length; j++) {
        const inputTokenId = inputs[j].returnValues.tokenId;
        if (outputTokenId === inputTokenId) {
          inputs.splice(j, 1);
        }
      }
    }
    for (let i = 0; i < inputs.length; i++) {
      yield inputs[i].returnValues.tokenId;
    }
  }

  async *tokensViaEnumSync(owner) {
    const n = await this.balanceOf(owner);
    for (let i = 0; i < n; i++) {
      yield await this.contract.methods.tokenOfOwnerByIndex(owner, i).call();
    }
  }

  async *tokensViaEnum(owner) {
    const { web3 } = config;
    const n = await this.balanceOf(owner);

    let promises = {};

    for (let i = 0; i < n; i++) {
      promises[i] = new Promise((resolve, reject) =>
        this.contract.methods
          .tokenOfOwnerByIndex(owner, i)
          .call()
          .then(r => resolve([i, r]))
      );
    }
    while (Object.values(promises).length) {
      let [i, v] = await Promise.race(Object.values(promises));
      delete promises[i];
      yield v;
    }
  }

  async *tokensViaEnumBatch(owner) {
    const { web3 } = config;
    const n = await this.balanceOf(owner);

    let promises = {};
    const batch = new web3.BatchRequest();

    for (let i = 0; i < n; i++) {
      promises[i] = new Promise((resolve, reject) =>
        batch.add(
          this.contract.methods
            .tokenOfOwnerByIndex(owner, i)
            .call.request({ from: owner }, (a, b) => resolve([i, b]))
        )
      );
    }
    batch.execute();
    while (Object.values(promises).length) {
      let [i, v] = await Promise.race(Object.values(promises));
      delete promises[i];
      yield v;
    }
  }

  async balanceOf(owner) {
    return await this.contract.methods.balanceOf(owner).call();
  }
}
