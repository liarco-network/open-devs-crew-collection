import { ethers, utils } from 'ethers';
import React from 'react';
import { useWaitForTransaction } from 'wagmi';
import { useTokenContext } from '../../scripts/TokenContext';
import TransactionStatusComponent from '../TransactionStatusComponent/TransactionStatusComponent';
import styles from './MintWidget.module.scss';
import AnymalCosplays from '../../assets/animal-cosplays/anymal-cosplays.jpg';

const MintWidget = () => {
  const {
    maxBatchSize,
    mintAmount,
    tokenPrice,
    setMintAmount,
    isReadyToMint,
    mint,
    mintLoading,
    mintTxData,
    mintError,
  } = useTokenContext();

  const {
    isLoading: transactionIsLoading,
  } = useWaitForTransaction({ hash: mintTxData?.hash });

  const handleDecreaseMintAmountClick = () => {
    setMintAmount(Math.max(mintAmount - 1, 1));
  };

  const handleIncreaseMintAmountClick = () => {
    setMintAmount(Math.min(mintAmount + 1, maxBatchSize));
  };

  const handleMintClick = () => {
    mint?.();
  };

  return (
    <>
      <TransactionStatusComponent hash={mintTxData?.hash} error={mintError}/>

      <div className={`${styles.mintWidget} ${(mintLoading || transactionIsLoading) ? 'loading' : ''}`}>
        <div className={styles.preview}>
            <img src={AnymalCosplays.src} alt="Collection preview" />
        </div>

        <div className={styles.price}>
          <strong>Total price:</strong> {utils.formatEther(tokenPrice.mul(mintAmount))} ETH
        </div>

        <div className={styles.priceComposition}>
          <div className={styles.tokenPrice}>
            <span className={styles.label}>Token price</span>
            {ethers.utils.formatEther(tokenPrice)} ETH
          </div>
          <div className={styles.maxBatch}>
            <span className={styles.label}>Max batch size</span>
            {maxBatchSize}
          </div>
        </div>

        <div className={styles.controls}>
          <button className={styles.decrease} onClick={handleDecreaseMintAmountClick}>-</button>
          <span className={styles.mintAmount}>{mintAmount}</span>
          <button className={styles.increase} onClick={handleIncreaseMintAmountClick}>+</button>
          <button className={styles.primary} onClick={handleMintClick} disabled={!isReadyToMint}>Mint</button>
        </div>
      </div>
    </>
  );
};

export default MintWidget;
