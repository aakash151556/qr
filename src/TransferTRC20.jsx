import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import TronWeb from "tronweb";
import { useSearchParams } from "react-router-dom";

const USDT_TRC20 = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // Mainnet USDT

export default function TransferTRC20() {
  const [searchParams] = useSearchParams();

  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const account = searchParams.get("account");

  useEffect(() => {
    setReceiver(account || "");
  }, [account]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setReceiver(text || "");
    } catch (err) {
      console.log("Clipboard not allowed", err);
    }
  };

  const fn_transfer = async () => {
    try {
      if (!window.tronWeb || !window.tronWeb.ready) {
        Swal.fire("Error", "TronLink not connected", "error");
        return;
      }

      if (!receiver || receiver.trim() === "") {
        Swal.fire("Error", "Receiver address required", "error");
        return;
      }

      if (!amount || Number(amount) <= 0) {
        Swal.fire("Error", "Enter valid amount", "error");
        return;
      }

      setLoading(true);

      const tronWeb = window.tronWeb;
      const contract = await tronWeb.contract().at(USDT_TRC20);

      // USDT decimals = 6
      const value = Math.floor(Number(amount) * 1_000_000);

      const tx = await contract.transfer(receiver, value).send();

      Swal.fire("Success!", `Transfer Successful\nTX: ${tx}`, "success");
      setAmount("");
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
        {/* Address */}
        <div style={styles.block}>
          <div style={styles.label}>Address or Domain Name</div>

          <div style={styles.inputWrap}>
            <input
              style={styles.input}
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="T..."
            />

            <div style={styles.rightTools}>
              {receiver?.length > 0 && (
                <button
                  type="button"
                  style={styles.clearBtn}
                  onClick={() => setReceiver("")}
                >
                  ×
                </button>
              )}

              <button type="button" style={styles.linkBtn} onClick={handlePaste}>
                Paste
              </button>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div style={styles.block}>
          <div style={styles.label}>Amount</div>

          <div style={styles.inputWrap}>
            <input
              style={styles.input}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />

            <div style={styles.rightTools}>
              <span style={styles.tokenText}>USDT</span>
            </div>
          </div>

          <div style={styles.usdText}>= $</div>
        </div>
      </div>

      {/* Bottom Button */}
      <div style={styles.bottomBar}>
        <button style={styles.nextBtn} onClick={fn_transfer} disabled={loading}>
          {loading ? "Processing..." : "Next"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
    position: "relative",
  },

  wrapper: {
    padding: "22px 22px 120px 22px",
    maxWidth: "1400px",
    margin: "0 auto",
  },

  block: {
    marginBottom: "28px",
  },

  label: {
    fontSize: "16px",
    color: "#333",
    marginBottom: "10px",
  },

  inputWrap: {
    width: "100%",
    border: "1px solid #d9d9d9",
    borderRadius: "2px",
    height: "58px",
    display: "flex",
    alignItems: "center",
    paddingLeft: "14px",
    paddingRight: "10px",
    background: "#fff",
  },

  input: {
    border: "none",
    outline: "none",
    width: "100%",
    height: "100%",
    fontSize: "16px",
    color: "#111",
  },

  rightTools: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    whiteSpace: "nowrap",
  },

  clearBtn: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    background: "#f1f1f1",
    color: "#444",
    fontSize: "18px",
    lineHeight: "26px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  linkBtn: {
    border: "none",
    background: "transparent",
    color: "#1a5cff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },

  tokenText: {
    fontSize: "15px",
    color: "#333",
    fontWeight: "600",
  },

  usdText: {
    marginTop: "12px",
    fontSize: "16px",
    color: "#333",
  },

  bottomBar: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    padding: "22px",
    background: "#fff",
  },

  nextBtn: {
    width: "100%",
    height: "60px",
    borderRadius: "30px",
    border: "none",
    background: "#0000ff",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    opacity: 1,
  },
};
