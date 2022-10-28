import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import useCollapse from 'react-collapsed';
import styles from '../styles/Home.module.scss';
import OdcLogo from '../assets/logo.png';
import OdcWhiteLogo from '../assets/white-logo.png';
import HeroCharacter from '../assets/hero-character.png';
import Github from '../assets/icons/github.svg';
import GithubBlack from '../assets/icons/github-black.svg';
import Twitter from '../assets/icons/twitter.svg';
import OpenSea from '../assets/icons/opensea.svg';
import EloCharacters from '../assets/elo.png';
import SadGangCharacter from '../assets/sad-gang.jpg';
import BrandCharacter from '../assets/the-brand.jpg';
import AnymalCosplays from '../assets/animal-cosplays/anymal-cosplays.jpg';
import ACLlama from '../assets/animal-cosplays/llama.png';
import ACUnknown from '../assets/animal-cosplays/unknown.png';
import NFSCard from '../assets/nfs.png';
import DecentralizedIcon from '../assets/icons/decentralized.svg';
import DetailsIcon from '../assets/icons/details.svg';
import ExperienceIcon from '../assets/icons/experience.svg';
import QualityIcon from '../assets/icons/quality.svg';
import StructureIcon from '../assets/icons/structure.svg';
import TrustIcon from '../assets/icons/trust.svg';
import LiarcoPic from '../assets/team/liarco-picture.jpg';
import FreaksPixPic from '../assets/team/freakspix-picture.jpg';
import MepPic from '../assets/team/mep-picture.jpg';
import HashLipsLogo from '../assets/partners/hashlips-logo.svg';
import HashLipsLabLogo from '../assets/partners/hashlipslab-logo.svg';
import SketchyLabsLogo from '../assets/partners/sketchylabs-logo.svg';
import DownArrow from '../assets/down-arrow.svg';
import favicon from '../assets/icon.png';

