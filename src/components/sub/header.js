import React from "react";
import headerStyles from "./styles/header.module.css"
import {ReactComponent as TreeOfKnowledge} from '../../assets/icons/tree-of-knowledge.svg'
import { links } from "../../links";

const Header = ({text="", showLogo=true}) => {
    return <div className={headerStyles['header-wrapper']}>
        <div className="h2-style">{text}</div>
        {showLogo ? <div className={headerStyles['logo-wrapper']}>
                <TreeOfKnowledge width={"2rem"} height={"2rem"}/>
            <div className={headerStyles['meta-text']}>{links.appVersion}</div>
        </div> : <></>
        }
    </div>
}

export default Header