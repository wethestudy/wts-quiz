import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Card from '../main/Card';
import Button from '../main/Button';
import Timer from '../main/Timer';
import Slider from '../main/Slider';
import Footer from '../sub/footer';
import quizScreenStyles from './styles/quizscreen.module.css'
import { fetchResultsData } from '../../store/thunk';

function QuizScreen() {
    const dispatch = useDispatch();
    const questions = useSelector(state => state.data.quizData);
    const numAnswersText = useSelector(state => state.data.numAnswers);
    const totalEstTime = useSelector(state => state.data.totalEstTime);
    
    let [body, setBody] = useState(null)
    let [footer, setFooter] = useState(null)

    useEffect(() => {
      setBody(mainBody)
      setFooter(mainFooter)
    }, [numAnswersText])

    const onNotYet = () => {
      setBody(mainBody)
      setFooter(mainFooter)
    }

    const onFinishQuiz = () => {
      setBody(confirmBody)
      setFooter(confirmFooter)
    }

    const onTimerEnd = () => {
      setBody(timerBody)
      setFooter(timerFooter)
    }

    const onSubmit = () => {
      dispatch(fetchResultsData());
    };

    let header = <Timer initSeconds={totalEstTime} onTimerEnd={(onTimerEnd)}/>

    let mainBody = <div className={quizScreenStyles['quiz-wrapper']}><Slider questionArray={questions}/></div>
    let mainFooter = <Footer left={<Button text={"Finish Quiz"} onClick={onFinishQuiz}/>}/>

    let timerBody = <div><div className='h2-style'>Time is Up!</div><div>You've answered {numAnswersText} out of {questions.length} questions</div></div>
    let timerFooter = <Footer left={<Button text={"Submit"} onClick={onSubmit}/>}/>

    let confirmBody = <div><div className='h2-style'>Are you sure you want to submit?</div><div>You've answered {numAnswersText} out of {questions.length} questions. Clicking "Submit" will end the quiz</div></div>
    let confirmFooter = <Footer left={<><Button text={"Submit"} onClick={onSubmit}/><Button text={"Not Yet"} type={"secondary"} onClick={onNotYet}/></>}/>

    return (
        <div>
            <Card header={header} body={body} footer={footer}/>
        </div>
    );
}

export default QuizScreen;