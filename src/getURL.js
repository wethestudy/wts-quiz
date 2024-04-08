function getURL () {
    const url = new URL(window.location.href);
    return url.origin
    // const hostname = url.hostname;
    // if(hostname === "localhost"){
    //     return `${hostname}:${url.port}`
    // } else {
    //     return hostname
    // }
}

export default getURL