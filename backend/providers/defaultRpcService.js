import {
  getDefaultRpcConfig
} from "./defaultRpcProvider.js";

export async function defaultRpcRequest(
  networkId,
  method,
  params = []
) {
  const config =
    getDefaultRpcConfig(
      networkId
    );

  const response =
    await fetch(
      config.rpcUrl,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method,
          params
        })
      }
    );

  if (!response.ok) {
    throw new Error(
      `Default RPC HTTP error: ${response.status}`
    );
  }

  const data =
    await response.json();

  if (data.error) {
    throw new Error(
      data.error.message ||
      "Default RPC request gagal."
    );
  }

  return data.result;
}

export async function getDefaultLatestBlock(
  networkId
) {
  return defaultRpcRequest(
    networkId,
    "eth_blockNumber"
  );
}

export async function getDefaultBalance(
  networkId,
  address
) {
  if (!address) {
    throw new Error(
      "Address wajib diberikan."
    );
  }

  return defaultRpcRequest(
    networkId,
    "eth_getBalance",
    [
      address,
      "latest"
    ]
  );
}

export async function getDefaultTransaction(
  networkId,
  txHash
) {
  if (!txHash) {
    throw new Error(
      "Transaction hash wajib diberikan."
    );
  }

  return defaultRpcRequest(
    networkId,
    "eth_getTransactionByHash",
    [txHash]
  );
}

export async function getDefaultTransactionReceipt(
  networkId,
  txHash
) {
  if (!txHash) {
    throw new Error(
      "Transaction hash wajib diberikan."
    );
  }

  return defaultRpcRequest(
    networkId,
    "eth_getTransactionReceipt",
    [txHash]
  );
}
