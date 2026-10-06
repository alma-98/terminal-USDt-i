import {
  getAlchemyConfig
} from "./alchemyProvider.js";

export async function alchemyRpcRequest(
  networkId,
  method,
  params = []
) {
  const config =
    getAlchemyConfig(networkId);

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
      `Alchemy RPC HTTP error: ${response.status}`
    );
  }

  const data =
    await response.json();

  if (data.error) {
    throw new Error(
      data.error.message ||
      "Alchemy RPC request gagal."
    );
  }

  return data.result;
}

export async function getLatestBlock(
  networkId
) {
  return alchemyRpcRequest(
    networkId,
    "eth_blockNumber"
  );
}

export async function getBalance(
  networkId,
  address
) {
  if (!address) {
    throw new Error(
      "Address wajib diberikan."
    );
  }

  return alchemyRpcRequest(
    networkId,
    "eth_getBalance",
    [
      address,
      "latest"
    ]
  );
}

export async function getTransaction(
  networkId,
  txHash
) {
  if (!txHash) {
    throw new Error(
      "Transaction hash wajib diberikan."
    );
  }

  return alchemyRpcRequest(
    networkId,
    "eth_getTransactionByHash",
    [txHash]
  );
}

export async function getTransactionReceipt(
  networkId,
  txHash
) {
  if (!txHash) {
    throw new Error(
      "Transaction hash wajib diberikan."
    );
  }

  return alchemyRpcRequest(
    networkId,
    "eth_getTransactionReceipt",
    [txHash]
  );
}
