import Web3 from "web3";

function resolveWeb3(resolve, localProvider, authentication) {
  let web3;

  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    if (authentication === true) {
      try {
        window.ethereum.enable().then(() => resolve(web3));
      } catch (err) {
        console.log(err);
      }
    } else {
      resolve(web3);
    }
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
    resolve(web3);
  } else {
    if (authentication === true) {
      throw new Error(
        "Non-Ethereum browser detected. Cannot work in authenticated mode"
      );
    }
    web3 = new Web3(localProvider);
    console.log(`Non-Ethereum browser detected. Using ${localProvider}.`);
    resolve(web3);
  }
}

function getWeb3(localProvider, authentication) {
  localProvider = localProvider || "http://localhost:8545";

  return new Promise(resolve => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", () => {
      resolveWeb3(resolve, localProvider, authentication);
    });
    // If document has loaded already, try to get Web3 immediately.
    if (document.readyState === "complete") {
      resolveWeb3(resolve, localProvider, authentication);
    }
  });
}

export function loadWeb3(localProvider) {
  return getWeb3(localProvider, true);
}
