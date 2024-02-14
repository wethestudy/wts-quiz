import React from "react";
import footerStyles from "./styles/footer.module.css"

const Footer = ({left=<></>, right=<></>}) => {
    return <div className={footerStyles['footer-wrapper']}>
        <div className={footerStyles['button-wrapper']}>{left}</div>
        <div className={footerStyles['button-wrapper']}>{right}</div>
    </div>
}

export default Footer