// Code for local development
const intervalLocal100 = setInterval(()=>{
    document.addEventListener('input', function(event) {
        clearInterval(intervalLocal100)
    });
    let treeID = "recn9dZIBIKhdNycB"
    let memberJSON = {
      data:{
        "completedArticlesID": [],
        "masteredArticlesID": []
    }};
    let dispatchEvent = {treeID: treeID, member: memberJSON}
    document.dispatchEvent(new CustomEvent('input', { detail: dispatchEvent}));
}, 5000)
setTimeout(()=>{
    clearInterval(intervalLocal100)
}, 20000)

// Code to dispatch to Quiz
// Include AirtableID in treeID and dispatchEvent
const memDispatchQuiz = window.$memberstackDom;
const intervalWebflow100 = setInterval(()=>{
    document.addEventListener('input', function(event) {clearInterval(intervalWebflow100)});
    let treeID = ""
    let memberJSON = {data:{"completedArticlesID": [], "masteredArticlesID": []}};
    let dispatchDetails = {treeID: treeID, member: memberJSON}
    try {
        memDispatchQuiz.getCurrentMember()
            .then(async ({ data: member }) => {
                if (member) {
                    memberJSON = await memDispatchQuiz.getMemberJSON();
                    dispatchDetails = {member: memberJSON, treeID: ""}   
                }
                if (window.location.origin === "https://wethestudy.webflow.io/"){
                    document.dispatchEvent(new CustomEvent('input', { detail: dispatchDetails}));
                }
            })
    } catch {
        if (window.location.origin === "https://wethestudy.webflow.io/"){
            document.dispatchEvent(new CustomEvent('input', { detail: dispatchDetails}));
        }
    }
}, 5000)
setTimeout(()=>{
    clearInterval(intervalWebflow100)
}, 20000)

// Code when receiving from Quiz. Two functions: (1) close modal, (2) update memberJSON
// Include Airtable ID in .includes and .push
const memReceiveQuiz = window.$memberstackDom;
window.addEventListener('message', (event) => {
    const modal = document.getElementById('quiz-modal');
    if(event.origin !== "https://wethestudy.webflow.io") {return}
    if(event.data === "closeModal"){
      modal.style.display = 'none';
    }
    if(event.data === "master"){
        try {
            memReceiveQuiz.getCurrentMember()
                .then(async ({ data: member }) => {
                    if (member) {
                        memberJSON = await memReceiveQuiz.getMemberJSON();
                        if(memberJSON.data.masteredArticlesID.includes("")){
                            return
                        } else {
                            memberJSON.data.masteredArticlesID.push("");
                            const updatedMemberData = {
                                ...memberJSON.data,
                                masteredArticlesID: memberJSON.data.masteredArticlesID
                            };
                            await memReceiveQuiz.updateMemberJSON({
                                json: updatedMemberData
                            });
                        }
                    }
                })
        } catch {
            console.log("Error")
        }
    }    
});