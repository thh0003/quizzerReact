import React, {useState, useEffect} from "react";
import { connect, useDispatch } from "react-redux";
import { Row, Col, ListGroup, Button } from "react-bootstrap";
import {H1, P} from "./StyledHeaders";
import { compose } from 'recompose';	
import {withTranslator} from './Translator';

const initialState = {	
	loading:"Loading ...",
	question:"Question",
	submit:"Submit Answer",
	stop:"Stop Quiz"
};

const QuizQuestion = (props) => {
	const [selAnswer,setSelAnswer] = useState(0);
	const CurrentQuestion = (typeof props.Question==='undefined' || props.Question===null )?'':props.Question.getQuestion();
//	const CurrentCorrect = (typeof props.Question==='undefined' || props.Question===null )?'':props.Question.getCorrect();
	const CurrentAnswers = (typeof props.Question==='undefined' || props.Question===null )?'':props.Question.getAnswers();
	const dispatch = useDispatch();
	const [componentText,setComponentText] = useState(initialState);
	const [isLoaded,setIsLoaded] = useState(false);

	const submitAnswer = (e) => {
		dispatch({
			type:'UPDATE_ANSWER',
			SubmitedAnswer:parseInt(e.target.value)
		});
		setIsLoaded(false);
	}

	const stopQuiz = () => {
		dispatch({
			type:'QUIZ_RESET',
			quiz:null
		});
	}

	const selectAnswer = (e) => {
		let selAnswer = e.target.value;
		setSelAnswer(selAnswer);
	}

	useEffect (()=>{
		let translateList = initialState;

		for (let answer in CurrentAnswers){
			translateList[answer]=CurrentAnswers[answer];
		}
		translateList[CurrentQuestion] = CurrentQuestion;
		props.translator.getCompTranslation(translateList)
			.then ((translation)=>{
				setComponentText(translation);
				setIsLoaded(true);
			});

		return function cleanup() {
			translateList=null;
		};
	},[props.translator, CurrentAnswers, CurrentQuestion]);

	if (!isLoaded){
		return (
			<Row>
				<Col><h1 lang={props.translator.getLangProp()}>{componentText.loading}</h1></Col>
			</Row>
		);
	} else {	

		let displayAnswers=[]
		for (let answer in CurrentAnswers){
			displayAnswers.push(<ListGroup.Item lang={props.translator.getLangProp()} action onClick={selectAnswer} key={answer} value={answer} className="text-left">{componentText[answer]}</ListGroup.Item>);
		}

		return (
			<React.Fragment>
				<Row>
					<Col>
						<H1 lang={props.translator.getLangProp()} className="text-left">{componentText.question} {props.questionNum}</H1>
					</Col>
				</Row>
				<Row>
					<Col>
						<P lang={props.translator.getLangProp()} className="text-left">{componentText[CurrentQuestion]}</P>
					</Col>
				</Row>
				<Row>
					<Col>
						<ListGroup>
							{displayAnswers}
						</ListGroup>
					</Col>
				</Row>
				<Row>
					<Col className="text-left">
						<Button size="xs" lang={props.translator.getLangProp()} onClick={submitAnswer} value={parseInt(selAnswer)+1} variant="primary">{componentText.submit}</Button>
						<Button size="xs" lang={props.translator.getLangProp()}  onClick={stopQuiz} variant="primary">{componentText.stop}</Button>
					</Col>
				</Row>
			</React.Fragment>
		);
	}
}

export default compose(withTranslator, connect(store => ({
	Question:store.quizzer.Question,
	showAnswers:store.quizzer.showAnswers
})))(QuizQuestion);
