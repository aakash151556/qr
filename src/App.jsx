import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap";

import Transfer from "./transfer";


export default function App() {
 

  const router = createBrowserRouter([
    {
      path: "/transfer",
      element: <Transfer />,
      
    }
  ]);

  return (

      <RouterProvider router={router} />

  );
}
