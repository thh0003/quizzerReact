import React, { useState, useEffect} from "react";
import { Row, Col, Card, Button,Spinner } from "react-bootstrap";
import { H1} from "./StyledHeaders";
import QuizProgress from "./QuizProgress";
import QuizQuestion from "./QuizQuestion";
import QuizLog from "../models/QuizLog";
import {connect, useDispatch} from "react-redux";
import StyledStrapCard from "./StyledStrapCard";
import produce from "immer"
import { compose } from 'recompose';
import {withFirebase} from './Firebase';
import { withAuthUser } from "./Session";
import {withTranslator} from './Translator';
import { withRouter, useHistory } from "react-router-dom";

const initialState = {	
	loading:"Loading ...",
	quizResult:"Quiz Result",
	saveResult:"Save Quiz Results",
	mainMenu:"Main Menu",
	quizHeader:"Quiz",
};

const Quiz = (props) => {

	const [isQuizLoaded, setIsQuizLoaded] = useState(false);
	const [showResults,setShowResults] = useState(false);
	const [error, setError] = useState(null);
	const dispatch = useDispatch();
	const [isTransLoaded, setIsTransLoaded] = useState(false);
	const [componentText,setComponentText] = useState(initialState);
	const [qstart, setQstart] = useState(props.qstart);
	const [quiz, setQuiz] = useState(props.quiz);
	const history = useHistory();

	const saveQuizResults = async () => {
		await props.firebase.createQuizLog(quiz);		
		setShowResults(false);
		setIsQuizLoaded(false);
		setIsTransLoaded(false);
		dispatch({
			type:'QUIZ_RESET',
			quiz:null
		});
		history.push('/Quizzer');
	}

	const gotoDashboard = async () => {

		setShowResults(false);
		setIsQuizLoaded(false);
		setIsTransLoaded(false);
		dispatch({
			type:'QUIZ_RESET',
			quiz:null
		});
		history.push('/Quizzer');

	}

	useEffect(()=>{setQstart(props.qstart);},[props.qstart]);
	useEffect(()=>{
		setQuiz(props.quiz);
		if (qstart===true && quiz!==null){
			setIsQuizLoaded(true);
		}
	},[props.quiz,qstart,quiz]);

	useEffect(()=>{
		try{
			const createQuiz = async () => {
				let newquiz = await new QuizLog(-1,props.authuser.uid,false,"WEB",props.numQuestions,0,0,props.timeLimit, Math.floor(new Date()),props.selectedQfile);
				return newquiz;
			}

			if (qstart===true && quiz===null){
				createQuiz()
					.then( (newQuiz) =>{
						console.log(`New Quiz Created`);
						newQuiz.quizInit()
							.then ((qInit)=>{
								let Question = newQuiz.getQuestion();
								dispatch({
									type:'UPDATE_QUIZ',
									quiz:newQuiz
								});
								dispatch({
									type:'UPDATE_QUESTION',
									Question:Question
								});
							})
					});
			}
			
		} catch (e){
			setIsQuizLoaded(true);
			setError(e);
		}
	},[qstart,dispatch,props.authuser.uid,props.numQuestions,props.selectedQfile,props.timeLimit,quiz]);

	useEffect(()=>{
		try{
			if (props.SubmitedAnswer!==0){
				let correct=quiz.getcorrect();
				let asked=quiz.getasked();
				let qCount=quiz.getqcount();
				var nextQuestion;
				let lastCorrectAnswer = {};
				lastCorrectAnswer['CorrectAnswer']=props.Question.getCorrect();
				lastCorrectAnswer['CORRECT']=false;
				lastCorrectAnswer['AnswerText']=props.Question.answers[props.Question.getCorrect()-1];
				lastCorrectAnswer['QuestionText']=props.Question.question;

				if (props.SubmitedAnswer===props.Question.getCorrect()){
					correct++;
					lastCorrectAnswer['CORRECT']=true;
				}

				dispatch({
					type:'UPDATE_CORRECT_ANSWER',
					lastCorrectAnswer:lastCorrectAnswer
				});


				const nextQuizState = produce(quiz, draftQuiz =>{
					let qlogIndex = Object.keys(draftQuiz.questionLog).length;
					draftQuiz.questionLog[qlogIndex].SubmitedAnswer = props.SubmitedAnswer;
					draftQuiz.setcorrect(correct);
					if (asked<qCount){
						nextQuestion = draftQuiz.getQuestion();
					}
				});

				if (asked<qCount){
					dispatch({
						type:'UPDATE_QUESTION',
						Question:nextQuestion
					});

					dispatch({
						type:'UPDATE_ANSWER',
						SubmitedAnswer:0
					});
	
					dispatch({
						type:'UPDATE_QUIZ',
						quiz:nextQuizState
					});
	
				} else {

					//Save Quiz Results
					let endTS = Math.floor(new Date())
					let qstartTS = quiz.getstart_ts();
					let quizDuration = endTS - qstartTS;

					const nextQuizState = produce(quiz, draftQuiz =>{
						draftQuiz.setduration(quizDuration);
					});

					dispatch({
						type:'UPDATE_ANSWER',
						SubmitedAnswer:0
					});

					dispatch({
						type:'UPDATE_TIMESUP',
						timesUp:true
					});


					dispatch({
						type:'UPDATE_QUIZ',
						quiz:nextQuizState
					});

					dispatch({
						type:'UPDATE_QUESTION',
						Question:null
					});
					
					setShowResults(true);
				}
			}
			if (props.timesUp){

				//Save Quiz Results
				let endTS = Math.floor(new Date())
				let qstartTS = quiz.getstart_ts();
				let quizDuration = endTS - qstartTS;
	
				const nextQuizState = produce(quiz, draftQuiz =>{
					let qlogIndex = Object.keys(draftQuiz.questionLog).length;
					draftQuiz.questionLog[qlogIndex].SubmitedAnswer = 0;
					draftQuiz.setduration(quizDuration);
				});
	
				dispatch({
					type:'UPDATE_QUIZ',
					quiz:nextQuizState
				});
				
				setShowResults(true);
			}
		} catch (e){
			setError(e);
		} 
	},[props.SubmitedAnswer,props.timesUp,quiz,dispatch,props.Question])

	useEffect (()=>{
		if (qstart===true && quiz!==null){
			props.translator.getCompTranslation(initialState)
				.then ((translation)=>{
					setComponentText(translation);
					setIsTransLoaded(true);
				});
		}
	},[props.translator,qstart,quiz]);

	if (error){
		return (
			<StyledStrapCard>
				<Card.Title><H1>Error: {error.message}, {error.stack}</H1></Card.Title>
			</StyledStrapCard>
			);
	} else if (!qstart || !isQuizLoaded || !isTransLoaded) {
		return (
			<StyledStrapCard>
				<Card.Title><Spinner animation="border" /></Card.Title>
			</StyledStrapCard>		
		);
	} else if (showResults) {
		return (
			<React.Fragment>
				<Row>
					<Col>
						<H1 className="text-left" lang={props.translator.getLangProp()}>{componentText.quizResult}</H1>
					</Col>
				</Row>
				<Row>
					<Col>
						<QuizProgress showResults={true} />
					</Col>
				</Row>
				<Row>
					<Col className="text-left">
						<Button size="xs" lang={props.translator.getLangProp()} onClick={saveQuizResults} variant="primary">{componentText.saveResult}</Button>
						<Button size="xs" lang={props.translator.getLangProp()} onClick={gotoDashboard} variant="primary">{componentText.mainMenu}</Button>
					</Col>
				</Row>
			</React.Fragment>			
		);
	} else {

		return (
			<React.Fragment>
				<Row>
					<Col>
						<H1 className="text-left" lang={props.translator.getLangProp()}>{componentText.quizHeader}</H1>
					</Col>
				</Row>
				<Row>
					<Col>
						<QuizProgress />
					</Col>
				</Row>
				<Row>
					<Col>
						<QuizQuestion questionNum={(quiz!==null)?quiz.getasked():0}/>
					</Col>
				</Row>
			</React.Fragment>
		);
	}
}
export default compose(withFirebase, withAuthUser, withTranslator, withRouter, connect(store => ({
	quiz:store.quizzer.quiz,
	qstart:store.quizzer.qstart,
	numQuestions:store.quizzer.numQuestions,
	timeLimit:store.quizzer.timeLimit,
	selectedQfile:store.quizzer.selectedQfile,
	Question:store.quizzer.Question,
	SubmitedAnswer:store.quizzer.SubmitedAnswer,
	lastCorrectAnswer:store.quizzer.lastCorrectAnswer,
	timesUp:store.quizzer.timesUp
})))(Quiz);
