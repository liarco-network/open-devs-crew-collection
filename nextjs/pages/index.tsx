import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.scss';
import OdcLogo from '../assets/logo.png';
import OdcWhiteLogo from '../assets/white-logo.png';
import HeroCharacter from '../assets/hero-character.png';
import Github from '../assets/icons/github.svg';
import GithubBlack from '../assets/icons/github-black.svg';
import Twitter from '../assets/icons/twitter.svg';
import EloCharacters from '../assets/elo.png';
import SadGangCharacter from '../assets/sad-gang.jpg';
import ProjectCharacter from '../assets/the-project.jpg';
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
import MepPic from '../assets/team/mep-picture.png';
import HashLipsLogo from '../assets/partners/hashlips-logo.svg';
import HashLipsLabLogo from '../assets/partners/hashlipslab-logo.svg';
import SketchyLabsLogo from '../assets/partners/sketchylabs-logo.svg';
import favicon from '../assets/icon.png';

const Home: NextPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [canClick, setCanClick] = useState<boolean>(true);
  const [githubButtonInView, setGithubButtonInView] = useState(false);

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

    handleResize();
    handleGithubScroll();

    return () => {
      window.removeEventListener('scroll', handleGithubScroll);
      window.removeEventListener('resize', handleResize);
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
              <li><a onClick={() => setMenuOpen(false)} href="#project">The project</a></li>
              <li><a onClick={() => setMenuOpen(false)} href="#collection">The collection</a></li>
              <li><a onClick={() => setMenuOpen(false)} href="#team">The team</a></li>
              <li><a onClick={() => setMenuOpen(false)} href="#partners">Partners</a></li>
              <li><a onClick={() => setMenuOpen(false)} href="#roadmap">Roadmap</a></li>
            </ul>

            <ul className={styles.socials}>
              <li className={styles.twitter}><a href="https://twitter.com/marco_lipparini" target="_blank" rel="noreferrer"><img src={Twitter.src} alt="Twitter logo" /></a></li>
              <li className={styles.github}><a href="https://github.com/liarco-network/open-devs-crew-collection" target="_blank" rel="noreferrer"><img src={GithubBlack.src} alt="GitHub logo" /></a></li>
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

              <p>Your open source journey through NFTs, web3 and educational content is coming soon...</p>

              <ul className={styles.socials}>
                <li className={styles.twitter}><a href="https://twitter.com/marco_lipparini" target="_blank" rel="noreferrer"><img src={Twitter.src} alt="Twitter logo" /></a></li>
                <li className={styles.github}><a href="https://github.com/liarco-network/open-devs-crew-collection" target="_blank" rel="noreferrer"><img src={Github.src} alt="GitHub logo" /></a></li>
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

        <section id="project" className={styles.project}>
            <img src={ProjectCharacter.src} alt="Project character" loading="lazy" />

            <div className={styles.infoBox}>
              <h2>The project</h2>
              <p>Whether you&apos;re a <strong>developer</strong>, an <strong>artist</strong>, an <strong>investor</strong>, or a <strong>web3 enthusiast</strong>, Open Devs Crew is an excellent opportunity to carve out your place within an ecosystem of enormous potential, one that has the unique goal of contributing to the healthy and flourishing growth of web3, instead of passively waiting for these new technologies to fully form around us.</p>

              <p>The best way to ensure that the future of web and blockchain technologies are exactly how we dream of them, is to be on the front line to design the outline and color its shapes.</p>

              <p>Discover the <strong>Open Devs Crew &ldquo;kit&rdquo;</strong> to face this adventure...</p>
            </div>
        </section>

        <section className={styles.keyPointsContainer}>
          <h2>Why people choose us?</h2>

          <ul className={styles.keyPoints}>
            <li>
              <img src={DetailsIcon.src} alt="Details icon" loading="lazy" />

              <h3>Attention to detail</h3>
              <p>The best combinations, chosen through analysis tools of the collection and one step of manual selection by users using the <a href="https://en.wikipedia.org/wiki/Elo_rating_system" target="_blank" rel="noreferrer">ELO rating system</a>.</p>
            </li>
            <li>
              <img src={QualityIcon.src} alt="Quality icon" loading="lazy" />

              <h3>High quality graphics</h3>
              <p>Tokens made with the extreme care typical of <strong>made in Italy</strong>. The pencil sketches have been vectorized, colored, and lastly enhanced with rich textures, in order to obtain the maximum visual impact.</p>
            </li>
            <li>
              <img src={TrustIcon.src} alt="Trust icon" loading="lazy" />

              <h3>Trust</h3>
              <p>The core team includes a <strong>DOXXED founder</strong> who has been contributing to open source software for years and an Italian company as <strong>official sponsor</strong> and main <strong>service provider</strong>. <a href="#team">Learn more</a></p>
            </li>
            <li>
              <img src={StructureIcon.src} alt="Structure icon" loading="lazy" />

              <h3>Solid framework</h3>
              <p>Our solutions have already been deployed by many web3 projects, even in the top 120 collections from all-time, all-chains <em>(based on public rankings provided by OpenSea)</em>.</p>
            </li>
            <li>
              <img src={DecentralizedIcon.src} alt="Decentralization icon" loading="lazy" />

              <h3>Decentralization</h3>
              <p>A brand that focuses on decentralization from day one, distributing <strong>100% of the revenues</strong> generated by the community to the its holders, <strong>without intermediaries</strong>.</p>
            </li>
            <li>
              <img src={ExperienceIcon.src} alt="Experience icon" loading="lazy" />

              <h3>Experience</h3>
              <p>Roadmap based on activities already in progress and publicly verifiable thanks to the collaboration with brands like <strong>HashLips Lab</strong>, <strong>Sketchy Labs</strong> and more.</p>
            </li>
          </ul>
        </section>

        <section id="collection" className={styles.collection}>
          <div>
            <div className={styles.stats}>
              <div className={styles.statsList}>
                <dl>
                  <dd>7M+</dd>
                  <dt>Combinations</dt>
                </dl>
                <dl>
                  <dd>20k</dd>
                  <dt>Metadata generated</dt>
                </dl>
                <dl>
                  <dd>10k</dd>
                  <dt>Tokens generated</dt>
                </dl>
                <dl>
                  <dd>1990</dd>
                  <dt>Total supply</dt>
                </dl>
              </div>
            </div>

            <div className={styles.rankingInfo}>
              <div className={styles.infoBox}>
                <h3>Art 🤝️ programming</h3>

                <p>Out of 7M+ possible combinations, 20k metadata was generated. These combinations have been <strong>analyzed with tailor-made tools</strong> to guarantee that each token would be visually different from the rest by <strong>more than 1%</strong> of the image and the distribution of traits would meet expectations. The process has led to filtering 10k tokens, of which their respective images have been generated.</p>

                <p>The <a href="https://en.wikipedia.org/wiki/Elo_rating_system" target="_blank" rel="noreferrer">ELO rating system</a> was the secret weapon to permit the selection of the 1990 final tokens based on the <strong>real approval of a sample of selected NFT fans</strong>.</p>
              </div>

              <img src={EloCharacters.src} alt="ELO character" loading="lazy" />
            </div>
          </div>
        </section>

        <section className={styles.animalCosplayContainer}>
          <div className={styles.introduction}>
            <h2>Animal Cosplays</h2>

            <p>For a long time, in the NFT world, the daily question was &ldquo;what animal will characterize the next <strong>blue chip</strong>?&rdquo;. The animal represented on the tokens has often assumed almost more importance than everything else, so much so that it quickly became the object of MEMES and the reason for FUD.</p>

            <p>The characters of this collection do not love to be labelled with a certain animal species, they are &ldquo;<strong>Open Devs</strong>&rdquo;, but they do love dressing up in a fun and bizarre way. Five lucky tokens were officially elected as <strong>Animal Cosplay</strong> because of their ability to impersonate certain fellow animals.</p>

            <p>On this page you can discover the next one up <strong>in the reveal order</strong>, who will be the lucky minter?</p>
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

              <p>The use of the <a href="https://en.wikipedia.org/wiki/Elo_rating_system" target="_blank" rel="noreferrer">ELO rating system</a> had mistakenly caused us to think that some traits would be excluded from the shortlist of the 1990 final tokens, but in reality, we hadn&apos;t reckoned with the enchanted FreaksPix&apos;s hands, that curated every layer to the point in which <strong>no trait would be completely excluded</strong> during the selection.</p>

              <p>Nevertheless, what we have noticed analysing the final tokens was a pretty evident point: our very valid <strong>selectors have always preferred happy and silly faces</strong>, in respect to those clearly sad. For this reason, for example, crying eyes were generally associated with smiling faces, in order to transform crying into tears of joy.</p>

              <p>This is great and we wanted to respect the marvelous wave of positivity, but we are also aware that in life it would not be possible to truly appreciate joy without a trace of sadness every so often. For this reason, the &ldquo;<strong>Sad Gang</strong>&rdquo; was born.</p>

              <p>It is made up of the <strong>only three tokens</strong> in the entire collection that have an unequivocally sad expression and this makes them <strong>extremely rare</strong>.</p>

              <p>Would you ever have imagined that the reveal of a sad token would have been able to cheer up its owner??</p>
            </div>

            <img src={SadGangCharacter.src} alt="Sad Gang character" />
          </div>

          <div className={styles.nfs}>
            <div>
              <img className={styles.character} src={NFSCard.src} alt="Hidden NFS character" loading="lazy" />

              <div className={styles.infoBox}>
              <h2>N** F** S***</h2>
                <p>The identity of these tokens is <strong>top secret</strong>, certain indiscretions reveal that some clues could already be hidden inside the first mints, but their true nature remains nevertheless a mystery.</p>

                <p>Only one thing is certain: these tokens are destined for true experts, only a <strong>diamond hand</strong> can hold onto a token so confident in itself...</p>
              </div>
            </div>
          </div>
        </section>

        <section id="team" className={styles.team}>
          <h2>The team</h2>
          <ul>
            <li>
              <img src={LiarcoPic.src} alt="Liarco&apos;s picture" loading="lazy" />

              <div className={styles.infoBox}>
                <h3>Liarco <span>Founder</span></h3>

                <p><strong>Marco Lipparini</strong> (a.k.a. Liarco), Partner and Head of Development of <strong>MEP Srl</strong> communications agency and founder of the NFT <strong>Open Devs Crew</strong> project.</p>

                <p>Curious to the core about <strong>new technologies</strong>, he plunged headfirst into blockchain programming when he discovered it. From here the Open Source projects were born in collaboration with <strong>Daniel Eugene Botha</strong> (HashLips) and the YouTube channel &ldquo;<a href="http://www.youtube.com/channel/UCsNUSP49XDIhxaZoZlLwnyw" target="_blank" rel="noreferrer">Liarco DevTips</a>&rdquo;.<br />
                Additionally, he is currently the <strong>Lead Developer</strong> for the <a href="https://degentoonz.io/#crew" target="_blank" rel="noreferrer">DegenToonz</a> web3 brand.<br />
                The tools that he has developed and maintained are helping a lot of <strong>artists</strong>, <strong>developers</strong> and <strong>brands</strong> to create various types of projects (especially in the blockchain and web3 fields).</p>

                <p>The videos on his <strong>YouTube channel</strong> have allowed a lot of people to take the first steps with these technologies, even with no development experience.</p>
              </div>
            </li>
            <li>
              <img src={FreaksPixPic.src} alt="FreaksPix&apos;s picture" loading="lazy" />

              <div className={styles.infoBox}>
                <h3>FreaksPix <span>Artist</span></h3>

                <p><strong>Alessandro</strong> (a.k.a. FreaksPix) was born in Bologna in November of 1986. He developed a passion for <strong>hand drawing</strong> from a young age and during his studies of graphics and design he transferred this passion from pieces of paper to digital ones. Everything comes topped with and flavored by his passion for writing when (even if just for a brief period) he focused on the creation of &ldquo;puppets&rdquo; with sharp characteristics, cuts of color and clear outlines.</p>

                <p>The combination of these passions and experiences define his style, <strong>simple</strong> and <strong>clear</strong>. The <strong>vector graphic</strong> is without a doubt his main passion and the sketches always start from there to then be enriched by textures and other raster effects, while never losing the manual part of the <strong>initial pencil on paper sketches</strong>.</p>
              </div>
            </li>
            <li>
              <img src={MepPic.src} alt="MEP Srl logo" loading="lazy" />

              <div className={styles.infoBox}>
                <h3>MEP Srl <span>Main sponsor</span></h3>

                <p><a href="https://www.mep.it" target="_blank" rel="noreferrer">MEP</a> is a marketing agency based in Bologna (in northern Italy) founded in 2012. It&apos;s characterized by a strong sense of <strong>creativity</strong> and a <strong>technological soul</strong>. Its core business is to build marketing and communications strategies focused on expanding its Partners&apos; <strong>reputation</strong> and <strong>sales opportunities</strong>.</p>

                <p>One of its strengths is its strong connection to the <strong>open source</strong> space.</p>

                <p>In the middle of 2021, it started studying blockchain and NFTs to write an application for its framework in order to adapt it to the <strong>European privacy regulation</strong> updates. Since then it has fallen in love with that entire world and has started to collaborate on different collections and projects.</p>
              </div>
            </li>
          </ul>
        </section>

        <section id="partners" className={styles.partners}>
          <div>
            <h2>Partners</h2>
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
          </div>
        </section>

        <section id="roadmap" className={styles.roadmap}>
          <h2>Roadmap</h2>
          
          <p>Our roadmap <strong>is not</strong> based on unlocking achievements or reaching percentages. The Open Devs Crew project, as a philosophy and activity, started in <strong>November of 2021</strong>. This collection is your <strong>opportunity</strong> to take part in and <strong>join us</strong> on this journey.</p>
 
          <p>The work of people like Liarco and HashLips, of companies like MEP Srl or communities like Sketchy Labs aims to give a friendly, welcoming, and safe format to web3. This is done through <strong>open source projects</strong>, <strong>educational materials</strong>, <strong>professional support</strong>, and the realization of products for web3 brands and also for <strong>traditional businesses</strong> that want to benefit from the interesting opportunities offered by <strong>decentralized technologies</strong>.</p>

          <p>All of these activities <strong>improve the ecosystem</strong> and generate earnings that can be shared directly, <strong>without intermediaries</strong>, with the people that share the same values and do their part as <strong>developers</strong>, <strong>investors</strong> or even <strong>ambassadors</strong>, bringing awareness of our community to more and more people.</p>

          <p className={styles.noPaddingParagraph}>We have ambitious projects, like for example:</p>
          <ul>
            <li>The development of <strong>support tools</strong> for NFT communities in order to improve <strong>security</strong> and <strong>sustainability</strong> over time (like HashLips Lab projects for artists and developers, that contribute directly to the revenue of this community)</li>
            <li>The development of a <strong>subscription system</strong>, based on the blockchain, that can be truly sustainable for <strong>companies</strong> and <strong>professionals</strong>. Through these same tools, partners like MEP Srl will provide professional support and <strong>share the revenues</strong> of this business with the community</li>
            <li>Research and development of tools that bring <strong>traditional businesses</strong> closer to blockchain and web3 technologies, like for example privacy consent management solutions based on blockchain</li>
            <li>The creation of <strong>educational materials</strong> through videos and livestreams, with priority access to <strong>members of the community</strong>, but also directly to a broader audience, in order to let more and more people know about our brand thanks to channels with a large following like the <strong>HashLips community</strong>.</li>
            <li>Collaboration on the development of the <strong>open source</strong> Metaverse <a href="https://edenlans.com" target="_blank" rel="noreferrer">Edenlans</a>, that presents itself as the best <strong>truly free</strong> solution for any community that wants to offer new communication and socialization tools, without being slave to <strong>masked centralization</strong> through the use of <strong>blockchain</strong> or <strong>NFTs</strong> as the leading technology</li>
            <li>Preparation and team support for the participation in <strong>Hackathons</strong> promoted by various organizations in and outside the blockchain world. The funds generated by any awards, net of costs incurred, will be <strong>directly reinvested</strong> in the community.</li>
          </ul>

          <p>The distribution of revenues <strong>directly in ETH</strong> is expected for all projects, in equal parts, to all of the holders (completely <strong>on-chain</strong> and <strong>without intermediaries</strong>, where applicable). This is made possible because by the &ldquo;<strong>Smart Community Wallet</strong>&rdquo;, a solution that allows for the distribution of funds earned from all of the activities through the NFTs present in each wallet (including <strong>all royalties</strong> of the same collection).</p>
          
          <p>You can discover more on all this, and examine the source code, in our <a href="https://github.com/liarco-network/open-devs-crew-collection" target="_blank" rel="noreferrer">GitHub repository</a>.</p>
            
        </section>

        <footer className={styles.footer}>
          <div>
            <button onClick={scrollToTop}>
              <img src={OdcWhiteLogo.src} alt="Open Devs Crew logo" loading="lazy" />
            </button>
            <ul className={styles.socials}>
              <li className={styles.twitter}><a href="https://twitter.com/marco_lipparini" target="_blank" rel="noreferrer"><img src={Twitter.src} alt="Twitter logo" loading="lazy" /></a></li>
              <li className={styles.github}><a href="https://github.com/liarco-network/open-devs-crew-collection" target="_blank" rel="noreferrer"><img src={Github.src} alt="GitHub logo" loading="lazy" /></a></li>
            </ul>
          </div>
        </footer>
      </main>
    </>
  )
}

export default Home
