import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [injectedWallet, metaMaskWallet, coinbaseWallet],
    },
  ],
  {
    appName: 'TravelCheck',
    projectId: '3fbb6bba6f1de962d911bb5b5c9ddd26',
  }
);

export const config = createConfig({
  connectors,
  chains: [hardhat, sepolia, mainnet],
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true,
});
