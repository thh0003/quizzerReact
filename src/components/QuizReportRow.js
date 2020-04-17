import React, {useState, useEffect} from "react";
import { Row, Col, Container } from "react-bootstrap";
import {P} from "./StyledHeaders";
import {withTranslator} from './Translator';

const initialState = {	
	submitted:"Submitted Answer",
	correct:"Correct Answer",
};

const QuizReportRow = (props) => {
	const rowData = props.rowData;
	const [componentText,setComponentText] = useState(initialState);

	useEffect (()=>{
		props.translator.getCompTranslation(initialState)
			.then ((translation)=>{
				setComponentText(translation);
			});
	},[props.translator]);

	const quizReportStyle={
		fontSize:10,
		textAlign:"left",
		color:process.env.REACT_APP_BLUE
	};
	const quizReportStyleWrong={
		fontSize:10,
		textAlign:"left",
		backgroundColor:"rgba(255, 0, 0, .25)",
		color:"white"
	};
	const quizReportStyleCorrect={
		fontSize:10,
		textAlign:"left",
		backgroundColor:"rgba(255, 255, 0, .25)",
		color:"black"
	};
	const questionStyle={
		border:5,
		borderColor:process.env.REACT_APP_BLUE
	}

	if (rowData) {

		let quizLog = [];
		let questionRender =``;
		for (let question in rowData){
			let correctAns = rowData[question].correct;
			let submittedAns = rowData[question].SubmitedAnswer;
			let isCorrect = (correctAns!==submittedAns)?quizReportStyleWrong:quizReportStyleCorrect;
			questionRender = (
				<Container style={questionStyle}>
					<Row style={quizReportStyle}>
						<Col style={quizReportStyle}>{`${rowData[question].QuestionNumber}) ${rowData[question].Question}`}</Col>
					</Row>
					<Row style={isCorrect}>
						<Col>{`${componentText.submitted}: ${submittedAns}`}</Col>
						<Col>{`${componentText.correct}: ${correctAns}`}</Col>
					</Row>
				</Container>
			);
			quizLog.push(questionRender)
		}

		return (
			<React.Fragment>
				<Row>
					<Col>
						{quizLog}
					</Col>
				</Row>
			</React.Fragment>
		);
	} else {
		return (
			<Row>
				<Col className="text-center">
					<P>Row Empty</P>
				</Col>
			</Row>			
		);
	}
}

export default withTranslator(QuizReportRow);

