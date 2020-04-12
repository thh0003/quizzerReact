import React from "react";
import {connect} from "react-redux";
import { Row, Col } from "react-bootstrap";
import {P, Answer} from "./StyledHeaders";
import TimeLimit from "./TimeLimit";

const QuizProgress = (props) => {
	let questionNum = 1;
	let numCorrect =0;
	let percentCorrect = 0.00;
	let CorrectAnswer='';
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

	return (
		<React.Fragment>
			<Row>
				<Col>
					<P className="text-left">Quiz Progress</P>
				</Col>
			</Row>
			<Row>
				<Col><P>Total Questions #: {questionNum}</P></Col>
				<Col><P># Correct: {numCorrect}</P></Col>
				<Col><P>Quiz %: {percentCorrect}</P></Col>
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

export default connect(store => ({
	quiz: store.quizzer.quiz,
	SubmitedAnswer:store.quizzer.SubmitedAnswer,
	lastCorrectAnswer:store.quizzer.lastCorrectAnswer,
	showAnswers:store.quizzer.showAnswers
}))(QuizProgress);
