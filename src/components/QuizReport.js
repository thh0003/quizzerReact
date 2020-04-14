import React, {useEffect, useState} from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import StyledStrapCard from "./StyledStrapCard"
import {P, H1} from "./StyledHeaders";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {withFirebase} from "./Firebase";
import { withAuthUser } from './Session';
import {connect, useDispatch} from "react-redux";
import { compose } from 'recompose';
import QuizReportRow from './QuizReportRow';


const timeFormatter = (time) => {
//	time = time * 1000;
	let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = Math.floor((time % (1000 * 60)) / 1000);

	return `${minutes}m ${seconds}s `;
//	return time;
}

const Unix_timestamp = function(t)
{
    //YYYY-MM-DD HH:mm:SS mysql datetime format
    var a = new Date(t);
    var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
//    var hour = a.getHours();
//    var min = a.getMinutes();
//   var sec = a.getSeconds();

    var time = year + '-' + month + '-' + ('0'+date).slice(-2);
    return time;
};

const QuizReport = (props) => {

	const [reportData, setReportData] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [error, setError] = useState(null);
	const [hoverIdx, setHoverIdx] = useState(null);
	const dispatch = useDispatch();

	const closeReport = () => {	
		dispatch ({
			type: 'UPDATE_REPORTS',
			qreport:false,
			areport:false
		});

		setReportData(false);
		setIsLoaded(false);
	}

	useEffect (()=>{
		const getQuizLogs = async (qreport,areport) => {
			let QLData = [];
			let QuizLogData = await props.firebase.getQuizLogs(props.qreport,props.areport,false);

			for (let quizlog in QuizLogData){
			/*	
				QLData.push({
					asked:QuizLogData[quizlog].asked,
					correct:QuizLogData[quizlog].correct,
					duration:QuizLogData[quizlog].duration,
					start_ts:QuizLogData[quizlog].start_ts,
					qid:QuizLogData[quizlog].qid,
					displayName:QuizLogData[quizlog].displayName,
					qCount:QuizLogData[quizlog].qCount
				});
				*/
				QLData.push(QuizLogData[quizlog]);
			}

			setReportData(QLData);
		}

		try{
			if (props.areport && props.qreport)	{
				dispatch ({
					type: 'UPDATE_REPORTS',
					qreport:false,
					areport:true
				});
			} else if (props.areport){
				getQuizLogs(props.qreport,props.areport).then(()=>{
					setIsLoaded(true);
				})
			} else if (props.qreport) {
				getQuizLogs(props.qreport,props.areport).then(()=>{
					setIsLoaded(true);
				})
			}
		} catch(e){
			setIsLoaded(true);
			setError(e);
		}
	},[props.qreport,props.areport,dispatch,props.firebase]);

	const expandRow = {
		renderer: (row, rowIndex) => {
			console.log(`expandRow`)
			console.log(row);
			return (
		  <QuizReportRow rowData={row.questionLog}/>
		)},
		showExpandColumn: true,
		expandByColumnOnly: true
	};

	const actionFormater = (cell, row, rowIndex, { hoverIdx }) => {
		if ((hoverIdx !== null || hoverIdx !== undefined) && hoverIdx === rowIndex) {
		  return (
			<div
			  style={ { width: '20px', height: '20px', backgroundColor: process.env.REACT_APP_BLUE } }
			/>
		  );
		}
		return (
		  <div
			style={ { width: '20px', height: '20px' } }
		  />
		);
	}
	
	const rowEvents = {
		onMouseEnter: (e, row, rowIndex) => {
		  setHoverIdx(rowIndex);
		},
		onMouseLeave: () => {
			setHoverIdx(null);
		}
	}
	
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

	
	const columns = [
		{
			dataField: "qCount",
			text: "Total Questions",
			sort: true,
		},
		{
			dataField: "asked",
			text: "Questions Asked",
			sort: true,
		},
		{
			dataField: "correct",
			text: "Answered Correct",
			sort: true
		},
		{
			dataField: "duration",
			text: "Quiz Duration",
			sort: true,
			formatter: timeFormatter,
		},        
		{
			dataField: "start_ts",
			text: "Quiz Date",
			sort: true,
			formatter: Unix_timestamp,
		},
		{
			dataField: "qid",
			text: "Quiz ID",
			sort: true,
		},
		{
			dataField: "displayName",
			text: "User",
			sort: true,
		},
		{
			text: '',
			isDummyField: true,
			formatter: actionFormater,
			formatExtraData: { hoverIdx: hoverIdx },
			headerStyle: { width: '50px' },
			style: { height: '30px' }
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
	} else if (!isLoaded){
		return (
			<StyledStrapCard>
				<Card.Title><H1>Loading ...</H1></Card.Title>
			</StyledStrapCard>		
		);
	} else {
		if (reportData) {
			return (
				<React.Fragment>
					<Row>
						<Col className="text-center">
							<P>QuizReport</P>
						</Col>
					</Row>
					<Row>
						<Col style={quizReportStyle}>
							<BootstrapTable
								keyField="qid"
								headerClasses="bg-primary text-white"
								striped={true}
								condensed={true}
								hover={true}
								data={reportData}
								columns={columns}
								bootstrap4
								bordered={false}
								rowStyle={ rowStyle }
								rowEvents={ rowEvents }
								expandRow={ expandRow }
								pagination={paginationFactory({
									sizePerPage: 25,
									sizePerPageList: [5, 10, 25, 50]
								})}
							/>
						</Col>
					</Row>
					<Row>
						<Col className="text-center">
							<Button size="xs" onClick={closeReport} variant="primary">Close Report</Button>
						</Col>
					</Row>			
				</React.Fragment>
			);
		} else {
			return (
				<Row>
					<Col className="text-center">
						<P>QuizReport</P>
					</Col>
				</Row>			
			);
		}
	}
}

export default compose(withFirebase, withAuthUser, connect(store => ({
	qstart: store.quizzer.qstart,
	qreport: store.quizzer.qreport,
	areport: store.quizzer.areport,
	Qfiles: store.quizzer.Qfiles,
})))(QuizReport);

