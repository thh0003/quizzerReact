import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import { Row, Col, Spinner } from "react-bootstrap";
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
	let questionNum = 0;
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
		questionNum = (props.showResults)?props.quiz.getasked():props.quiz.getasked()-1;
		numCorrect = props.quiz.getcorrect();
		percentCorrect = (questionNum===0)?0.00:parseFloat(numCorrect/(questionNum)*100).toFixed(2);
	}

	if (props.showAnswers && props.lastCorrectAnswer!==null){
		if (!props.lastCorrectAnswer.CORRECT){
			CorrectAnswer=`Incorrect:  The correct answer to Question: ${props.lastCorrectAnswer.QuestionText} was ${props.lastCorrectAnswer.CorrectAnswer}: ${props.lastCorrectAnswer.AnswerText}`;
		}
	}


	if (!isLoaded){
		return (
			<Row>
				<Col><Spinner animation="border" /></Col>
			</Row>		
		);
	} else {

		return (
			<React.Fragment>
				<Row>
					<Col>
						<P lang={props.translator.getLangProp()} className="text-left">{componentText.quizProgress}</P>
					</Col>
				</Row>
				<Row>
					<Col><P lang={props.translator.getLangProp()}>{componentText.totalQuestions}: {questionNum}</P></Col>
					<Col><P lang={props.translator.getLangProp()}>{componentText.questionsCorrect}: {numCorrect}</P></Col>
					<Col><P lang={props.translator.getLangProp()}>{componentText.quizPercent} %: {percentCorrect}</P></Col>
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
