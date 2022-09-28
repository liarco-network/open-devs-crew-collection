import type { NextPage } from 'next';
import Head from 'next/head';
import { StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.scss';
import OdcLogo from '../assets/logo.png';
import TwitterLogo from '../assets/twitter-logo.svg';
import GroupThree from '../assets/group-3.png';
import GroupFive from '../assets/group-5.png';

const Home: NextPage = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [charactersGroupImage, setCharactersGroupImage] = useState<StaticImageData>();

  useEffect(() => {
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const handleWindowResize = () => {
    setWindowWidth(window.innerWidth);
    document.body.style.setProperty('--v-height', `${window.innerHeight}px`);
    updateCharactersImage();
  }

  const updateCharactersImage = () => {
    if (window.innerWidth > 500) {
      setCharactersGroupImage(GroupFive);

      return;
    }

    setCharactersGroupImage(GroupThree);
  }

  return (
    <>
      <Head>
        <title>Open Devs Crew</title>
        <meta name="description" content="Your open source journey through NFTs, web3 and educational content is coming soon..." />
        
        <meta property="og:title" content="Open Devs Crew"></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_BASE_URL}/ogimage.jpg`}></meta>
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/`}></meta>
      </Head>

      <main className={styles.main}>
        <div className={styles.logoContainer}>
          <img
            className={styles.logo}
            src={OdcLogo.src}
            alt="Open Devs Crew logo"
          />
        </div>

        <div className={styles.stainedContainer}>
          <div className={styles.infoContainer}>
              <p>
                Your open source journey through
                NFTs, web3 and educational content
                is coming soon...
              </p>

              <a className={styles.twitterButton} href="https://twitter.com/marco_lipparini" target="_blank" rel="noreferrer">
                <img 
                  src={TwitterLogo.src}
                  alt="Twitter logo"
                />
                Keep in touch
              </a>
            </div>
          </div>
      </main>
      <div className={styles.charactersContainer}>
          {(windowWidth !== 0 && charactersGroupImage !== undefined) &&
            <img
              className={styles.tokensGroup}
              src={charactersGroupImage.src}
              alt={"Image of " + (charactersGroupImage.src === GroupFive.src ? "five" : "three") + " characters"}
            />
          }
        </div>
    </>
  )
}

export default Home
