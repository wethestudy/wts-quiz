import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Card from '../main/Card';
import Header from '../sub/header';
import QuizTitle from '../sub/quizTitle';
import Footer from '../sub/footer';
import { Resources, HelpWrongQA } from '../sub/resources';
import Slider from '../main/Slider';
import Button from '../main/Button';
import resultsScreenStyle from './styles/resultsscreen.module.css'
import footerScreenStyle from '../sub/styles/footer.module.css'
import { fetchDebugData, fetchQuizData } from '../../store/thunk';
import { sendCloseModalMessage } from '../../store/uiSlice';
import { useDebugging } from '../../devSettings';

function ResultsScreen() {
  const dispatch = useDispatch();
  const questions = useSelector(state => state.data.quizData);
  const results = useSelector(state => state.data.resultsData);
  const percentageCorrect = useSelector(state => state.data.percentageCorrect);
  const treeName = useSelector(state => state.tree.treeName);
  const treeEdition = useSelector(state => state.tree.treeEdition);
  const passingRate = useSelector(state => state.quiz.passingRate);
  const treeID = useSelector(state => state.tree.treeID);
  const numQuestions = useSelector(state => state.quiz.numQuestions);
  const postTypes = useSelector(state => state.quiz.quizTypes);

  let [header, setHeader] = useState(null)
  let [body, setBody] = useState(null)
  let [footer, setFooter] = useState(null)
  let [cardStyle, setCardStyle] = useState(null)

  useEffect(()=>{
    if(useDebugging){
      setHeader(debugHeader)
      setBody(debugBody)
      setFooter(debugFooter)
    } else {
      if(percentageCorrect >= passingRate){
        setHeader(successHeader)
        setBody(successBody)
        setFooter(successFooter)
        setCardStyle(successStyle)
      } else {
        setHeader(failureHeader)
        setBody(failureBody)
        setFooter(failureFooter)
        setCardStyle(failureStyle)
      }
    }
  },[])

  const onRetake = () => {
    dispatch(fetchQuizData(treeID, postTypes, numQuestions));
  };

  const onClose = () => {
    dispatch(sendCloseModalMessage())
  }

  const onDebug = () => {
    dispatch(fetchDebugData())
  }
  
  let successHeader = <Header text={"You've mastered this node!"}/>
  let successBody = <div className={resultsScreenStyle['body-wrapper']}>
    <QuizTitle text={`You've answered ${percentageCorrect}% on`} title={`${treeName}, Ed. ${treeEdition}`}/>
    <div className={resultsScreenStyle['body-wrapper']}>
      Congratulations! You've mastered this node! Your records have been updated.<br/>
      <div className={footerScreenStyle['footer-wrapper']}><Resources/><HelpWrongQA/></div>
    </div>
    <Slider questionArray={questions} resultsArray={results}/>
  </div>
  let successFooter = <Footer left={<Button text="OK" onClick={onClose}/>}/>
  let successStyle = {
    border: "4px solid green",
  }

  let failureHeader = <Header text={"I'm sorry..."}/>
  let failureBody = <div className={resultsScreenStyle['body-wrapper']}>
    <QuizTitle text={`You’ve answered ${percentageCorrect}% on`} title={`${treeName}, Ed. ${treeEdition}`}/>
    <div className={resultsScreenStyle['body-wrapper']}>
      You need at least {passingRate}% to pass. Don't give up! Sometimes, we learn best when we fail.<br/>
      <div className={footerScreenStyle['footer-wrapper']}><Resources/><HelpWrongQA/></div>
    </div>
    <Slider questionArray={questions} resultsArray={results}/>
  </div>
  let failureFooter = <Footer left={<Button text="Retake Quiz" onClick={onRetake}/>} right={<Button text="Close" onClick={onClose}/>}/>
  let failureStyle = {
    border: "4px solid red",
  }

  let debugHeader = <Header text={"Testing complete"}/>
  let debugBody = <div className={resultsScreenStyle['body-wrapper']}>
    <QuizTitle text={`You’ve answered ${percentageCorrect}% on`} title={`${treeName}, Ed. ${treeEdition}`}/>
    <Slider questionArray={questions} resultsArray={results}/>
  </div>
  let debugFooter = <Footer left={<Button text="Go Back" onClick={onDebug}/>}/>

  return (
    <div>
      <Card header={header} body={body} footer={footer} cardStyle={cardStyle}/>
    </div>
  );
}

export default ResultsScreen;