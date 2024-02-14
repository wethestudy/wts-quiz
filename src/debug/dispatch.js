// Code for local development
const intervalLocal100 = setInterval(()=>{
    document.addEventListener('input', function(event) {
        clearInterval(intervalLocal100)
    });
    let treeID = "rectwk8Mn2Lgir8Yk"
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
const memDispatchQuiz = window.$memberstackDom;
const intervalWebflow100 = setInterval(()=>{
    document.addEventListener('input', function(event) {clearInterval(intervalWebflow100)});
    let treeID = ""
    let memberJSON = {data:{"completedArticlesID": [], "masteredArticlesID": []}};
    let dispatchEvent = {treeID: treeID, member: memberJSON}
    try {
        memDispatchQuiz.getCurrentMember()
            .then(async ({ data: member }) => {
                if (member) {
                    memberJSON = await memDispatchQuiz.getMemberJSON();
                    dispatchEvent = {member: memberJSON, treeID: ""}   
                }
                document.dispatchEvent(new CustomEvent('memberData', { detail: dispatchEvent}));
            })
    } catch {
        document.dispatchEvent(new CustomEvent('memberData', { detail: dispatchEvent}));
    }
}, 5000)
setTimeout(()=>{
    clearInterval(intervalWebflow100)
}, 20000)

// Code when receiving from Quiz. Two functions: (1) close modal, (2) update memberJSON
const memReceiveQuiz = window.$memberstackDom;
window.addEventListener('message', (event) => {
    const modal = document.getElementById('quiz-modal');
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
                            const updatedArray = memberJSON.data.masteredArticlesID.push("");
                            const updatedMemberData = {
                                ...memberJSON.data,
                                masteredArticlesID: updatedArray
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