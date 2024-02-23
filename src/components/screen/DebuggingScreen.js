import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizData, initTreeObject } from '../../store/thunk';
import { debugTreePost } from '../../store/databaseSlice';
import Header from '../sub/header';
import Footer from '../sub/footer';
import Button from '../main/Button';
import debuggingScreenStyle from './styles/debuggingscreen.module.css'
import DebugCard from '../main/DebugCard';

// Create manual questions for 136 (Manual), 226 (Manual)

// Multiple manual posting UI
// Recheck generation if multiple posts and repeat is allowed (UI status)
// Change ? to number of questions
// Database check (UI Status)

// Inconsistent ChatGPT response

function DebuggingScreen() {
  const dispatch = useDispatch();
  let treePost = useSelector(state => state.database.treePost);
  let questionsAnswers = useSelector(state => state.database.questionsAnswers);
  let [selectedPosts, setSelectedPosts] = useState([])
  let [IDArray, setIDArray] = useState([])

  useEffect(()=>{
    dispatch(debugTreePost(IDArray))
  },[dispatch])

  const generateQuiz = async (id) => {
    console.log(`Generating ChatGPT response for ${id}`)
    let response = await generateChatGPTResponse(id)
    console.log(response)
    let JSONresponse = null
    try{
      JSONresponse = await JSON.parse([response])
    } catch(error){
      console.error('Error parsing JSON:', error);
    }
    let questionsAnswerObject = completeQuestionFields(JSONresponse, id, "multipleChoice", 10)
    questionsAnswerObject.forEach(object=>{storeToAirtable(object)})
  }

  const generateChatGPTResponse = async (id) => {
    try{
      const treeData = treePost.find(object => object.fields["Airtable ID"] === id)
      const numQuestions = treeData.fields["Number of Questions"]
      const content = treeData.fields["Free Content"] + "" + treeData.fields["Paid Content"]
      let prompt = `Create a ${numQuestions}-item quiz that contains multiple choice questions based on the content below: ${content} Output the list of questions and answers as an array with objects of this format: {question: <Question>, choices: <Array>, answer: <Number>} The <Number> represents the index location of the correct answer in the choices array. Do not assign it to a variable. Your response must EXACTLY follow this sample format: "[{question: "What is this question?", choices: ["True", "False", "Maybe"], answer: 1}]" DO NOT ADD SPACES OR BREAK LINES WHEN PREPARING YOUR RESPONSE.`
      const response = await axios.post('http://localhost:8000/api/chat', {
        messages: [{ role: 'user', content: prompt }],
      });
      return response.data.choices[0].message.content
    } catch(error){
      console.error(error);
    }
  }

  const completeQuestionFields = (chatGPTresponse, id, type, time) => {
    switch (type){
      case "multipleChoice":
        return chatGPTresponse.map((object)=>{
          return {...object, articleID: id, id: uuidv4(), type: type, estTime: time}
        })
      default:
        break;
    }
  }

  const storeToAirtable = async (object) => {
    try {
      const response = await axios.post('http://localhost:8000/api/chat-airtable', {
        questionId: object.id,
        airtableId: object.articleID,
        type: object.type,
        question: object.question,
        choices: object.choices,
        answer: object.answer,
        estimatedTime: object.estTime,
      });
      console.log('Data posted to Airtable:', response.data);
    } catch (error) {
      console.error('Error posting data to Airtable:', error);
    }
  }

  const onGenerate = () => {
    try {
      selectedPosts.forEach((id)=>{generateQuiz(id)})
      setSelectedPosts([])
    } catch (error) {
      console.error(error);
    }
  };

  const onCheckmark = (event) => {
    let treeID = event.target.value
    let newArray = []
    if(selectedPosts.includes(treeID)){
      newArray = [...selectedPosts.filter(id => id !== treeID)]
    } else {
      newArray = [...selectedPosts, treeID]
    }
    setSelectedPosts(selectedPosts = newArray)
  }

  const onCheckDatabase = async () => {
    const response = await axios.get('http://localhost:8000/api/airtable-qa');
    response.data.forEach((object)=>{
      if(!IDArray.includes(object.fields["Airtable ID"])){
        setIDArray(IDArray.push(object.fields["Airtable ID"]))
      }
    })
    console.log(IDArray.length)
    dispatch(debugTreePost(IDArray))
  }

  const onUpdateDatabase = async () => {
    try {
      // const response = await axios.post("/", {
      //   questionId: object.id,
      //   airtableId: object.articleID,
      //   type: object.type,
      //   question: object.question,
      //   choices: object.choices,
      //   answer: object.answer,
      //   estimatedTime: object.estTime,
      // });
      console.log('Data updated');
    } catch (error) {
      console.error('Error updating data to Airtable:', error);
    }
  }
  
  let id = ""
  let object = []
  let parameters = {
    type: "multipleChoice",
    estTime: 10
  }

  const onManualPost = (id, object, parameters) => {
    //Develop manual post UI
    let questionsAnswerObject = completeQuestionFields(object, id, parameters.type, parameters.estTime)
    questionsAnswerObject.forEach(object=>{storeToAirtable(object)})
  }

  const onTestQuiz = (event) => {
    dispatch(initTreeObject(event.target.value))
    dispatch(fetchQuizData(event.target.value, "debug", "debug"));
  }

  const checkNumber = (id) => {
    let bool = false;
    for(object of questionsAnswers){
      if(object.fields["Airtable ID"]==id){
        bool = true;
        break;
      }
    }
    return bool
  }

  let generateBoolean = selectedPosts.length === 0
  let manualBoolean = id === "" && object.length === 0

  let debuggingBody = <>
    <Header text={"Q&A Debug"}/>
    <div className={debuggingScreenStyle["parent-wrapper"]}>
        <div className={debuggingScreenStyle["item-container"]}>
          <div className={debuggingScreenStyle["item-header"]}>
            <div></div>
            <div>No.</div>
            <div>Name</div>
            <div>ID</div>
            <div>Type</div>
            <div>Number</div>
            <div>Test</div>
          </div>
          <div className={debuggingScreenStyle["item-scroll"]}>
            {treePost.map((post, index)=>{
                return <div className={debuggingScreenStyle["item-wrapper"]} key={index}>
                  <input value={post.fields["Airtable ID"]} className={debuggingScreenStyle["item-center"]} type='checkbox' onChange={onCheckmark}/>
                  <div className={debuggingScreenStyle["item-center"]}>{index+1}</div>
                  <div>{post.fields["Name"]}</div>
                  <div>{post.fields["Airtable ID"]}</div>
                  <div>{post.fields["Organization: Post Type"]}</div>
                  <div className={debuggingScreenStyle["item-center"]}>{post.fields["Evaluation"]}</div>
                  <button 
                    className={debuggingScreenStyle["test-button"]} 
                    value={post.fields["Airtable ID"]} 
                    onClick={(event)=>{onTestQuiz(event)}}
                    disabled={!checkNumber(post.fields["Airtable ID"]) ? true : false}
                  >Local</button>
                </div>
            })}
          </div>
      </div>
    </div>
    <Footer 
    left={
      <div className={debuggingScreenStyle["footer-left"]}>
        <Button text="GENERATE" onClick={onGenerate} type={generateBoolean ? "disabled" : "primary"} disabled={generateBoolean ? true : false}/>
        <Button text="MANUAL POST" onClick={()=>{onManualPost(id, object, parameters)}} type={manualBoolean ? "disabled" : "primary"} disabled={manualBoolean === 0 ? true : false}/>
      </div>
    } 
    right={
      <div className={debuggingScreenStyle["footer-left"]}>
        <Button text="CHECK DATABASE" onClick={onCheckDatabase}/>
      </div>
    }/>
  </>

  

  return <DebugCard body={debuggingBody}/>
}

export default DebuggingScreen;