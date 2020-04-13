import React from "react";
import styles from "../assets/css/Content.module.css"

const Content = ({ children }) => <div className={`${styles.wideContent} content`}>{children}</div>;

export default Content;
