import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

export default function TransferTRC20() {
  const [tronWeb, setTronWeb] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Detect Wallet (TronLink / TrustWallet)
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
        if (attempts > 15) {
          clearInterval(interval);
          reject("TRON wallet not detected. Open inside TronLink or Trust Wallet DApp browser.");
        }
      }, 400);
    });
  };

  const loadWallet = async () => {
    try {
      const tw = await detectWallet();
      setTronWeb(tw);

      const walletAddress = tw.defaultAddress.base58;
      setAddress(walletAddress);

      const contract = await tw.contract().at(USDT_CONTRACT);
      const bal = await contract.balanceOf(walletAddress).call();

      setBalance((Number(bal) / 1_000_000).toString());
    } catch (err) {
      console.log(err);
      Swal.fire("Wallet Error", err.toString(), "error");
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const transfer = async () => {
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

      const contract = await tronWeb.contract().at(USDT_CONTRACT);
      const value = Math.floor(Number(amount) * 1_000_000); // 6 decimals

      const tx = await contract.transfer(receiver, value).send({
        feeLimit: 100_000_000,
      });

      Swal.fire("Success", `Transaction Hash:\n${tx}`, "success");

      setAmount("");
      loadWallet();

    } catch (err) {
      console.log(err);

      if (err?.message?.includes("OUT_OF_ENERGY")) {
        Swal.fire(
          "Energy Error",
          "Not enough TRX for energy. Keep some TRX in wallet.",
          "error"
        );
      } else {
        Swal.fire("Error", err?.message || "Transaction failed", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2>TRC20 USDT Transfer</h2>

        <div style={styles.card}>
          <div><b>Connected:</b> {address || "Not Connected"}</div>
          <div><b>USDT Balance:</b> {balance}</div>
        </div>

        <div style={styles.inputBlock}>
          <label>Receiver Address</label>
          <input
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="T..."
            style={styles.input}
          />
        </div>

        <div style={styles.inputBlock}>
          <label>Amount (USDT)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.footer}>
        <button
          style={styles.button}
          onClick={transfer}
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
    background: "#fff",
    fontFamily: "system-ui",
  },
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  card: {
    background: "#f5f5f5",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  inputBlock: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  footer: {
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