import { useDevelopmentURLs, useLocalURL } from './devSettings.js'

const localURL = "http://localhost:3000/"
const developmentURL = "https://wethestudy.webflow.io/"
const productionURL = "https://wethestudy.com/"
// const netlifyURL = "https://wethestudy-tree.netlify.app"
let url = useDevelopmentURLs ? developmentURL : productionURL
url = useLocalURL ? localURL : developmentURL
const links = {
    resourcesLink: `${url}/resource`,
    appVersion: `1.0.0`,
    faqLink: `${url}/resources/faqs`,
    contact: `${url}/resources/contact`
}
const resourceSlugs = ['guide-to-wethestudy-quizzes', 'reporting-wethestudy-quizzes']
export {links, url, resourceSlugs}