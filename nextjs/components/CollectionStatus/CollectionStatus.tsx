import React from 'react';
import { useAccount } from 'wagmi';
import { useTokenContext } from '../../scripts/TokenContext';
import styles from './CollectionStatus.module.scss';

const CollectionStatus = () => {
  const { address } = useAccount();

  const {
    totalSupply,
    maxSupply,
    balanceOfUser,
  } = useTokenContext();

  return (
    <div className={styles.collectionStatus}>
      <div className={styles.userAddress}>
        <span className={styles.label}>Wallet address:</span>
        <span className={styles.address}>{address ?? 'LOADING...'}</span>
      </div>

      <div className={styles.supply}>
        <span className={styles.label}>Supply</span>
        {(totalSupply && maxSupply) ? totalSupply.toNumber()+'/'+maxSupply.toNumber() : 'LOADING...'}
      </div>

      <div className={styles.ownedByUser}>
        <span className={styles.label}>Your tokens</span>
        {balanceOfUser ? balanceOfUser.toNumber() : 'LOADING...'}
      </div>
    </div>
  );
};

export default CollectionStatus;
