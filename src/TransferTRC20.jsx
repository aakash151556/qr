import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const USDT_TRC20 = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

export default function TransferTRC20() {
  const [tronWeb, setTronWeb] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);

  // Wait for tronWeb injection (TrustWallet / TronLink)
  const detectWallet = async () => {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      return window.tronWeb;
    }

    return new Promise((resolve, reject) => {
      let attempts = 0;
      const interval = setInterval(() => {
        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
          clearInterval(interval);
          resolve(window.tronWeb);
        }
        attempts++;
        if (attempts > 10) {
          clearInterval(interval);
          reject("Open this DApp inside Trust Wallet or TronLink");
        }
      }, 500);
    });
  };

  // Load wallet + balance
  const loadWallet = async () => {
    try {
      const tw = await detectWallet();
      setTronWeb(tw);

      const address = tw.defaultAddress.base58;
      setWalletAddress(address);

      const contract = await tw.contract().at(USDT_TRC20);
      const bal = await contract.balanceOf(address).call();
      setBalance((Number(bal) / 1_000_000).toString());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const transferUSDT = async () => {
    try {
      if (!tronWeb) {
        Swal.fire("Error", "Wallet not connected", "error");
        return;
      }

      if (!receiver || !tronWeb.isAddress(receiver)) {
        Swal.fire("Error", "Invalid TRON address", "error");
        return;
      }

      if (!amount || Number(amount) <= 0) {
        Swal.fire("Error", "Enter valid amount", "error");
        return;
      }

      if (Number(amount) > Number(balance)) {
        Swal.fire("Error", "Insufficient USDT balance", "error");
        return;
      }

      setLoading(true);

      const contract = await tronWeb.contract().at(USDT_TRC20);
      const value = Math.floor(Number(amount) * 1_000_000);

      const tx = await contract.transfer(receiver, value).send({
        feeLimit: 100_000_000,
      });

      Swal.fire("Success!", `Transaction Hash:\n${tx}`, "success");
      setAmount("");

      // Refresh balance
      loadWallet();
    } catch (err) {
      console.log(err);
      Swal.fire("Error", err?.message || "Transfer failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <h2 style={styles.title}>TRC20 USDT Transfer</h2>

        <div style={styles.infoBox}>
          <div><b>Connected:</b> {walletAddress || "Not Connected"}</div>
          <div><b>USDT Balance:</b> {balance}</div>
        </div>

        <div style={styles.block}>
          <div style={styles.label}>Receiver Address</div>
          <input
            style={styles.input}
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="T..."
          />
        </div>

        <div style={styles.block}>
          <div style={styles.label}>Amount (USDT)</div>
          <input
            style={styles.input}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            type="number"
          />
        </div>
      </div>

      <div style={styles.bottomBar}>
        <button
          style={styles.button}
          onClick={transferUSDT}
          disabled={loading}
        >
          {loading ? "Processing..." : "Send USDT"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    fontFamily: "system-ui",
  },
  wrapper: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  title: {
    marginBottom: "20px",
  },
  infoBox: {
    marginBottom: "20px",
    padding: "15px",
    background: "#f5f5f5",
    borderRadius: "8px",
    fontSize: "14px",
  },
  block: {
    marginBottom: "20px",
  },
  label: {
    marginBottom: "8px",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  bottomBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "15px",
    background: "#fff",
  },
  button: {
    width: "100%",
    padding: "15px",
    background: "#0000ff",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    fontSize: "16px",
    cursor: "pointer",
  },
};