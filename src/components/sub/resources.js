import React from "react";
import resourcesStyle from "./styles/resources.module.css"
import { links, resourceSlugs } from "../../links";

const Resources = () => {
    return <div className={resourcesStyle['resources-wrapper']}>
        <a href={`${links.resourcesLink}/${resourceSlugs[0]}`} target="_blank">Need Help?</a>
        <a href={`${links.faqLink}`} target="_blank">Visit FAQs</a>
    </div>
}

const HelpWrongQA = () => {
    return <a href={`${links.resourcesLink}/${resourceSlugs[1]}`} target="_blank">Something is wrong with Q&A</a>
}

export {Resources, HelpWrongQA}