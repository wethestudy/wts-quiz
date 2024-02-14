import React from "react";
import buttonStyles from './styles/button.module.css'

const Button = ({text="", onClick=null, type=null, disabled=null, style=null}) => {

    const selectStyle = (type) => {
        switch(type){
            case "primary":
                return `${buttonStyles["button"]} ${buttonStyles["primary"]}`;
            case "secondary":
                return `${buttonStyles["button"]} ${buttonStyles["secondary"]}`;
            case "correct":
                return `${buttonStyles["button"]} ${buttonStyles["correct"]}`;
            case "wrong":
                return `${buttonStyles["button"]} ${buttonStyles["wrong"]}`;
            case "disabled":
                return `${buttonStyles["button"]} ${buttonStyles["disabled"]}`;
            default:
                return `${buttonStyles["button"]} ${buttonStyles["primary"]}`;
        }
    }

    return <button className={selectStyle(type)} onClick={onClick} disabled={disabled} style={style}>{text}</button>
}

export default Button