const Home: NextPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [canClick, setCanClick] = useState<boolean>(true);
  const [githubButtonInView, setGithubButtonInView] = useState(false);
  const MINT_START_TIMESTAMP = (new Date('October 28, 2022 17:00:00 UTC')).getTime() / 1000;
  //const MINT_START_TIMESTAMP = (new Date('October 27, 2022 17:00:00 UTC')).getTime() / 1000;
  const isMintTime = ((new Date()).getTime() / 1000) >= MINT_START_TIMESTAMP;
  const [ isMintOpen, setIsMintOpen ] = useState(isMintTime);

  // Collapsible elements
  const {
    getCollapseProps: getCollapsePropsLiarco,
    getToggleProps: getTogglePropsLiarco,
    isExpanded: isExpandedLiarco,
  } = useCollapse();
  const {
    getCollapseProps: getCollapsePropsFreaksPix,
    getToggleProps: getTogglePropsFreaksPix,
    isExpanded: isExpandedFreaksPix,
  } = useCollapse();
  const {
    getCollapseProps: getCollapsePropsMep,
    getToggleProps: getTogglePropsMep,
    isExpanded: isExpandedMep,
  } = useCollapse();

  const handleGithubScroll = () => {
    const footerElementHeight = document.getElementsByTagName("footer")[0]!.clientHeight;
    const footerOffsetHeight = document.body.scrollHeight - footerElementHeight - window.innerHeight;

    if (window.scrollY >= window.innerHeight && window.scrollY < footerOffsetHeight) {
      setGithubButtonInView(true);

      return;
    }

    setGithubButtonInView(false);
  };

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setCanClick(true);

      return;
    }

    if (menuOpen) {
      setMenuOpen(false);
    }

    setCanClick(false);
  };

  const handleMobileNavClick = () => {
    if (canClick) {
      setMenuOpen(!menuOpen);
    }
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  useEffect(() => {
    window.addEventListener('scroll', handleGithubScroll);
    window.addEventListener('resize', handleResize);

    const mintWaitInterval = setInterval(() => {
      if ( !isMintTime ) {
        return;
      }

      setIsMintOpen(true);

      clearInterval(mintWaitInterval);
    }, 1000);

    handleResize();
    handleGithubScroll();

    return () => {
      window.removeEventListener('scroll', handleGithubScroll);
      window.removeEventListener('resize', handleResize);
      clearInterval(mintWaitInterval);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Open Devs Crew</title>
        <meta name="description" content="Your open source journey through NFTs, web3 and educational content." />
        
        <meta property="og:title" content="Open Devs Crew"></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_BASE_URL}/ogimage.jpg`}></meta>
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/`}></meta>

        <link rel="icon" href={favicon.src} />
      </Head>
      
      <main>
        <a
          id={styles.githubContainer}
          className={githubButtonInView ? styles.githubButtonView : styles.githubButtonHidden}
          href="https://github.com/liarco-network/open-devs-crew-collection" target="_blank" rel="noreferrer"
        >
          <p>GitHub</p>
          <img src={Github.src} alt="GitHub logo" />
        </a>

       <nav className={styles.navigation}>
          <button onClick={handleMobileNavClick} className={menuOpen ? styles.buttonOpen : styles.buttonClosed}>
            <span></span>
          </button>

          <div className={`${menuOpen ? styles.navOpen : styles.navClosed} ${styles.navMenu}`}>
            <a onClick={() => { setMenuOpen(false); scrollToTop() }} >
              <img
                className={styles.logo}
                src={OdcLogo.src}
                alt="Open Devs Crew logo"
              />
            </a>

            <ul className={styles.links}>
              <li><a onClick={() => setMenuOpen(false)} href="#brand">The Brand</a></li>
              <li><a onClick={() => setMenuOpen(false)} href="#collection">The Collection</a></li>
              <li><a onClick={() => setMenuOpen(false)} href="#team">The Team</a></li>
              <li><a onClick={() => setMenuOpen(false)} href="#web3-partners">Web3 Partners</a></li>
              <li><a onClick={() => setMenuOpen(false)} href="#blueprint">The Blueprint</a></li>
            </ul>

            <ul className={styles.socials}>
              <li className={styles.twitter}>
                <a href="https://twitter.com/marco_lipparini" target="_blank" rel="noreferrer">
                  <img src={Twitter.src} alt="Twitter logo" />
                </a>
              </li>
              <li className={styles.github}>
                <a href="https://github.com/liarco-network/open-devs-crew-collection" target="_blank" rel="noreferrer">
                  <img src={GithubBlack.src} alt="GitHub logo" />
                </a>
              </li>
              <li className={styles.opensea}>
                <a href="https://opensea.io/collection/open-devs-crew" target="_blank" rel="noreferrer">
                  <img src={OpenSea.src} alt="OpenSea logo" />
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <header className={styles.hero}>
          <div>
            <div className={styles.heroContainer}>
              <img
                className={styles.logo}
                src={OdcLogo.src}
                alt="Open Devs Crew logo"
              />

              <p>Your access pass to dev support and open source educational Web3 content!</p>

              <ul className={styles.socials}>
                <li className={styles.twitter}>
                  <a href="https://twitter.com/marco_lipparini" target="_blank" rel="noreferrer">
                    <img src={Twitter.src} alt="Twitter logo" />
                  </a>
                </li>
                <li className={styles.github}>
                  <a href="https://github.com/liarco-network/open-devs-crew-collection" target="_blank" rel="noreferrer">
                    <img src={Github.src} alt="GitHub logo" />
                  </a>
                </li>
                <li className={styles.opensea}>
                  <a href="https://opensea.io/collection/open-devs-crew" target="_blank" rel="noreferrer">
                    <img src={OpenSea.src} alt="OpenSea logo" />
                  </a>
                </li>
              </ul>
            </div>

            <img
              className={styles.character}
              height={HeroCharacter.height}
              width={HeroCharacter.width}
              src={HeroCharacter.src}
              alt="Hero character"
            />
          </div>
        </header>

        <section id="mint" className={styles.mint}>
          <div className="wrapper">
          {isMintOpen ? <>
            <h2>Mint is live!</h2>

            <p>If you have any questions or you need <strong>support during the mint</strong>, please feel free to join our <a href="https://discord.com/channels/889036571385409556" rel="noreferrer" target="_blank">Discord channel</a> on the <a href="https://discord.gg/TPmGaMXdHw" rel="noreferrer" target="_blank">HashLips server</a>.</p>

            <a href="/mint" className={styles.btn}>Mint now!</a>
          </>
          : <>
            <h2>We are almost there!</h2>

            <p>The mint will open on <strong>Friday Oct. 28th at 5:00pm UTC</strong>. If you have any questions, please feel free to join our <a href="https://discord.com/channels/889036571385409556" rel="noreferrer" target="_blank">Discord channel</a> on the <a href="https://discord.gg/TPmGaMXdHw" rel="noreferrer" target="_blank">HashLips server</a> or ask publicly on <a href="https://twitter.com/marco_lipparini" target="_blank" rel="noreferrer">Twitter</a>.</p>
          </>}
          </div>
        </section>

        <section id="brand" className={styles.brand}>
            <img src={BrandCharacter.src} alt="Brand character" loading="lazy" />

            <div className={styles.infoBox}>
              <h2>The Brand</h2>
              <p>Whether you&apos;re a <strong>developer</strong>, an <strong>artist</strong>, an <strong>investor</strong>, or a <strong>web3 enthusiast</strong>, you need access to an ecosystem of development support, open source resources and educational material. Open Devs Crew has the unique goal of actively contributing to and supporting the growth of web3 brands with a suite of newest technologies formed around us.</p>

              <p>The best way to ensure that the future of web and blockchain technologies are exactly how we envision them, is to be on the front line to design and develop that future. </p>

              <p>Discover the Open Devs Crew &ldquo;kit&rdquo; and amplify and enhance your journey.</p>
            </div>
        </section>

        <section className={styles.keyPointsContainer}>
          <h2>What makes us different</h2>

          <ul className={styles.keyPoints}>
            <li>
              <img src={TrustIcon.src} alt="Trust icon" loading="lazy" />

              <h3>Trust</h3>
              <p>The core team includes a <span className="toUppercase">doxxed</span> founder who has been building and contributing to open source software for years both in Web2 and Web3. He is the co-founder of the company who is the <strong>official sponsor</strong> and main service provider.</p>
            </li>
            <li>
              <img src={ExperienceIcon.src} alt="Experience icon" loading="lazy" />

              <h3>Experience</h3>
              <p>A core team of experienced developers and artists who have proven their worth and who&apos;s work is publicly verifiable thanks to collaborations with brands like <strong>Hashlips Lab</strong>, <strong>Sketchy Labs</strong> and many more.</p>
            </li>
            <li>
              <img src={DecentralizedIcon.src} alt="Decentralization icon" loading="lazy" />

              <h3>Decentralization</h3>
              <p>A brand that focuses on decentralization from day one, distributing <strong>100% of royalties</strong>, if any, generated by the secondary market to its holders, <strong>without intermediaries</strong>. <a href="#additional-notes-1" title="Read more about how this works">1</a></p>
            </li>
            <li>
              <img src={StructureIcon.src} alt="Structure icon" loading="lazy" />

              <h3>Exceptional framework</h3>
              <p>Our solutions have been deployed by many web3 projects, including very prominent collections in the top 100 all-time, all-chains on Opensea.</p>
            </li>
            <li>
              <img src={QualityIcon.src} alt="Quality icon" loading="lazy" />

              <h3>High quality art</h3>
              <p>Art made with extreme care and love. Our NFTs have been hand drawn, vectorized, coloured and lastly enhanced with rich textures. The end result is visual NFT art that obtains the <strong>maximum visual impact</strong>!</p>
            </li>
            <li>
              <img src={DetailsIcon.src} alt="Details icon" loading="lazy" />

              <h3>Attention to detail</h3>
              <p>Our NFTs have been put through a <strong>rigorous analytical process</strong> using a suite of tools and manual user selection (<a href="https://en.wikipedia.org/wiki/Elo_rating_system" target="_blank" rel="noreferrer">ELO rating system</a>) to ensure the best trait combinations that <strong>look magical</strong>!</p>
            </li>
          </ul>
        </section>

        <section id="collection" className={styles.collection}>
          <h2>The Collection</h2>

          <div>
            <div className={styles.stats}>
              <dl className={styles.statsList}>
                <div>
                  <dd>7M+</dd>
                  <dt>Combinations</dt>
                </div>
                <div>
                  <dd>20k</dd>
                  <dt>Metadata generated</dt>
                </div>
                <div>
                  <dd>10k</dd>
                  <dt>Tokens generated</dt>
                </div>
                <div>
                  <dd>1990</dd>
                  <dt>Total supply</dt>
                </div>
              </dl>
            </div>

            <div className={styles.rankingInfo}>
              <div className={styles.infoBox}>
                <h3>Art ❤️ Programming</h3>

                <p>These are <span className="toUppercase">not</span> your usual NFTs! This is a one of a kind, hand crafted, carefully selected and curated collection designed to amaze! Out of 7M+ possible combinations, only 20K were selected and metadata generated. These 20K have then been <strong>analyzed with tailor-made tools</strong> to guarantee that each token would be not only unique, but visually different from any other by a significant factor. In addition, trait selection has been carefully curated to ensure a <strong>varied distribution of traits</strong> that <strong>meet quality expectations</strong>. Throughout this process, 10K tokens were discarded, leaving 10K metadata tokens for which their respective images were generated.</p>

                <p>The <a href="https://en.wikipedia.org/wiki/Elo_rating_system" target="_blank" rel="noreferrer">ELO rating system</a> was the secret weapon used to select <span className="toUppercase">only</span> 1,990 final tokens out of 10K based on the <strong>approval of a sample of selected NFT fans</strong>. Only 1,990 NFT&apos;s out of a possible 7 million!</p>
              </div>

              <img src={EloCharacters.src} alt="ELO character" loading="lazy" />
            </div>
          </div>
        </section>

        <section className={styles.animalCosplayContainer}>
          <div className={styles.introduction}>
            <div className={styles.infoBox}>
              <h2>Animal Cosplays</h2>

              <p>For a long time, in the NFT world, the daily question was &ldquo;what animal will characterize the next <strong>blue chip</strong>?&rdquo;. The animal represented on the tokens has often assumed almost more importance than everything else, so much so that it quickly became the object of MEMES and the reason for FUD.</p>

              <p>The characters of this collection do not love to be labelled with a certain animal species, they are &ldquo;<strong>Open Devs</strong>&rdquo;, but they do love dressing up in a fun and bizarre way. Five lucky tokens were officially elected as <strong>Animal Cosplay</strong> because of their ability to impersonate certain fellow animals.</p>

              <p>Down below you can discover the next one up <strong>in the reveal order</strong>, who will be the lucky minter?</p>
            </div>

            <img src={AnymalCosplays.src} alt="Anymal cosplays" loading="lazy" />
          </div>

          <div className={styles.animals}>
            <div>
              <img className={styles.character} src={ACLlama.src} alt="Llama cosplay character" loading="lazy" />

              <div className={styles.infoBox}>
                <h3>Llama</h3>
                <p>This Open Dev is staring at someone defiantly, it does not fear confrontation, one can notice this also by the decidedly inelegant expression immortalized on its face. Furthermore, it is wearing a very fashionable hat from &ldquo;<a href="https://en.wikipedia.org/wiki/Llama" target="_blank" rel="noreferrer">Lama Glama</a>&rdquo;, a brand very in vogue among the nerdy minds of Open Devs.</p>
                <ul>
                  <li><img src={ACLlama.src} alt="Llama cosplay character" loading="lazy" /></li>
                  <li className={styles.hiddenAnimals}><img src={ACUnknown.src} alt="Hidden character" loading="lazy" /></li>
                  <li className={styles.hiddenAnimals}><img src={ACUnknown.src} alt="Hidden character" loading="lazy" /></li>
                  <li className={styles.hiddenAnimals}><img src={ACUnknown.src} alt="Hidden character" loading="lazy" /></li>
                  <li className={styles.hiddenAnimals}><img src={ACUnknown.src} alt="Hidden character" loading="lazy" /></li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.sadGang}>
            <div className={styles.infoBox}>
              <h2>The Sad Gang</h2>

              <p>The use of the <a href="https://en.wikipedia.org/wiki/Elo_rating_system" target="_blank" rel="noreferrer">ELO rating system</a> initially made us think that some traits would be excluded from the shortlist in the 1,990 final tokens. In reality, our artist, FreaksPix, curated every layer to ensure that <strong>no trait would be completely excluded</strong> during the selection. Now, that&apos;s dedication and passion!</p>

              <p>Nevertheless, we noticed during our analysis that our team of curators <strong>preferred happy and silly faces</strong> rather than those clearly sad. For this reason, for example, crying eyes were generally paired with smiling faces, turning them into tears of joy!</p>

              <p>This is great as we wanted our art to generally represent positivity, but we are also aware that in life it would not be possible to truly appreciate joy without a trace of sadness every so often. For this reason, the <strong>&ldquo;Sad Gang&rdquo;</strong> was born!</p>

              <p>It is made up on <strong>only three tokens</strong> in the entire collection that have an unequivocally sad expression and this makes them <strong>extremely rare</strong>. Would you have ever imagined that the reveal of a sad face token would be able to bring joy to its owner?!</p>
            </div>

            <img src={SadGangCharacter.src} alt="Sad Gang character" />
          </div>

          <div className={styles.nfs}>
            <div>
              <img className={styles.character} src={NFSCard.src} alt="Hidden NFS character" loading="lazy" />

              <div className={styles.infoBox}>
              <h2>N** F** S***</h2>
                <p>What are these you may be wondering? The true identity of these tokens is <strong>top secret</strong>. Rumors reveal that some clues could already be hidden inside the first mints, but their true nature remains a mystery.</p>

                <p>The only thing is certain: these tokens are designed for true legends, only a <strong>diamond hand</strong> can hold onto a token so confident in itself!</p>
              </div>
            </div>
          </div>
        </section>

        <section id="team" className={styles.team}>
          <h2>The Team</h2>
          <ul>
            <li>
              <img src={LiarcoPic.src} alt="Liarco&apos;s picture" loading="lazy" />

              <div className={styles.infoBox}>
                <h3>Liarco <span>Founder</span></h3>

                <p><strong>Marco Lipparini</strong> (a.k.a. Liarco), Partner and Head of Development of <strong>MEP Srl</strong> communications agency and founder of the NFT <strong>Open Devs Crew</strong> brand.</p>

                <div className={styles.collapsible} {...getCollapsePropsLiarco()}>
                  <p>Curious to the core about <strong>new technologies</strong>, he plunged headfirst into blockchain programming when he discovered it. From here the Open Source projects were born in collaboration with <strong>Daniel Eugene Botha</strong> (HashLips) and the YouTube channel &ldquo;<a href="http://www.youtube.com/channel/UCsNUSP49XDIhxaZoZlLwnyw" target="_blank" rel="noreferrer">Liarco DevTips</a>&rdquo;.<br />
                  Additionally, he is currently the <strong>Lead Developer</strong> for the <a href="https://degentoonz.io/#crew" target="_blank" rel="noreferrer">DegenToonz</a> web3 brand.<br />
                  The tools that he has developed and maintained are helping a lot of <strong>artists</strong>, <strong>developers</strong> and <strong>brands</strong> to create various types of projects (especially in the blockchain and web3 fields).</p>

                  <p>The videos on his <strong>YouTube channel</strong> have allowed a lot of people to take the first steps with these technologies, even with no development experience.</p>
                </div>

                <button
                  title={isExpandedLiarco ? "Collapse info about Liarco" : "Expand info about Liarco"}
                  className={isExpandedLiarco ? styles.openedChevron : styles.closedChevron}
                  {...getTogglePropsLiarco()}>
                  <img src={DownArrow.src} alt="Click on this arrow show/hide more info about Liarco" />
                </button>
              </div>
            </li>
            <li>
              <img src={FreaksPixPic.src} alt="FreaksPix&apos;s picture" loading="lazy" />

              <div className={styles.infoBox}>
                <h3>FreaksPix <span>Artist</span></h3>

                <p><strong>Alessandro</strong> (a.k.a. FreaksPix) was born in Bologna in November of 1986. He developed a passion for <strong>hand drawing</strong> from a young age and during his studies of graphics and design he transferred this passion from pieces of paper to digital ones.</p>
                
                <div className={styles.collapsible} {...getCollapsePropsFreaksPix()}>
                  <p>Everything comes topped with and flavored by his passion for writing when (even if just for a brief period) he focused on the creation of &ldquo;puppets&rdquo; with sharp characteristics, cuts of color and clear outlines.</p>

                  <p>The combination of these passions and experiences define his style, <strong>simple</strong> and <strong>clear</strong>. The <strong>vector graphic</strong> is without a doubt his main passion and the sketches always start from there to then be enriched by textures and other raster effects, while never losing the manual part of the <strong>initial pencil on paper sketches</strong>.</p>
                </div>

                <button
                  title={isExpandedFreaksPix ? "Collapse info about FreaksPix" : "Expand info about FreaksPix"}
                  className={isExpandedFreaksPix ? styles.openedChevron : styles.closedChevron}
                  {...getTogglePropsFreaksPix()}>
                  <img src={DownArrow.src} alt="Click on this arrow show/hide more info about FreaksPix" />
                </button>
              </div>
            </li>
            <li>
              <img src={MepPic.src} alt="MEP Srl logo" loading="lazy" />

              <div className={styles.infoBox}>
                <h3>MEP Srl <span>Main sponsor</span></h3>

                <p><a href="https://www.mep.it" target="_blank" rel="noreferrer">MEP</a> is a marketing agency based in Bologna (in northern Italy) founded in 2012. It&apos;s characterized by a strong sense of <strong>creativity</strong> and a <strong>technological soul</strong>. Its core business is to build marketing and communications strategies focused on expanding its Partners&apos; <strong>reputation</strong> and <strong>sales opportunities</strong>.</p>
                <div className={styles.collapsible} {...getCollapsePropsMep()}>
                  <p>One of its strengths is its strong connection to the <strong>open source</strong> space.</p>

                  <p>In the middle of 2021, it started studying blockchain and NFTs to write an application for its framework in order to adapt it to the <strong>European privacy regulation</strong> updates. Since then it has fallen in love with that entire world and has started to collaborate on different collections and projects.</p>
                </div>

                <button
                  title={isExpandedMep ? "Collapse info about MEP" : "Expand info about MEP"}
                  className={isExpandedMep ? styles.openedChevron : styles.closedChevron}
                  {...getTogglePropsMep()}>
                  <img src={DownArrow.src} alt="Click on this arrow show/hide more info about MEP Srl" />
                </button>
              </div>
            </li>
          </ul>
        </section>

        <section id="web3-partners" className={styles.web3Partners}>
          <div>
            <h2>Web3 Partners</h2>
            <ul>
              <li>
                <img src={HashLipsLogo.src} alt="HashLips logo" loading="lazy" />
                <h3>HashLips</h3>

                <p>A community of artists and developers passionate about <strong>web3</strong>, <strong>NFTs</strong> and <strong>cryptocurrencies</strong>, led by Daniel Eugene Botha (HashLips), on his <a href="https://discord.gg/qh6MWhMJDN" target="_blank" rel="noreferrer">Discord server</a> with almost <strong>40k users</strong> and his YouTube channel with more than <strong>90k subscribers</strong>.</p>
              </li>
              <li>
                <img src={HashLipsLabLogo.src} alt="HashLips Lab logo" loading="lazy" />
                <h3>HashLips Lab</h3>

                <p>A <a href="https://github.com/hashlips-lab" target="_blank" rel="noreferrer">GitHub organization</a> founded by <strong>HashLips</strong> and <strong>Liarco</strong> with the aim of developing <strong>open source</strong> tools related to the web3 and NFT world. One of the main focuses is also providing training through <strong>freely available video tutorials</strong>, to allow for healthy and sustainable growth aided by <strong>increased knowledge</strong>.</p>
              </li>
              <li>
                <img src={SketchyLabsLogo.src} alt="Sketchy Labs logo" loading="lazy" />

                <h3>Sketchy Labs</h3>

                <p><a href="https://sketchylabs.io" target="_blank" rel="noreferrer">NFT community</a> with an ambitious goal: creating the biggest <strong>educative</strong>, <strong>creative community</strong> in the world. The premiere place for <strong>artists</strong>, <strong>writers</strong>, <strong>musicians</strong> and <strong>creators</strong> to learn and collaborate.</p>
              </li>
            </ul>

            <p>
              We would like thank these communities of true Open Source lovers for the support and resources.
            </p>
          </div>
        </section>

        <section id="blueprint" className={styles.blueprint}>
          <h2>The Blueprint</h2>
          
          <p>We are passionate about building long term value. Roadmaps as they have come to be known, don&apos;t fully represent our ambitions. That&apos;s why we have the blueprint. It <strong>is not</strong> based on unlocking achievement or reaching percentages. The Open Devs Crew brand, as a philosophy and activity, started in <strong>November 2021</strong>. This collection is your <strong>opportunity</strong> to take part and <strong>join us</strong> on this journey!</p>
 
          <p>The work of people like Liarco and HashLips, of companies like MEP Srl or communities like Sketchy Labs aims to give a friendly, welcoming, and safe format to web3. This is done through <strong>open source projects</strong>, <strong>educational materials</strong>, <strong>professional support</strong>, and the creation of products for web3 brands and also for <strong>traditional businesses</strong> that want to benefit from the interesting opportunities offered by <strong>decentralized technologies</strong>.</p>

          <p>All of these activities <strong>improve the ecosystem</strong> and can generate value that can be shared directly, <strong>without intermediaries</strong>, with the people that share the same values and do their part as <strong>developers</strong>, <strong>investors</strong> or even <strong>ambassadors</strong>, bringing awareness of our community to more and more people.</p>

          <p className={styles.noPaddingParagraph}>We have ambitious goals, like for example:</p>
          <ul>
            <li>The development of <strong>support tools</strong> for NFT communities in order to improve <strong>security</strong> and <strong>sustainability</strong> over time (like HashLips Lab projects, for artists and developers that contribute directly to the growth of the community through donations)</li>
            <li>The development of a <strong>subscription system</strong>, based on the blockchain, that can be truly sustainable for <strong>companies</strong> and <strong>professionals</strong>. Partners, like MEP Srl, will be able to use such tools in order to provide professional support and <strong>give back</strong> to the community</li>
            <li>Research and development of tools that bring <strong>traditional businesses</strong> closer to blockchain and web3 technologies, like for example privacy consent management solutions based on blockchain</li>
            <li>The creation of <strong>educational materials</strong> through videos and livestreams, with priority access to <strong>members of the community</strong>, but also directly to a broader audience, in order to let more and more people know about our brand thanks to channels with a large following like the <strong>HashLips community</strong></li>
            <li>Preparation and team support for the participation in <strong>Hackathons</strong> promoted by various organizations in and outside the blockchain world. The funds generated by any awards, net of costs incurred, will be <strong>directly reinvested</strong> in the collection</li>
          </ul>

          <p>You can discover more about all this, and examine the source code, in our <a href="https://github.com/liarco-network/open-devs-crew-collection" target="_blank" rel="noreferrer">GitHub repository</a>.</p>
        </section>

        <section id="additional-notes" className={styles.additionalNotes}>
          <h2>Additional notes:</h2>

          <dl className={styles.footNotes}>
            <div id="additional-notes-1">
              <dt>1</dt>
              <dd>
                <p>
                  Any <a href="https://ethereum.org/" target="_blank" rel="noreferrer">ETH</a> and <a href="https://weth.io" target="_blank" rel="noreferrer">WETH</a> funds <strong>received by the collection smart contract</strong> (mint cost, on-chain royalties, donations, etc.) get split into <strong>1990 equal parts</strong>. Each token that has been minted <strong>within previous transactions</strong> receives one of those parts, while the remaining parts (unminted tokens) count as funds that can be withdrawn by <strong>MEP Srl</strong> to fund its educational and open source activities in support to the brand.
                </p>

                <p>
                  The contract supports on-chain royalties suggestion thank to <a href="https://eips.ethereum.org/EIPS/eip-2981" target="_blank" rel="noreferrer">EIP-2981</a>. Any marketplace supporting that standard will be told to send any royalties to the contract itself.
                </p>

                <p>
                  Owners who have been holding at least <strong>one token for 90 days</strong> (Diamond Hands Holders) will be able to withdraw funds, if any, collected by their tokens directly from the contract (on-chain).
                </p>

                <p>
                  Diamond Hands Holders who hold at <strong>least 20 tokens</strong> are considered <strong>Whales</strong>.
                </p>

                <p>
                  A owner&apos;s wallet <span className="toUppercase">must</span> perform <strong>at least one</strong> of the following actions <strong>once every 2 years</strong> in order to be considered <strong>active</strong>:
                </p>
                <ul>
                  <li>Withdraw funds, if any, from at least one of its tokens</li>
                  <li>Refresh the latest withdrawal timestamp by calling the dedicated public function on the smart contract</li>
                </ul>
                <p>
                  Whales will be able to <strong>withdraw funds, if any, from tokens owned by inactive wallets</strong>. This is allowed in order to make so that funds won&apos;t get stuck in case some tokens get lost or become inaccessible for any reasons (e.g. private key is lost or the NFT is accidentally transferred to a dead wallet).
                </p>

                <p>
                  After a wallet has performed <strong>any actions that update its activity status</strong>, then any transfer of tokens <strong>from</strong> the same address <strong>will be rejected for the next 24 hours</strong>. This <strong>is intended to mitigate misconduct</strong> such as withdrawing immediately before accepting an offer.
                </p>

                <p>
                  The behavior described in this note is completely decentralized and, since the Solidity contract won&apos;t be upgradable, <strong>nobody</strong>, not even the founders, will ever be able to take control of it or update the code after deployment.
                </p>
              </dd>
            </div>
          </dl>
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
              <li className={styles.opensea}>
                <a href="https://opensea.io/collection/open-devs-crew" target="_blank" rel="noreferrer">
                  <img src={OpenSea.src} alt="OpenSea logo" loading="lazy" />
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
