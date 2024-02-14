const intervalWebflow100 = setInterval(()=>{
    document.addEventListener('input', function(event) {
        clearInterval(intervalWebflow100)
    });
    let treeID = ""
    let memberJSON = {
      data:{
        "completedArticlesID": [],
        "masteredArticlesID": []
    }};
    let dispatchEvent = {treeID: treeID, member: memberJSON}
    document.dispatchEvent(new CustomEvent('input', { detail: dispatchEvent}));
}, 5000)
setTimeout(()=>{
    clearInterval(intervalWebflow100)
}, 20000)

window.addEventListener('message', (event) => {
    //Memberstack code to get JSON
    //Update JSON with event.data
    //Check if there is duplicate
});