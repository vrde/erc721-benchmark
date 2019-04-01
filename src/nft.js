import { sha3, padLeft } from "web3-utils";
import config from "./config";

// Inspired by:
// https://github.com/TimDaub/ERC721-wallet/blob/master/src/sagas/fetchTransactions.js
async function* tokensViaEvents(contract, address) {
  const outputs = await contract.getPastEvents("Transfer", {
    fromBlock: 0,
    toBlock: "latest",
    topics: [
      sha3("Transfer(address,address,uint256)"),
      padLeft(address, 64),
      null
    ]
  });

  console.log("outputs", outputs);

  const inputs = await contract.getPastEvents("Transfer", {
    fromBlock: 0,
    toBlock: "latest",
    topics: [
      sha3("Transfer(address,address,uint256)"),
      null,
      padLeft(address, 64)
    ]
  });

  console.log("inputs", inputs);

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

async function* tokensViaEnum(contract, address) {
  const n = await balanceOf(contract, address);
  try {
    for (let i = 0; i < n; i++) {
      yield await contract.methods.tokenOfOwnerByIndex(address, i).call();
    }
  } catch (e) {}
}

async function* tokensViaEnumFullyAsync(contract, address) {
  const { web3 } = config;
  const n = await balanceOf(contract, address);

  let promises = {};

  try {
    for (let i = 0; i < n; i++) {
      promises[i] = new Promise((resolve, reject) =>
        contract.methods
          .tokenOfOwnerByIndex(address, i)
          .call()
          .then(r => resolve([i, r]))
      );
    }
  } catch (e) {}
  while (Object.values(promises).length) {
    let [i, v] = await Promise.race(Object.values(promises));
    delete promises[i];
    yield v;
  }
}

async function balanceOf(contract, address) {
  return await contract.methods.balanceOf(address).call();
}

export default {
  tokensViaEvents,
  tokensViaEnum,
  tokensViaEnumFullyAsync,
  balanceOf
};
