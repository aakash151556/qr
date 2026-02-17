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

  const account = searchParams.get("account"); // receiver from URL

 
  useEffect(()=>{
    setReceiver(account)
  },[account])

  // Transfer TRC20
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

      // reload balance
      await connectTronLink();
      setAmount("");
    } catch (err) {
      console.log(err);
      Swal.fire("Error", err?.message || "Transfer failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-3">
      <h4 className="mb-3">TRC20 USDT Transfer</h4>

      <div className="card p-3 shadow-sm">
       

        <div className="form-group mb-3">
          <label>Address</label>
          <input
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="form-control"
            placeholder="T...."
          />
        </div>

        <div className="form-group mb-3">
          <label>Amount (USDT)</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-control"
            placeholder="0"
          />
        </div>

        <button
          type="button"
          className="btn btn-primary w-100"
          disabled={loading}
          onClick={fn_transfer}
        >
          {loading ? "Processing..." : "Confirm Transfer"}
        </button>
      </div>
    </div>
  );
}
