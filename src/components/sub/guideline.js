import React from "react";
import guidelineStyles from "./styles/guideline.module.css"

const Guideline = ({image="", title="", text=""}) => {
    return <div className={guidelineStyles['guideline-wrapper']}>
        <div className={guidelineStyles['image-wrapper']}>{image}</div>
        <div className={guidelineStyles['title-text']}>{title}</div> 
        <div className={guidelineStyles['text']}>{text}</div>        
    </div>
}

export default Guideline