import React from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from 'wagmi';
import Card from './Card';

/**
 * Profile Component for displaying user's wallet information and connection status.
 * @returns {JSX.Element} The rendered Profile component.
 */
export function Profile() {
  // Retrieve user account information, connection status, and connectors.
  const { address, connector, isConnected } = useAccount();

  // Retrieve the user's EnsAvatar and EnsName.
  const { data: ensAvatar } = useEnsAvatar({ address });
  const { data: ensName } = useEnsName({ address });

  // Connect to wallets, handle disconnections, and manage loading/error states.
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    // User is connected, display the wallet card.
    return (
      <Card connectorName={connector?.name} address={address} disconnect={disconnect} />
    );
  }

  // User is not connected, display wallet connection options.
  return (
    <div className='w-full flex flex-col items-center gap-10'>
      <h2 className='mb-4'>Connecting Wallet with Wagmi</h2>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
          className="border w-[350px] justify-center items-center flex rounded-lg shadow-lg shadow-emerald-200 border-white border-t-2 border-l-2 hover:rounded"
        >
          <h3 className="text-center text-white py-5 col-end-4 pl-2">
            {connector.name}
            {!connector.ready && ' (unsupported)'}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              ' (connecting)'}
          </h3>
        </button>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  );
}
