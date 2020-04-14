import React, { useState, useEffect} from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
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

const Quiz = (props) => {

	const [isLoaded, setIsLoaded] = useState(false);
	const [showResults,setShowResults] = useState(false);
	const [error, setError] = useState(null);
	const dispatch = useDispatch();

	const saveQuizResults = async () => {
		await props.firebase.createQuizLog(props.quiz);		
		setShowResults(false);
		setIsLoaded(false);
		dispatch({
			type:'QUIZ_RESET',
			quiz:null
		});
	}

	const gotoDashboard = async () => {

		setShowResults(false);
		setIsLoaded(false);
		dispatch({
			type:'QUIZ_RESET',
			quiz:null
		});

	}

	useEffect(()=>{
		try{
			const createQuiz = async () => {
				let newquiz = await new QuizLog(-1,props.authuser.uid,false,"WEB",props.numQuestions,0,0,props.timeLimit, Math.floor(new Date()),props.selectedQfile);
				return newquiz;
			}

			if (props.qstart===true){
				createQuiz()
					.then( (newQuiz) =>{
						newQuiz.quizInit()
							.then ((qInit)=>{
								let Question = newQuiz.getQuestion();
								dispatch({
									type:'UPDATE_QUESTION',
									Question:Question
								});
								dispatch({
									type:'UPDATE_QUIZ',
									quiz:newQuiz
								});
								setIsLoaded(true);		
							})
					});
			}
			
		} catch (e){
			setIsLoaded(true);
			setError(e);
		}
	},[props.qstart,dispatch,props.authuser.uid,props.numQuestions,props.selectedQfile,props.timeLimit]);

	useEffect(()=>{
		try{
			if (props.SubmitedAnswer!==0){
				let correct=props.quiz.getcorrect();
				let asked=props.quiz.getasked();
				let qCount=props.quiz.getqcount();
				var nextQuestion;
				let lastCorrectAnswer = {};
				lastCorrectAnswer['CorrectAnswer']=props.Question.getCorrect();
				lastCorrectAnswer['CORRECT']=false

				if (props.SubmitedAnswer===props.Question.getCorrect()){
					correct++;
					lastCorrectAnswer['CORRECT']=true;
				}

				dispatch({
					type:'UPDATE_CORRECT_ANSWER',
					lastCorrectAnswer:lastCorrectAnswer
				});


				const nextQuizState = produce(props.quiz, draftQuiz =>{
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
					let qstartTS = props.quiz.getstart_ts();
					let quizDuration = endTS - qstartTS;

					const nextQuizState = produce(props.quiz, draftQuiz =>{
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
				let qstartTS = props.quiz.getstart_ts();
				let quizDuration = endTS - qstartTS;
	
				const nextQuizState = produce(props.quiz, draftQuiz =>{
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
	},[props.SubmitedAnswer,props.timesUp,props.quiz,dispatch,props.Question])

	if (error){
		return (
			<StyledStrapCard>
				<Card.Title><H1>Error: {error.message}, {error.stack}</H1></Card.Title>
			</StyledStrapCard>
			);
	} else if (!props.qstart || !isLoaded) {
		return (
			<StyledStrapCard>
				<Card.Title><H1>Loading ...</H1></Card.Title>
			</StyledStrapCard>		
		);
	} else if (showResults) {
		return (
			<React.Fragment>
				<Row>
					<Col>
						<H1 className="text-left">Quiz Results</H1>
					</Col>
				</Row>
				<Row>
					<Col>
						<QuizProgress />
					</Col>
				</Row>
				<Row>
					<Col className="text-left">
						<Button size="xs" onClick={saveQuizResults} variant="primary">Save Quiz Results</Button>
						<Button size="xs" onClick={gotoDashboard} variant="primary">Main Menu</Button>
					</Col>
				</Row>
			</React.Fragment>			
		);
	} else {

		return (
			<React.Fragment>
				<Row>
					<Col>
						<H1 className="text-left">Quiz</H1>
					</Col>
				</Row>
				<Row>
					<Col>
						<QuizProgress />
					</Col>
				</Row>
				<Row>
					<Col>
						<QuizQuestion />
					</Col>
				</Row>
			</React.Fragment>
		);
	}
}
export default compose(withFirebase, withAuthUser, connect(store => ({
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
