export const GAS_FEE_CONFIG = {
  displayLabel: 'Gas Fee Mainnet From Blockchain',

  allocationPercent: 50,

  recipientType: 'deployer',

  deployerWallet: '0x4cb09bDC03453f190bf4Db8533f458E6551b260D',

  supportedNetworks: [
    {
      network: 'Ethereum Mainnet',
      chainId: 1,
      explorer: 'https://etherscan.io'
    },
    {
      network: 'Ethereum Sepolia',
      chainId: 11155111,
      explorer: 'https://sepolia.etherscan.io'
    },
    {
      network: 'Polygon',
      chainId: 137,
      explorer: 'https://polygonscan.com'
    },
    {
      network: 'Polygon Amoy',
      chainId: 80002,
      explorer: 'https://amoy.polygonscan.com'
    },
    {
      network: 'Arbitrum',
      chainId: 42161,
      explorer: 'https://arbiscan.io'
    },
    {
      network: 'Arbitrum Sepolia',
      chainId: 421614,
      explorer: 'https://sepolia.arbiscan.io'
    },
    {
      network: 'Base',
      chainId: 8453,
      explorer: 'https://basescan.org'
    },
    {
      network: 'Base Sepolia',
      chainId: 84532,
      explorer: 'https://sepolia.basescan.org'
    }
  ]
};
