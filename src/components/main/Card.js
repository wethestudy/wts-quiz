import React from "react";
import cardStyles from './styles/card.module.css'

const Card = ({header=null, body=null, footer=null, cardStyle=null}) => {
    return <div className={cardStyles["card"]} style={cardStyle}>
        {header !== null ? header : <div></div>}
        {body !== null ? body : <div></div>}
        {footer !== null ? footer : <div></div>}
    </div>
}

export default Card