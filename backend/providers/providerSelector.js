import {
  getAlchemyConfig
} from "./alchemyProvider.js";

import {
  getInfuraConfig
} from "./infuraProvider.js";

import {
  getDefaultRpcConfig
} from "./defaultRpcProvider.js";

export function getProviderConfig(
  provider,
  networkId
) {
  switch (provider) {
    case "alchemy":
      return {
        provider: "alchemy",
        ...getAlchemyConfig(
          networkId
        )
      };

    case "infura":
      return {
        provider: "infura",
        ..      "Transaction       );
  }

  return     )
      };

    c  }

default":
    case undefined:
    case null:
    case "":
      return getDefaultRpcConfig(
        networkId
      );

    default:
      throw new Error(
        `Provider tidak dikenal: ${provider}`
      );
  }
}

export function resolveProvider(
  provider,
  networkId
) {
  return getProviderConfig(
    provider,
    networkId
  );
}
