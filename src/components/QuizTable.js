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
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import QuestionFile from '../models/QuestionFile';

const QuizTable = (props) => {

	const [reportData, setReportData] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [error, setError] = useState(null);
	const dispatch = useDispatch();

	const loadUserList = async () =>{
		let dropDownItems = [];
		let userList=[];
		if(props.userrole==='USER'){
			dropDownItems.push({
				value:JSON.stringify(props.authuser),
				label:props.authuser.displayName
			})
		} else if (props.userrole==='ADMIN'){
			userList = await props.firebase.getAllUsers();
			for (let user of userList){
				dropDownItems.push({
					value:JSON.stringify(user),
					label: user.displayName
				})
			}

		}
		return dropDownItems;
	}


	useEffect (()=>{

		const getQuizFiles = async () => {
			let QLData = [];
			let QuizFiles;
			if (props.userrole==='ADMIN'){
				QuizFiles = await props.firebase.getQFiles('ADMIN');
			} else {
				QuizFiles = await props.firebase.getQFiles('QUIZTABLE');
			}
	
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
	},[props.firebase,props.userrole]);

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
			let QuizFiles
			if (props.userrole==='ADMIN'){
				QuizFiles = await props.firebase.getQFiles('ADMIN');
			} else {
				QuizFiles = await props.firebase.getQFiles('QUIZTABLE');
			}
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
	
	const afterSaveCell = async (oldValue, newValue, row, column, done) => {
		try {
			if (oldValue !== newValue){
				if (column.dataField==='qFileName'){
					row.qFileName = newValue;
				} else if (column.dataField==='user'){
					newValue = JSON.parse(newValue)
					row.uid = newValue.uid;
				}
				await props.firebase.setQFile(row);
				updateQuizFiles();
			}
			return {async:true};
		} catch (error) {
			setError(error);
		}

	}

	const columns = [
		{
			dataField: "qFileName",
			text: "Quiz Name",
			sort: true,
		},
		{
			dataField: "user",
			text: "Quiz Owner",
			sort: true,
			formatter: (cell,row) =>{
				if(cell===null){
					return `Default`;
				} else {
					if (typeof cell!=='object'){
						cell = JSON.parse(cell);
					}
					return `${cell.displayName}`;
				}
			},
			sortValue: (cell, row) => {
				if(row.user===null){
					return `Default`;
				} else {
					return `${row.user.displayName}`;
				}
			},
			editor: {
				type: Type.SELECT,
				getOptions: (setOptions) => {
					loadUserList()
						.then ((ulist)=>{
							setOptions(ulist);
						});
				}
			}
		},
		{
			dataField: "uid",
			text: "User ID",
			hidden: true

		},

		{
			dataField: "qfid",
			text: "Quiz ID",
			hidden: true
		},
		{
			dataField: 'delete',
	        isDummyField: true,
			text: 'Delete',
			editable: false,
			formatter: (cellContent, row) => {
				return (<svg className="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
				<path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z"/>
				<path fillRule="evenodd" d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" clipRule="evenodd"/>
			  </svg>)
			},
			events: {
				onClick: (e, column, columnIndex, row, rowIndex) => {
					if(window.confirm(`Click Ok to Delete Quiz: ${row.qFileName}`)){
						deleteQuiz(row);
					}
				},
			}
		},
		{
			dataField: 'copy',
	        isDummyField: true,
			text: 'Copy',
			editable: false,
			formatter: (cellContent, row) => {
				return (<svg className="bi bi-clipboard" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
				<path fillRule="evenodd" d="M4 1.5H3a2 2 0 00-2 2V14a2 2 0 002 2h10a2 2 0 002-2V3.5a2 2 0 00-2-2h-1v1h1a1 1 0 011 1V14a1 1 0 01-1 1H3a1 1 0 01-1-1V3.5a1 1 0 011-1h1v-1z" clipRule="evenodd"/>
				<path fillRule="evenodd" d="M9.5 1h-3a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5zm-3-1A1.5 1.5 0 005 1.5v1A1.5 1.5 0 006.5 4h3A1.5 1.5 0 0011 2.5v-1A1.5 1.5 0 009.5 0h-3z" clipRule="evenodd"/>
			  </svg>)
			},
			events: {
				onClick: async(e, column, columnIndex, row, rowIndex) => {
					let copyFileName = prompt("Please Enter the Copy's Name", `${row.qFileName} Copy`);
					let newQfile;
					if(copyFileName !== null && copyFileName!==''){
						newQfile = new QuestionFile(null,row.uid,null,row.questions,copyFileName);
						await props.firebase.createQFile(newQfile);
						setIsLoaded(false);
						await updateQuizFiles();
						setIsLoaded(true);
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
								cellEdit={ cellEditFactory({ 
									mode: 'click',
									blurToSave: true,
									afterSaveCell
								 }) }
								bordered={false}
								rowStyle={ rowStyle }
								pagination={paginationFactory({
									sizePerPage: 25,
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

