import React from "react";
import quizTitleStyles from "./styles/quiztitle.module.css"

const QuizTitle = ({text="", title=""}) => {
    return <div className={quizTitleStyles['quiz-title-wrapper']}>
        <div className={quizTitleStyles['text']}>{text}</div>
        <div className={quizTitleStyles['quiz-title']}>{title}</div>
    </div>
}

export default QuizTitle