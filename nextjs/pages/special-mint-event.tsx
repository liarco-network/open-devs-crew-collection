import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/SpecialMintEvent.module.scss';
import OdcLogo from '../assets/logo.png';
import OdcWhiteLogo from '../assets/white-logo.png';
import Github from '../assets/icons/github.svg';
import Twitter from '../assets/icons/twitter.svg';
import favicon from '../assets/icon.png';

const Home: NextPage = () => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Head>
        <title>Open Devs Crew - Communities I Love</title>
        <meta name="description" content="Do what you are passionate about, do it to the best of your ability, share it with anyone out there in a generous and selfless way. This is our recipe to make the most of the time we are given. This is Open Devs Crew." />

        <meta property="og:title" content="Open Devs Crew"></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_BASE_URL}/ogimage.jpg`}></meta>
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/`}></meta>

        <link rel="icon" href={favicon.src} />
      </Head>

      <main>
        <img
          className={styles.logo}
          src={OdcLogo.src}
          alt="Open Devs Crew logo"
        />

        <section className={styles.mainText}>
          <h2>Special Mint Event</h2>

          <p>
            Hi everyone, <a href="https://twitter.com/marco_lipparini" target="_blank" rel="noreferrer">Liarco</a> here! 😃<br />
            I&apos;m super excited to announce that we are gonna have a <strong>special mint event</strong> for holders of the three
            Web3 communities I&apos;m proudly part of:
          </p>

          <ul>
            <li><a href="https://opensea.io/collection/degentoonz-collection" target="_blank" rel="noreferrer">DegenToonz</a></li>
            <li><a href="https://opensea.io/collection/sketchy-ape-book-club" target="_blank" rel="noreferrer">Sketchy Ape Book Club</a></li>
            <li><a href="https://opensea.io/collection/lbo" target="_blank" rel="noreferrer">Lazy Bunny NFT</a></li>
          </ul>

          <p>
            I&apos;m part of just a few communities because I&apos;m not very attracted by pure NFT trading, I&apos;m more on the development side of things, but I really love the positive vibe I always feel when I check out Twitter and Discord from these three brands.<br />
            That&apos;s why I want to give an additional chance to these holders to get <strong>one more token</strong> from the <a href="https://opendevs.io/" target="_blank" rel="noreferrer">Open Devs Crew</a> collection for free!
          </p>

          <h3>Here is how it works</h3>
          <p>
            <strong>TL;DR:</strong> if you own a token from one (or more) of the collections above and mint one
            (or more) Open Devs Crew tokens <strong>during the first 12 hours</strong> from launch, you will have a chance to get one
            additional free token (3 tokens will be given away for each partner collection). More details below...
          </p>

          <ul>
            <li><strong>You don&apos;t have to register anywhere</strong> or do anything in order to participate. Owning a partner token and minting an Open Devs Crew token are the only requirements</li>
            <li>Balances for each partner collection might be checked at any point in time from mint to the final extraction, so <strong>please make sure you own at least one partner token for the entire time</strong></li>
            <li>Any wallet address will be accepted except for those directly connected to <strong>Liarco</strong>, <strong>FreaksPix</strong> or <strong>MEP Srl</strong> (these addresses can be found in the contract code)</li>
            <li>The initial 29 airdropped tokens won&apos;t be considered</li>
            <li>The event will start as soon as the public mint is open (<strong>the first mint transaction</strong> on the blockchain will be used as a reference). The official launch date and time will be announced on <a href="https://twitter.com/marco_lipparini" target="_blank" rel="noreferrer">Liarco&apos;s Twitter Profile</a></li>
            <li>We are gonna split the wallets into <strong>three lists, one for each partner collection</strong> (e.g. if the balance for DegenToonz is greater than zero, then you will be added to the DegenToonz list, if you also own at least one Sketchy Ape or a Lazy Bunny, <strong>then you will be added to those lists as well</strong>)</li>
            <li>Each wallet is gonna receive <strong>one entry per minted token</strong>, no matter if it&apos;s a single transaction or multiple ones</li>
            <li>Three <strong>unique addresses</strong> will be randomly extracted from each list and one free token will be transferred to each of them</li>
          </ul>

          <h3>Examples</h3>
          <div className={styles.examplesTableWrapper}>
            <table className={styles.examplesTable}>
              <thead>
                <tr>
                  <th colSpan={2}>Transactions</th>
                  <th colSpan={3}>Owned tokens</th>
                  <th colSpan={3}>Entries in dedicated list</th>
                </tr>
                <tr>
                  <th>Number</th>
                  <th>Tot. minted tokens</th>
                  <th>Toonz</th>
                  <th>Sketchies</th>
                  <th>Bunnies</th>
                  <th>Toonz</th>
                  <th>Sketchies</th>
                  <th>Bunnies</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>1</td>
                  <td>0</td>
                  <td>1</td>
                  <td>0</td>
                  <td>0</td>
                  <td>1</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>5</td>
                  <td>1</td>
                  <td>0</td>
                  <td>0</td>
                  <td>5</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>15</td>
                  <td>2</td>
                  <td>5</td>
                  <td>0</td>
                  <td>15</td>
                  <td>15</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>5</td>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                  <td>5</td>
                  <td>5</td>
                  <td>5</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>10</td>
                  <td>1</td>
                  <td>0</td>
                  <td>2</td>
                  <td>10</td>
                  <td>0</td>
                  <td>10</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Keep safe!</h3>
          <p>
            Please remember:
          </p>

          <ul>
            <li>The only sources of truth for this collection are the <strong>official website</strong> (<a href="https://opendevs.io/" target="_blank" rel="noreferrer">https://opendevs.io</a>) and <strong>Liarco&apos;s Twitter Profile</strong> (<a href="https://twitter.com/marco_lipparini" target="_blank" rel="noreferrer">@marco_lipparini</a>)</li>
            <li>There is <strong>no dedicated Discord server</strong>, your are gonna find official channels on the <a href="https://discord.gg/qh6MWhMJDN" target="_blank" rel="noreferrer">HashLips server</a> soon</li>
            <li>There is <strong>no whitelist</strong>, <strong>no pre-sale</strong>, <strong>no special offer</strong> or airdrop to register for. There will only be <strong>one public sale at fixed price</strong></li>
          </ul>
        </section>

        <footer className={styles.footer}>
          <div>
            <button onClick={scrollToTop}>
              <img src={OdcWhiteLogo.src} alt="Open Devs Crew logo" loading="lazy" />
            </button>

            <ul className={styles.socials}>
              <li className={styles.twitter}>
                <a href="https://twitter.com/marco_lipparini" target="_blank" rel="noreferrer">
                  <img src={Twitter.src} alt="Twitter logo" loading="lazy" />
                </a>
              </li>
              <li className={styles.github}>
                <a href="https://github.com/liarco-network/open-devs-crew-collection" target="_blank" rel="noreferrer">
                  <img src={Github.src} alt="GitHub logo" loading="lazy" />
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </main>
    </>
  )
}

export default Home
