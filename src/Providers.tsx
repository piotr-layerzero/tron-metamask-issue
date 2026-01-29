import {WalletProvider} from '@tronweb3/tronwallet-adapter-react-hooks';
import {MetaMaskAdapter} from '@tronweb3/tronwallet-adapters';

const adapters = [new MetaMaskAdapter()];

export const Providers = ({children}: {children: React.ReactNode}) => {
  return <WalletProvider adapters={adapters}>{children}</WalletProvider>;
};
