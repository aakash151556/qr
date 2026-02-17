import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap";

import Transfer from "./transfer";
import TransferTRC20 from "./TransferTRC20";
import TransferERC20 from "./TransferERC20";
import WalletRedirect from "./WalletRedirect";



export default function App() {
 

  const router = createBrowserRouter([
    {
      path: "/transfer",
      element:( <WalletRedirect> <Transfer /></WalletRedirect>),
      
    },
     {
      path: "/transfertrc20",
      element:<TransferTRC20/>,
      
    },
     {
      path: "/transfererc20",
      element:<TransferERC20/>,
      
    }
  ]);

  return (

      <RouterProvider router={router} />

  );
}
