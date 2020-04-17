import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import { Row, Col } from "react-bootstrap";
import {P, Answer} from "./StyledHeaders";
import TimeLimit from "./TimeLimit";
import { compose } from 'recompose';	
import {withTranslator} from './Translator';

const initialState = {	
	loading:"Loading ...",
	quizProgress:"Quiz Progress",
	totalQuestions:"Total Questions #",
	questionsCorrect:"# Correct",
	quizPercent:"Quiz",
};


const QuizProgress = (props) => {
	let questionNum = 1;
	let numCorrect =0;
	let percentCorrect = 0.00;
	let CorrectAnswer='';

	const [componentText,setComponentText] = useState(initialState);
	const [isLoaded,setIsLoaded] = useState(false);

	useEffect (()=>{
		props.translator.getCompTranslation(initialState)
			.then ((translation)=>{
				setComponentText(translation);
				setIsLoaded(true);
			});
	},[props.translator]);

	if (props.quiz!==null){
		questionNum = props.quiz.getasked();
		numCorrect = props.quiz.getcorrect();
		percentCorrect = (questionNum===1)?0.00:parseFloat(numCorrect/(questionNum-1)*100).toFixed(2);
	}

	if (props.showAnswers==='SHOW' && props.lastCorrectAnswer!==null){
		if (!props.lastCorrectAnswer.CORRECT){
			CorrectAnswer=`Incorrect:  The correct selection was ${props.lastCorrectAnswer.CorrectAnswer}`;
		}
	}


	if (!isLoaded){
		return (
			<Row>
				<Col><h1>{componentText.loading}</h1></Col>
			</Row>		
		);
	} else {

		return (
			<React.Fragment>
				<Row>
					<Col>
						<P className="text-left">{componentText.quizProgress}</P>
					</Col>
				</Row>
				<Row>
					<Col><P>{componentText.totalQuestions}: {questionNum}</P></Col>
					<Col><P>{componentText.questionsCorrect}: {numCorrect}</P></Col>
					<Col><P>{componentText.quizPercent} %: {percentCorrect}</P></Col>
					<Col><TimeLimit /></Col>
				</Row>
				<Row>
					<Col>
						<Answer className="text-left">{CorrectAnswer}</Answer>
					</Col>
				</Row>
			</React.Fragment>
		);
	}
}

export default compose(withTranslator, connect(store => ({
	quiz: store.quizzer.quiz,
	SubmitedAnswer:store.quizzer.SubmitedAnswer,
	lastCorrectAnswer:store.quizzer.lastCorrectAnswer,
	showAnswers:store.quizzer.showAnswers
})))(QuizProgress);
