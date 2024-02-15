import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateItem, removeItem, updateNumAnswers } from "../../store/dataSlice";
import { goToPreviousQuestion, goToNextQuestion } from "../../store/uiSlice";
import { triggerMathJaxRender } from "../../store/thunk";
import Button from "./Button";
import sliderStyles from './styles/slider.module.css'
import {ReactComponent as LeftButton} from '../../assets/icons/fi-sr-angle-circle-left.svg'
import {ReactComponent as RightButton} from '../../assets/icons/fi-sr-angle-circle-right.svg'

const Slider = ({questionArray=[], resultsArray=[]}) => {
    const dispatch = useDispatch();
    const slideIndex = useSelector(state => state.ui.slideIndex);
    const questions = useSelector(state => state.data.quizData);

    useEffect(()=>{
        dispatch(triggerMathJaxRender())
    }, [dispatch])

    const onGoToPreviousQuestion = () => {
        dispatch(goToPreviousQuestion(questions));
        setTimeout(() => {
            dispatch(triggerMathJaxRender());
        }, 100);
    };
    const onGoToNextQuestion = () => {
        dispatch(goToNextQuestion(questions));
        setTimeout(() => {
            dispatch(triggerMathJaxRender());
        }, 100);
    };

    return <div className={sliderStyles['slider-wrapper']}>
        <LeftButton className={sliderStyles["arrow-svg"]} width={"2rem"} height={"2rem"} onClick={onGoToPreviousQuestion}/>
        <div className={sliderStyles['question-answer-wrapper']}>
            <div className={sliderStyles['wrapper']}>
                <Question 
                    question={questionArray[slideIndex].fields["Question"]}
                    questionID={questionArray[slideIndex].fields["Question ID"]}
                    index={slideIndex+1} 
                    numQuestion={questionArray.length}
                    style={resultsArray.length === 0 ? {display: "none"} : {display: "block"}}/>
            </div>
            <div className={sliderStyles['wrapper']}>
                <Answers
                    slideIndex={slideIndex}
                    questionID={questionArray[slideIndex].fields["Question ID"]}
                    choices={questionArray[slideIndex].fields["Choices"]}
                    resultsObject={resultsArray[slideIndex]}/>
            </div>
        </div>
        <RightButton className={sliderStyles["arrow-svg"]} width={"2rem"} height={"2rem"} onClick={onGoToNextQuestion}/>
    </div>
}

const Question = ({question = null, questionID = null, index = null, numQuestion = null, style=null}) => {
    return <div className={sliderStyles['question-wrapper']}>
        <div className={sliderStyles['question-id-text']} style={style}>{`ID: ${questionID}`}</div>
        <div>
            <div className={sliderStyles['question-count-text']}>Question {index} of {numQuestion}</div>
            <div className={sliderStyles['question-text']}>{question}</div>
        </div>
    </div>
}

const Answers = ({questionID = null, choices = null, resultsObject = null}) => {
    const dispatch = useDispatch();
    const userInput = useSelector(state => state.data.resultsData);

    const onSelectAnswer = (index) => {
        const isAnswerSelected = userInput.find(item => item.id === questionID && item.userChoice === index);
        if (isAnswerSelected) {
          dispatch(removeItem(questionID));
        } else {
          const updateData = { id: questionID, userChoice: index };
          dispatch(updateItem(updateData));
        }
        dispatch(updateNumAnswers())
    };      

    const getButtonType = (index) => {
        return resultsObject !== null ? getButtonTypeFromResults(index) : getButtonTypeFromAnswer(index);
    };

    const getButtonTypeFromAnswer = (index) => {
        const isAnswerSelected = userInput.find(item => item.id === questionID && item.userChoice === index);
        return isAnswerSelected ? isAnswerSelected.userChoice === index ? "primary" : "secondary" : "secondary";
    }
    
    const getButtonTypeFromResults = (index) => {
        const isCorrectAnswer = index === resultsObject.answer;
        const isUserChoice = index === resultsObject.userChoice;

        if (resultsObject.userChoice === null) {
            return isCorrectAnswer ? "primary" : "secondary";
        }

        return isUserChoice ? (isCorrectAnswer ? "correct" : "wrong") : (isCorrectAnswer ? "correct" : "secondary");
    };

    return <>
        {choices.map((choice, index)=>{
            return <Button
                    key={index}
                    text={choice}
                    onClick={()=>{onSelectAnswer(index)}}
                    type={getButtonType(index)}
                    disabled={resultsObject !== null}
                    style={{textAlign: "left"}}
                />
        })}
    </>
}

export default Slider