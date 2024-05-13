"use client"
import React from "react";
import { useRouter } from "next/navigation";

import "./style.css";

interface TabProps {
  uniqueName: string;
  openedTab: string;
  title: string;
  children: React.ReactNode | React.ReactNode[];
}

const Tab: React.FC<TabProps> = ({
  uniqueName, openedTab, title, children
}) => {
  const router = useRouter();

  return <a href={`#${uniqueName}`} className={`${openedTab === uniqueName ? "opened" : ""} tab-container`}>
    <p className="tab-title">
      <span className="triangle-icon"></span>
      {title}
    </p>
    <div className="tab-content">
      {children}
    </div>


  </a>;
}

export default Tab;