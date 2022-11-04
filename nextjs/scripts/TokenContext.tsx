import { BigNumber } from 'ethers';
import { useDebounce } from 'use-debounce';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useAccount, useBalance, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { SendTransactionResult } from '@wagmi/core';

interface Props {
  children: ReactNode;
}

interface TokenInterface {
  totalSupply?: BigNumber;
  maxBatchSize: number;
  maxSupply: BigNumber;
  balanceOfUser?: BigNumber;
  mintAmount: number;
  tokenPrice: BigNumber;
  setMintAmount: (amount: number) => void;
  hasEnoughFunds: boolean;
  isReadyToMint: boolean;
  mint: () => void;
  mintLoading: boolean;
  mintTxData?: SendTransactionResult;
  mintError: Error | null;
  isSoldOut: boolean;
}

const TokenContext = createContext({} as TokenInterface);

export function useTokenContext() {
  return useContext(TokenContext);
}

export function TokenProvider({ children }: Props) {
  const { address } = useAccount();
  const { data: walletBalance } = useBalance({ addressOrName: address });
  const [ mintAmount, setMintAmount ] = useState(1);
  const { abi: contractAbi } = require('../../hardhat/artifacts/contracts/OpenDevsCrew.sol/OpenDevsCrew.json');
  const contractAddress = '0x5BfBf78d81CD7d255dFA44d9f568375131361775';
  
  const { data: tokenPriceData } = useContractRead({
    addressOrName: contractAddress,
    contractInterface: contractAbi,
    functionName: 'TOKEN_PRICE',
  }) as unknown as { data: BigNumber };
  
  const { data: maxSupply } = useContractRead({
    addressOrName: contractAddress,
    contractInterface: contractAbi,
    functionName: 'MAX_SUPPLY',
  }) as unknown as { data: BigNumber };
  
  const { data: maxBatchSize } = useContractRead({
    addressOrName: contractAddress,
    contractInterface: contractAbi,
    functionName: 'MAX_BATCH_SIZE',
  }) as unknown as { data: number };

  const [ debouncedMintAmount ] = useDebounce(mintAmount, 200);

  const { data: totalSupply } = useContractRead({
    addressOrName: contractAddress,
    contractInterface: contractAbi,
    functionName: 'totalSupply',
    watch: true,
  });

  const { data: balanceOfUser } = useContractRead({
    addressOrName: contractAddress,
    contractInterface: contractAbi,
    functionName: 'balanceOf',
    args: [ address ],
    watch: true,
  });

  const mintPrice = tokenPriceData !== undefined ? tokenPriceData.mul(mintAmount) : undefined;
  const hasEnoughFunds = mintPrice!== undefined && walletBalance !== undefined && walletBalance.value.gte(mintPrice)

  const { config: mintConfig } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: contractAbi,
    functionName: 'mint',
    args: [ mintAmount, { value: tokenPriceData?.mul(mintAmount) } ],
    enabled: hasEnoughFunds,
  });
  const { data: mintTxData, write: mint, error: mintError, isLoading: mintLoading } = useContractWrite(mintConfig);

  const value: TokenInterface = {
    totalSupply: totalSupply as BigNumber | undefined,
    maxBatchSize,
    maxSupply,
    balanceOfUser: balanceOfUser as BigNumber | undefined,
    mintAmount,
    tokenPrice: tokenPriceData,
    setMintAmount,
    hasEnoughFunds,
    isReadyToMint: Boolean(hasEnoughFunds && mintAmount === debouncedMintAmount),
    mint: () => mint?.(),
    mintLoading,
    mintTxData,
    mintError,
    isSoldOut: Boolean((contractAddress && totalSupply) && (totalSupply as unknown as BigNumber === maxSupply)),
  };

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
}
