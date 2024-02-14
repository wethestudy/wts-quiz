import questionAnswer from "../database/questionsAnswers";

function processQA(){
    let processedQA = questionAnswer.map(object=>{
        object.fields["Choices"] = JSON.parse(object.fields["Choices"])
        return object
    })
    return processedQA
}

function mapQuizTypesFromCode(inputString) {
    const mapping = {
        A: "multipleChoice",
        B: "trueFalse",
    };
    let resultArray = [];
    for (let char of inputString) {
        if (mapping[char]) {
        resultArray = resultArray.concat(mapping[char]);
        }
    }
    return resultArray;
}

function isValidResponse(item){
    return (
        Array.isArray(item.fields["Choices"]) &&
        typeof item.fields["Question"] === 'string' &&
        typeof item.fields["Answer"] === 'number' &&
        item.fields["Answer"] >= 0 && item.fields["Answer"] < item.fields["Choices"].length &&
        Object.values(item).every(value => value !== null && value !== undefined)
    );
}

function isValidItemFormat(item) {
    return (
        isValidResponse(item) &&
        typeof item.fields["Estimated Time"] === 'number' &&
        (typeof item.fields["Question ID"] === 'number' || typeof item.id === 'string') &&
        typeof item.fields["Type"] === 'string' &&
        (typeof item.fields["Airtable ID"] === 'number' || typeof item.fields["Airtable ID"] === 'string')
    );
}

function fisherYatesShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function chooseRandomItemsById(processedQA, idsToChoose, typesChosen, n) {
    let matchingItems
    if(typesChosen === "debug"){
        matchingItems = processedQA.filter(item => idsToChoose.includes(item.fields["Airtable ID"]));
    } else {
        matchingItems = processedQA.filter(item => idsToChoose.includes(item.fields["Airtable ID"]) && typesChosen.includes(item.fields["Type"]) && isValidItemFormat(item));
    }

    fisherYatesShuffle(matchingItems);

    let chosenItems = matchingItems
    if(n !== "debug"){
        chosenItems = matchingItems.slice(0, n);
    }
    return chosenItems;
}

function removeAnswersFromObject(objectsArray, keysToRemove) {
    return objectsArray.map(obj => {
        const newObj = { ...obj };
        keysToRemove.forEach(key => delete newObj[key]);
        return newObj;
    });
}

function responseToResults (processedQA, resultsData) {
    return resultsData.map(result => {
      const matchingAnswer = processedQA.find(item => item.fields["Question ID"] === result.id);
      if (matchingAnswer) {
        return { ...result, answer: matchingAnswer.fields["Answer"] };
      }
      return {...result, answer: null};
    });
} 

export { processQA, mapQuizTypesFromCode, chooseRandomItemsById, removeAnswersFromObject, responseToResults }