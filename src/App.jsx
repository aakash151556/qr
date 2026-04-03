import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap";

import Transfer from "./transfer";
import TransferTRC20 from "./TransferTRC20";
import TRC20Transfer from "./TRC20Transfer";
import TransferERC20 from "./TransferERC20";
import WalletRedirect from "./WalletRedirect";
import ConnectButton from "./ConnectButton";



export default function App() {
 

  const router = createBrowserRouter([
    {
      path: "/transfer",
      element:( <WalletRedirect> <Transfer /></WalletRedirect>),
      
    },
     {
      path: "/connectbutton",
      element:<ConnectButton/>,
      
    }
    ,
     {
      path: "/transfertrc20",
      element:<TransferTRC20/>,
      
    },
      {
        path: "/TRC20Transfer",
        element:<TRC20Transfer/>,
        
      }
  ]);

  return (

      <RouterProvider router={router} />

  );
}
