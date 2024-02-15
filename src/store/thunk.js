import { url } from "../links";
import { setCurrentScreen, goToNextQuestion, goToPreviousQuestion } from "./uiSlice";
import { setQuizData, setResultsData, computeCorrectAnswers, resetCorrectAnswers, setTotalEstTime } from "./dataSlice";
import { setMemberDetails } from "./memberSlice";
import { resetSlideIndex, setLoading } from "./uiSlice";
import { setTreeDetails } from "./treeSlice"
import { setQuizSettings } from "./quizSlice";
import { testQuestion, testAnswer } from "../database/testQuestion";
import { mapQuizTypesFromCode, chooseRandomItemsById, removeAnswersFromObject, responseToResults, processQA } from "./thunkHelper";
import treePost from "../database/treePost";
import { setQuestionsAnswers, setTreePost } from "./databaseSlice";

const getResultsData = (state) => state.data.resultsData;
const getPassingRate = (state) => state.quiz.passingRate;
const getPercentageCorrect = (state) => state.data.percentageCorrect;
const getTreePost = (state) => state.database.treePost;
const getQuestionAnswers = (state) => state.database.questionsAnswers;

//Readjust tree posts (one solid uniform table for quiz and tree)
//Function to convert Airtable Fields to local fields

export const fetchInitData = () => async (dispatch) => {
  dispatch(setTreePost(treePost))
  let processedQA = processQA()
  dispatch(setQuestionsAnswers(processedQA))
}

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const triggerMathJaxRender = debounce(() => {
  if (window.MathJax) {
    window.MathJax.typeset();
  }
}, 300);

export const onGoToPreviousQuestion = (questions) => async (dispatch) => {
  await dispatch(goToPreviousQuestion(questions));
  dispatch(triggerMathJaxRender());
};

export const onGoToNextQuestion = (questions) => async (dispatch) => {
  await dispatch(goToNextQuestion(questions));
  dispatch(triggerMathJaxRender());
};

export const initTreeObject = (treeID) => (dispatch, getState) => {
  const treeData = getTreePost(getState()).find(object => object.fields["Airtable ID"] === treeID)
  dispatch(setTreeDetails({
    id: treeData.fields["Airtable ID"], 
    name: treeData.fields["Name"], 
    edition: treeData.fields["Article: Revision"], 
    postType: treeData.fields["Organization: Post Type"]
  }))
}

export const initQuizSettings = (treeID) => (dispatch, getState) => {
  const treeData = getTreePost(getState()).find(object => object.fields["Airtable ID"] === treeID)
  dispatch(setQuizSettings({
    passingRate: treeData.fields["Passing Rate"], 
    numQuestions: treeData.fields["Number of Questions"], 
    quizTypes: mapQuizTypesFromCode(treeData.fields["Post Types"])
  }))
}

export const initQuiz = (question, answer) => async (dispatch) => {
  await dispatch(setQuizData(question));
  await dispatch(setResultsData(answer));
}

export const fetchDebugData = () => async (dispatch) => {
  try {
    dispatch(setCurrentScreen('debugging'));
    dispatch(setQuizSettings({passingRate: 100, numQuestions: "debug", quizTypes: "debug"}))
  } catch (error) {
    dispatch(setCurrentScreen('error'));
  }
}

export const fetchIntroData = (webflowDispatch) => async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      dispatch(setMemberDetails(webflowDispatch.member.data.masteredArticlesID))
      dispatch(initTreeObject(webflowDispatch.treeID))
      dispatch(initQuizSettings(webflowDispatch.treeID))
      dispatch(initQuiz(testQuestion, testAnswer))
      dispatch(setCurrentScreen('intro'));
    } catch (error) {
      dispatch(setCurrentScreen('error'));
    } finally {
      dispatch(setLoading(false));
    }
  };

async function selectQuestions (processedQA, treeID, postTypes, numQuestions) {
  
  let chosenQuestions = chooseRandomItemsById(processedQA, treeID, postTypes, numQuestions)
  if(chosenQuestions.length === 0){
    throw new Error('No available questions in pool')
  }
  if(chosenQuestions === "error"){
    //LaTeX check
    //View and answer each question
    //Update database records using API
    throw new Error('Failure in selecting questions')
  }
  return removeAnswersFromObject(chosenQuestions, ['articleID', 'answer'])
}

export const fetchQuizData = (treeID, postTypes, numQuestions) => async (dispatch, getState) => {
  try {
    dispatch(resetSlideIndex())
    dispatch(resetCorrectAnswers())
    dispatch(setLoading(true));
    dispatch(setCurrentScreen('loading'));
    let quizData = await selectQuestions(getQuestionAnswers(getState()), treeID, postTypes, numQuestions)
    const resultsData = quizData.map(question => ({ id: question.fields["Question ID"].toString(), userChoice: null }));
    const totalEstTime = quizData.reduce((total, question) => total + question.fields["Estimated Time"], 0);
    await dispatch(setTotalEstTime(totalEstTime))
    dispatch(initQuiz(quizData, resultsData))
    dispatch(setCurrentScreen('quiz'));
  } catch (error) {
    console.log(error)
    dispatch(setCurrentScreen('error'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const evaluateResults = (updatedResultsData) => async (dispatch, getState) => {
  let passingRate = getPassingRate(getState());
  await dispatch(computeCorrectAnswers(updatedResultsData))
  let percentageCorrect = getPercentageCorrect(getState());
  if(percentageCorrect >= passingRate){
    window.parent.postMessage("master", `${url}`);
  }
}

export const fetchResultsData = () => async (dispatch, getState) => {
  try {
    dispatch(resetSlideIndex())
    dispatch(setLoading(true));
    dispatch(setCurrentScreen('loading'));
    const processedQA = getQuestionAnswers(getState());
    const resultsData = getResultsData(getState());
    let updatedResultsData = responseToResults(processedQA, resultsData)
    dispatch(setResultsData(updatedResultsData));
    dispatch(evaluateResults(updatedResultsData))
    dispatch(setCurrentScreen('results'));
  } catch (error) {
    dispatch(setCurrentScreen('error'));
  } finally {
    dispatch(setLoading(false));
  }
};
