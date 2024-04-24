"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import bgImage from "@/public/img/user-shell/bg-pattern.png";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  React.useEffect(() => {
    // с этим чуть позже разберусь
    // document.documentElement.style.setProperty("--body-bg-image", bgImage.src);
  }, []);

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <link rel="icon" type="image/x-icon" href={""} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
