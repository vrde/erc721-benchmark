import Utils from "web3-utils";

// Inspired by:
// https://github.com/TimDaub/ERC721-wallet/blob/master/src/sagas/fetchTransactions.js
export async function tokensViaEvents(contract, address) {
  const outputs = await contract.getPastEvents("Transfer", {
    fromBlock: 0,
    toBlock: "latest",
    topics: [
      Utils.sha3("Transfer(address,address,uint256)"),
      Utils.padLeft(address, 64),
      null
    ]
  });
  console.log(outputs);
  const inputs = await contract.getPastEvents("Transfer", {
    fromBlock: 0,
    toBlock: "latest",
    topics: [
      Utils.sha3("Transfer(address,address,uint256)"),
      null,
      Utils.padLeft(address, 64)
    ]
  });

  console.log(inputs);
  for (let i = 0; i < outputs.length; i++) {
    const outputTokenId = outputs[i].returnValues.tokenId;
    for (let j = 0; j < inputs.length; j++) {
      const inputTokenId = inputs[j].returnValues.tokenId;
      if (outputTokenId === inputTokenId) {
        inputs.splice(j, 1);
      }
    }
  }
  return inputs.map(x => x.returnValues.tokenId);
}

export async function balanceOf(contract, address) {
  return await contract.methods.balanceOf(address).call();
}

export default {
  tokensViaEvents,
  balanceOf
};
