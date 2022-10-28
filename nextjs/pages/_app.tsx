import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { TokenProvider } from '../scripts/TokenContext';
import { useRouter } from 'next/router';

const { chains, provider } = configureChains(
  [ chain.mainnet ],
  [ jsonRpcProvider({ rpc: () => ({ http: 'https://cloudflare-eth.com' }) }) ],
);

const { connectors } = getDefaultWallets({
  appName: 'Open Devs Crew mint page',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const rainbowKitCustomTheme = lightTheme({
  accentColor:'#f59e0b',
  accentColorForeground: 'white',
  borderRadius: 'small',
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  if (router.asPath === '/mint') {
    return (
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={rainbowKitCustomTheme}>
          <TokenProvider>
            <Component {...pageProps} />
          </TokenProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    );
  }

  return (
    <Component {...pageProps} />
  );
}

export default MyApp;
