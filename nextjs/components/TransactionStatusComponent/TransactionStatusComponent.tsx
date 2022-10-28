import React from 'react';
import { useWaitForTransaction } from 'wagmi';
import styles from './TransactionStatusComponent.module.scss';

const TransactionStatusComponent = ({hash, error}: {hash?: string, error: Error|null}) => {
  const {
    data: transactionData,
    isError: transactionIsError,
  } = useWaitForTransaction({ hash: hash });

  return (<section>
    {hash && <p className={transactionIsError ? styles.error : (transactionData ? styles.success : '')}>Check the transaction on <a href={`https://etherscan.io/tx/${hash}`} target="_blank" rel="noreferrer">Etherscan</a></p>}

    {error && <p className={styles.error}>There has been a problem! Did you reject the transaction?</p>}
  </section>);
};

export default TransactionStatusComponent;
