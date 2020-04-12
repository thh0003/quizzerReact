import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Row, Col, ListGroup, Button } from "react-bootstrap";
import {H1, P} from "./StyledHeaders";

const QuizQuestion = (props) => {
	const [selAnswer,setSelAnswer] = useState(0);
	const CurrentQuestion = (typeof props.Question==='undefined' || props.Question===null )?'':props.Question.getQuestion();
//	const CurrentCorrect = (typeof props.Question==='undefined' || props.Question===null )?'':props.Question.getCorrect();
	const CurrentAnswers = (typeof props.Question==='undefined' || props.Question===null )?'':props.Question.getAnswers();
	const dispatch = useDispatch();
	
	const submitAnswer = (e) => {
		dispatch({
			type:'UPDATE_ANSWER',
			SubmitedAnswer:parseInt(e.target.value)
		});
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

	let displayAnswers=[]
	for (let answer in CurrentAnswers){
		displayAnswers.push(<ListGroup.Item action onClick={selectAnswer} key={answer} value={answer} className="text-left">{CurrentAnswers[answer]}</ListGroup.Item>);
	}

	return (
		<React.Fragment>
			<Row>
				<Col>
					<H1 className="text-left">Question</H1>
				</Col>
			</Row>
			<Row>
				<Col>
					<P className="text-left">{CurrentQuestion}</P>
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
					<Button size="xs" onClick={submitAnswer} value={parseInt(selAnswer)+1} variant="primary">Submit Answer</Button>
					<Button size="xs" onClick={stopQuiz} variant="primary">StopQuiz</Button>
				</Col>
			</Row>
		</React.Fragment>
	);
}

export default connect(store => ({
	Question:store.quizzer.Question,
	showAnswers:store.quizzer.showAnswers
}))(QuizQuestion);
