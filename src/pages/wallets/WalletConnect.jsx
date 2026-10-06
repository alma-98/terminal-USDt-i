import {
  useEffect,
  useState
} from "react";

import {
  connectWallet,
  getConnectedWallet,
  getWalletProvider,
  disconnectWallet
} from "../../modules/walletExtension/walletExtension.js";

function shortenAddress(
  address
) {
  if (!address) {
    return "-";
  }

  return `${address.slice(
    0,
    6
  )}...${address.slice(-4)}`;
}

export default function WalletConnect() {
  const [
    wallet,
    setWallet
  ] = useState(null);

  const [
    error,
    setError
  ] = useState("");

  const [
    connecting,
    setConnecting
  ] = useState(false);

  async function loadWallet() {
    try {
      const current =
        await getConnectedWallet();

      setWallet(
        current
          ? {
              account:
                current.account,

              chainId:
                current.chainId
            }
          : null
      );
    } catch (err) {
      setError(
        err?.message ||
        "Gagal membaca wallet."
      );
    }
  }

  useEffect(() => {
    loadWallet();

    const provider =
      getWalletProvider();

    if (!provider) {
      return;
    }

    const handleAccountsChanged =
      (accounts) => {
        if (
          !accounts?.length
        ) {
          setWallet(null);
          return;
        }

        setWallet(
          (current) => ({
            ...current,

            account:
              accounts[0]
          })
        );
      };

    const handleChainChanged =
      (chainId) => {
        setWallet(
          (current) => ({
            ...current,

            chainId
          })
        );
      };

    provider.on?.(
      "accountsChanged",
      handleAccountsChanged
    );

    provider.on?.(
      "chainChanged",
      handleChainChanged
    );

    return () => {
      provider.removeListener?.(
        "accountsChanged",
        handleAccountsChanged
      );

      provider.removeListener?.(
        "chainChanged",
        handleChainChanged
      );
    };
  }, []);

  async function handleConnect() {
    try {
      setError("");
      setConnecting(true);

      const result =
        await connectWallet();

      setWallet({
        account:
          result.account,

        chainId:
          result.chainId
      });
    } catch (err) {
      setError(
        err?.message ||
        "Wallet gagal terhubung."
      );
    } finally {
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    await disconnectWallet();

    setWallet(null);
  }

  return (
    <section className="dashboard-panel">

      <div className="tenor-header">
        <div>
          <span className="eyebrow">
            WALLET
          </span>

          <h2>
            Connect Wallet
          </h2>

          <p>
            Hubungkan browser wallet
            untuk signing dan
            confirmation transaksi.
          </p>
        </div>

        {wallet && (
          <strong>
            CONNECTED
          </strong>
        )}
      </div>

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {!wallet ? (
        <div>
          <p>
            Wallet belum terhubung.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={
              handleConnect
            }
            disabled={
              connecting
            }
          >
            {connecting
              ? "Menghubungkan..."
              : "Connect Wallet"}
          </button>
        </div>
      ) : (
        <div>
          <div
            className="dashboard-panel"
            style={{
              marginBottom:
                "16px"
            }}
          >
            <p>
              Account
            </p>

            <strong>
              {shortenAddress(
                wallet.account
              )}
            </strong>

            <p>
              Chain ID
            </p>

            <strong>
              {wallet.chainId}
            </strong>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={
              handleDisconnect
            }
          >
            Disconnect
          </button>
        </div>
      )}

      <div
        className="dashboard-panel"
        style={{
          marginTop:
            "20px"
        }}
      >
        <h3>
          Security
        </h3>

        <ul>
          <li>
            Seed phrase tidak diminta.
          </li>

          <li>
            Private key tidak diminta.
          </li>

          <li>
            Private key tetap berada
            di browser wallet.
          </li>

          <li>
            Signing dilakukan oleh
            wallet extension.
          </li>

          <li>
            Aplikasi hanya menerima
            account dan hasil signature/
            transaction request.
          </li>
        </ul>
      </div>

    </section>
  );
}
