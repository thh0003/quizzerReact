import React, {useEffect, useState} from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import StyledStrapCard from "./StyledStrapCard"
import {P, H1} from "./StyledHeaders";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {withFirebase} from "./Firebase";
import { withAuthUser } from './Session';
import { compose } from 'recompose';
import {withTranslator, TranslateTag} from './Translator';
import {useDispatch} from "react-redux";

const QuizTable = (props) => {

	const [reportData, setReportData] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [error, setError] = useState(null);
	const dispatch = useDispatch();

	useEffect (()=>{

		const getQuizFiles = async () => {
			let QLData = [];
			let QuizFiles = await props.firebase.getQFiles('QUIZTABLE');
	
			for (let quizFile in QuizFiles){
				QLData.push(QuizFiles[quizFile]);
			}
			setReportData(QLData);
		}

		try{
			getQuizFiles().then(()=>{
				setIsLoaded(true);
			})
		} catch(e){
			setIsLoaded(true);
			setError(e);
		}
	},[props.firebase]);

	const rowStyle = (row, rowIndex) => {
		row.index = rowIndex;
		const style = {};
		if (rowIndex % 2 === 0) {
		  style.backgroundColor = 'transparent';
		} else {
		  style.backgroundColor = 'rgba(54, 163, 173, .10)';
		}
		style.borderTop = 'none';
	
		return style;
	}

	const updateQuizFiles = async () =>{
		try{
			let QLData = [];
			let QuizFiles = await props.firebase.getQFiles('QUIZTABLE');
			let allQuizFiles = await props.firebase.getQFiles();
			for (let quizFile in QuizFiles){
				QLData.push(QuizFiles[quizFile]);
			}
			dispatch({
				type:'UPDATE_QFILES',
				Qfiles:allQuizFiles
			});
				
			dispatch({
				type:'UPDATE_QFILE',
				selectedQfile:allQuizFiles[Object.keys(allQuizFiles)[0]]
			});
			setReportData(QLData);
		} catch(e){
			setIsLoaded(true);
			setError(e);
		}
	}

	const deleteQuiz = async (quizFile) =>{
		await props.firebase.deleteQuizFile(quizFile);
		setIsLoaded(false);
		await updateQuizFiles();
		setIsLoaded(true);
	}


	const columns = [
		{
			dataField: "qFileName",
			text: "Quiz Name",
			sort: true,
		},
		{
			dataField: "qfid",
			text: "Quiz ID",
			hidden: true
		},
		{
			dataField: 'delete',
	        isDummyField: true,
			text: 'Actions',
			formatter: (cellContent, row) => {
				return (<svg className="bi bi-x-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
				<path fillRule="evenodd" d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z" clipRule="evenodd"/>
				<path fillRule="evenodd" d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z" clipRule="evenodd"/>
				<path fillRule="evenodd" d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z" clipRule="evenodd"/>
			  </svg>)
			},
			events: {
				onClick: (e, column, columnIndex, row, rowIndex) => {
					if(window.confirm(`Click Ok to Delete Quiz: ${row.qFileName}`)){
						deleteQuiz(row);
					}
				},
			}
		}
	];

	const quizReportStyle={
		fontSize:10,
		textAlign:"left"
	};

	if (error) {
	return (
			<StyledStrapCard>
				<Card.Title><H1>Error: {error.message}</H1></Card.Title>
			</StyledStrapCard>
			);
	} else if (!isLoaded ){
		return (
			<StyledStrapCard>
				<Card.Title><Spinner animation="border" /></Card.Title>
			</StyledStrapCard>		
		);
	} else {
		if (reportData) {
			return (
				<React.Fragment>
					<Row>
						<Col className="text-center">
							<P lang={props.translator.getLangProp()}><TranslateTag>Your Quiz</TranslateTag></P>
						</Col>
					</Row>
					<Row>
						<Col style={quizReportStyle}>
							<BootstrapTable
								keyField="qfid"
								headerClasses="bg-primary text-white"
								striped={true}
								condensed={true}
								hover={true}
								data={reportData}
								columns={columns}
								bootstrap4
								bordered={false}
								rowStyle={ rowStyle }
								pagination={paginationFactory({
									sizePerPage: 5,
									sizePerPageList: [5, 10, 25, 50]
								})}
							/>
						</Col>
					</Row>
				</React.Fragment>
			);
		} else {
			return (
				<Row>
					<Col className="text-center">
						<P><TranslateTag>No Quizzes</TranslateTag></P>
					</Col>
				</Row>			
			);
		}
	}
}

export default compose(withFirebase, withAuthUser, withTranslator)(QuizTable);

