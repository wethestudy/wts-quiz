import React from "react";
import debugCardStyle from './styles/debugcard.module.css'

const DebugCard = ({body=null}) => {
    return <div className={debugCardStyle["debug-card"]}>
        {body !== null ? body : <div></div>}
    </div>
}

export default DebugCard