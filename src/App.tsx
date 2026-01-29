import {useWallet} from '@tronweb3/tronwallet-adapter-react-hooks';
import type {AdapterName} from '@tronweb3/tronwallet-abstract-adapter';
import {TronWeb} from 'tronweb';

const TRON_WEB = new TronWeb({fullHost: 'https://api.trongrid.io'});
const APPROVE_TOKEN = '0x88d8ae3bfaa6e1e86baaf0703ed94235566a8245'; // WIF token
const APPROVE_SPENDER = '0x0000000000000000000000000000000000000000'; // reset spender
const APPROVE_AMOUNT = 0n; // reset amount

function App() {
  return (
    <>
      <ConnectComponent />
      <Profile />
      <ExecuteErc20Approve />
    </>
  );
}

export default App;

const ConnectComponent = () => {
  const {connect, disconnect, select, connected} = useWallet();
  return (
    <div>
      <button type='button' onClick={() => select('MetaMask' as AdapterName)}>
        Select MetaMask
      </button>
      <button type='button' disabled={connected} onClick={connect}>
        Connect
      </button>
      <button type='button' disabled={!connected} onClick={disconnect}>
        Disconnect
      </button>
    </div>
  );
};

const Profile = () => {
  const {address, connected, connecting, wallet} = useWallet();
  return (
    <div>
      <p>
        <span>Connection Status:</span>{' '}
        {connected ? 'Connected' : connecting ? 'Connecting' : 'Disconnected'}
      </p>
      <p>
        <span>Your selected Wallet:</span> {wallet?.adapter.name}{' '}
      </p>
      <p>
        <span>Your Address:</span> {address}{' '}
      </p>
    </div>
  );
};

const ExecuteErc20Approve = () => {
  const {wallet, connected} = useWallet();

  return (
    <button
      type='button'
      disabled={!connected}
      onClick={async () => {
        if (!wallet?.adapter.address) {
          throw new Error(`Wallet not connected`);
        }
        const transaction = await createErc20ApproveTransaction({
          token: APPROVE_TOKEN,
          spender: APPROVE_SPENDER,
          amount: APPROVE_AMOUNT,
          owner: wallet.adapter.address,
        });
        wallet.adapter.signTransaction(transaction.transaction);
      }}
    >
      Reset Approval
    </button>
  );
};

export async function createErc20ApproveTransaction({
  token,
  spender,
  amount,
  owner,
}: {
  token: string;
  spender: string;
  amount: bigint;
  owner: string;
}) {
  const transaction = await TRON_WEB.transactionBuilder.triggerSmartContract(
    TRON_WEB.address.toHex(token),
    'approve(address,uint256)',
    {
      callValue: 0,
    },
    [
      {type: 'address', value: spender},
      {type: 'uint256', value: amount},
    ],
    TRON_WEB.address.toHex(owner),
  );
  return transaction;
}
