import React, {useState, useEffect} from "react";
import { connect, useDispatch } from "react-redux";
import { Row, Col, ListGroup, Button, Spinner } from "react-bootstrap";
import {H1, P} from "./StyledHeaders";
import { compose } from 'recompose';	
import {withTranslator} from './Translator';
import { withRouter, useHistory } from "react-router-dom";

const initialState = {	
	loading:"Loading ...",
	question:"Question",
	submit:"Submit Answer",
	stop:"Stop Quiz"
};

const QuizQuestion = (props) => {
	const [selAnswer,setSelAnswer] = useState(0);
	const [question, setQuestion] = useState(props.Question);
	const [CurrentQuestion, setCurrentQuestion] = useState((typeof question==='undefined' || question===null )?'':question.getQuestion());
	const [CurrentAnswers, setCurrentAnswers]  = useState((typeof question==='undefined' || question===null )?'':question.getAnswers());
	const dispatch = useDispatch();
	const [componentText,setComponentText] = useState(initialState);
	const [isQuestionLoaded,setIsQuestionLoaded] = useState(false);
	const history = useHistory();

	useEffect(()=>{setQuestion(props.Question)},[props.Question]);
	useEffect(()=>{setCurrentQuestion((typeof question==='undefined' || question===null )?setIsQuestionLoaded(false):question.getQuestion())},[question]);
	useEffect(()=>{setCurrentAnswers((typeof question==='undefined' || question===null )?setIsQuestionLoaded(false):question.getAnswers())},[question]);
	const submitAnswer = (e) => {
		dispatch({
			type:'UPDATE_ANSWER',
			SubmitedAnswer:parseInt(e.target.value),
		});
		setIsQuestionLoaded(false);
	}

	const stopQuiz = () => {
		dispatch({
			type:'QUIZ_RESET',
			quiz:null
		});
		history.push('/Quizzer');
	}

	const selectAnswer = (e) => {
		let selAnswer = e.target.value;
		setSelAnswer(selAnswer);
	}

	useEffect (()=>{
		if(question!==null){
			let translateList = initialState;

			for (let answer in CurrentAnswers){
				translateList[answer]=CurrentAnswers[answer];
			}
			translateList[CurrentQuestion] = CurrentQuestion;
			props.translator.getCompTranslation(translateList)
				.then ((translation)=>{
					setComponentText(translation);
					setIsQuestionLoaded(true);
				});
		}
	},[props.translator, CurrentAnswers, CurrentQuestion, question]);

	if (!isQuestionLoaded){
		return (
			<Row>
				<Col><Spinner animation="border" /></Col>
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

export default compose(withTranslator, withRouter, connect(store => ({
	Question:store.quizzer.Question,
	showAnswers:store.quizzer.showAnswers
})))(QuizQuestion);
