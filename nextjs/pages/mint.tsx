import type { NextPage } from 'next';
import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { useTokenContext } from '../scripts/TokenContext';
import CollectionStatus from '../components/CollectionStatus/CollectionStatus';
import MintWidget from '../components/MintWidget/MintWidget';
import OdcLogo from '../assets/logo.png';
import DiscordChannels from '../assets/discord-channels.png';

import styles from '../styles/Mint.module.scss';
import favicon from '../assets/icon.png';

const Mint: NextPage = () => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const [ walletIsConnected, setWalletIsConnected ] = useState(false);
  const MINT_START_TIMESTAMP = (new Date('October 28, 2022 17:00:00 UTC')).getTime() / 1000;
  const isMintTime = ((new Date()).getTime() / 1000) >= MINT_START_TIMESTAMP;
  const timeUntilMint = MINT_START_TIMESTAMP - ((new Date()).getTime() / 1000) + 1;

  const [ isContractConnected, setIsContractConnected ] = useState(isMintTime);

  const {
    isSoldOut
  } = useTokenContext();

  useEffect(() => {
    let timeoutHandle: ReturnType<typeof setTimeout>;

    if (!isMintTime) {
      timeoutHandle = setTimeout(() => setIsContractConnected(true), timeUntilMint * 1000);
    }

    return () => {
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle);
      }
    };
  }, []);

  useEffect(() => {
    setWalletIsConnected(isConnected && !chain?.unsupported);
  }, [ isConnected, chain ]);

  return (
    <>
      <Head>
        <title>Open Devs Crew - Mint Page</title>
        <meta name="description" content="Your open source journey through NFTs, web3 and educational content." />
        
        <meta property="og:title" content="Open Devs Crew - Mint Page"></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_BASE_URL}/ogimage.jpg`}></meta>
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/`}></meta>

        <link rel="icon" href={favicon.src} />
      </Head>

      <main className={styles.mintPage}> 
        <div className={styles.mintingDapp}>
          <img className={styles.logo} src={OdcLogo.src} alt="Open Devs Crew logo" />

          {isContractConnected ? 
            walletIsConnected ?
                <>
                  <CollectionStatus />
                  {isSoldOut ?
                    <section className={styles.collectionSoldOut}>
                      <h2>Sold out!</h2>
                      <p>You can trade with our beloved holders on any Ethereum marketplace such as <a href={`https://opensea.io/collection/open-devs-crew`} target="_blank" rel="noreferrer">OpenSea</a>.</p>
                    </section>
                    :
                    <MintWidget />
                  }
                </>
            :
              <div className={styles.infoBox}>
                <section className={styles.welcomeText}>
                  <h1>Mint is live!</h1>
                  <span>Please make sure you read all the information about this collection on the <a href="/" target="_blank" rel="noreferrer">main website</a>.</span>
                  <span>You can either connect you wallet below or mint directly through <a href={'https://etherscan.io/address/0x5BfBf78d81CD7d255dFA44d9f568375131361775'} target="_blank" rel="noreferrer">etherscan</a>.</span>
                </section>

                <div className={styles.connectButton}>
                  <ConnectButton />
                </div>
              </div>
          :
            <div className={styles.infoBox}>
              <p>Mint is not open yet!</p>
              <p>Please join us during the mint event on <strong>Friday Oct. 28th</strong> at <strong>17:00 UTC</strong>.</p>
            </div>
          }
          <section className={styles.infoBox}>
              <p><strong>Need support?</strong></p>
              <span>Join us on our <a href="https://discord.com/channels/889036571385409556" rel="noreferrer" target="_blank">Discord channel</a></span>
              <img className="rounded-lg" src={DiscordChannels.src} alt="" />
              <span className={styles.footnote}>If you are not part of the <strong>HashLips Discord Server</strong> yet, you can <a href="https://discord.gg/TPmGaMXdHw" rel="noreferrer" target="_blank">click here to join</a></span>
            </section>
        </div>
      </main>
    </>
  );
};

export default Mint;
