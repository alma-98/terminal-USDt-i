import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../../firebase';

export const REFILL_COLLECTION =
  'refills';

export async function createRefillRecord({
  role,
  coinId,
  amount,
  deployerWalletId,
  user,
  blockchainMode = 'Application Mode',
}) {
  if (role !== 'Super Admin') {
    throw new Error(
      'Refill hanya dapat dilakukan oleh Super Admin.',
    );
  }

  if (!coinId) {
    throw new Error('Coin wajib dipilih.');
  }

  if (!amount || Number(amount) <= 0) {
    throw new Error(
      'Amount harus lebih besar dari 0.',
    );
  }

  if (!deployerWalletId) {
    throw new Error(
      'Active Deployer Wallet wajib dipilih.',
    );
  }

  const walletRef = doc(
    db,
    'wallets',
    deployerWalletId,
  );

  const walletSnapshot =
    await getDoc(walletRef);

  if (!walletSnapshot.exists()) {
    throw new Error(
      'Deployer Wallet tidak ditemukan.',
    );
  }

  const wallet = walletSnapshot.data();

  if (wallet.type !== 'deployer') {
    throw new Error(
      'Wallet yang dipilih bukan Deployer Wallet.',
    );
  }

  if (wallet.active !== true) {
    throw new Error(
      'Deployer Wallet harus ACTIVE.',
    );
  }

  const ref = await addDoc(
    collection(db, REFILL_COLLECTION),
    {
      coinId,
      amount: String(amount),

      deployerWalletId,

      lifetime: true,

      tenorId: null,
      expiresAt: null,

      status:
        blockchainMode === 'Smart Contract Mode'
          ? 'PENDING_BLOCKCHAIN'
          : 'COMPLETED_INTERNAL',

      blockchainMode,

      txHash: null,
      explorerUrl: null,

      createdBy: user || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );

  return {
    id: ref.id,
    lifetime: true,
    txHash: null,
  };
}
