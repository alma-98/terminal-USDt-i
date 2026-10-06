import { PANCAKESWAP_ROUTER_METHODS } from './swapConfig.js';

const ERC20_ABI = [
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
];

const ROUTER_ABI = [
  {
    name: 'getAmountsOut',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'path', type: 'address[]' },
    ],
    outputs: [{ name: 'amounts', type: 'uint256[]' }],
  },
  {
    name: 'swapExactTokensForTokens',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'amountOutMin', type: 'uint256' },
      { name: 'path', type: 'address[]' },
      { name: 'to', type: 'address' },
      { name: 'deadline', type: 'uint256' },
    ],
    outputs: [{ name: 'amounts', type: 'uint256[]' }],
  },
];

function getEthereumProvider() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Wallet Extension tidak ditemukan.');
  }

  return window.ethereum;
}

export async function getAllowance({
  tokenAddress,
  ownerAddress,
  routerAddress,
}) {
  const provider = getEthereumProvider();

  return provider.request({
    method: 'eth_call',
    params: [
      {
        to: tokenAddress,
        data: encodeAllowance(ownerAddress, routerAddress),
      },
      'latest',
    ],
  });
}

function encodeAllowance(owner, spender) {
  // allowance(address,address)
  const selector = 'dd62ed3e';
  const a = owner.replace(/^0x/, '').padStart(64, '0');
  const b = spender.replace(/^0x/, '').padStart(64, '0');
  return `0x${selector}${a}${b}`;
}

export async function requestApproval({
  tokenAddress,
  routerAddress,
  amountHex,
  from,
}) {
  const provider = getEthereumProvider();

  const selector = '095ea7b3';
  const spender = routerAddress.replace(/^0x/, '').padStart(64, '0');
  const amount = amountHex.replace(/^0x/, '').padStart(64, '0');

  return provider.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from,
        to: tokenAddress,
        data: `0x${selector}${spender}${amount}`,
      },
    ],
  });
}

export async function requestSwapTransaction({
  routerAddress,
  from,
  amountInHex,
  amountOutMinHex,
  path,
  recipient,
  deadline,
}) {
  const provider = getEthereumProvider();

  if (!routerAddress) throw new Error('Router address wajib tersedia.');
  if (!path || path.length < 2) {
    throw new Error('Swap path tidak valid.');
  }

  /*
   * Transaction dibuat untuk Wallet Extension.
   * Wallet Extension yang melakukan signing.
   * Private key / seed phrase tidak pernah masuk ke aplikasi.
   *
   * ABI encoding dilakukan oleh provider/wallet integration
   * yang tersedia di tahap berikutnya.
   */

  return provider.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from,
        to: routerAddress,
        value: '0x0',
        data: encodeSwapExactTokensForTokens({
          amountInHex,
          amountOutMinHex,
          path,
          recipient,
          deadline,
        }),
      },
    ],
  });
}

function encodeSwapExactTokensForTokens({
  amountInHex,
  amountOutMinHex,
  path,
  recipient,
  deadline,
}) {
  /*
   * Selector:
   * swapExactTokensForTokens(uint256,uint256,address[],address,uint256)
   */
  const selector = '38ed1739';

  const amountIn = amountInHex.replace(/^0x/, '').padStart(64, '0');
  const amountOutMin = amountOutMinHex.replace(/^0x/, '').padStart(64, '0');
  const recipientWord = recipient.replace(/^0x/, '').padStart(64, '0');
  const deadlineWord = BigInt(deadline).toString(16).padStart(64, '0');

  const offsetPath = (5 * 32).toString(16).padStart(64, '0');
  const pathLength = path.length.toString(16).padStart(64, '0');

  const pathData = path
    .map((address) =>
      address.replace(/^0x/, '').padStart(64, '0')
    )
    .join('');

  return `0x${selector}${amountIn}${amountOutMin}${offsetPath}${recipientWord}${deadlineWord}${pathLength}${pathData}`;
}

export const PancakeSwapMethods = Object.freeze({
  getAmountsOut: PANCAKESWAP_ROUTER_METHODS.getAmountsOut,
  approve: PANCAKESWAP_ROUTER_METHODS.approve,
  allowance: PANCAKESWAP_ROUTER_METHODS.allowance,
  swapExactTokensForTokens:
    PANCAKESWAP_ROUTER_METHODS.swapExactTokensForTokens,
});
