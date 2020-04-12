import React, {useState, useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import { Form,Row, Col, Button, Card } from "react-bootstrap";
import { H1,P } from "./StyledHeaders";
import StyledStrapCard from "./StyledStrapCard";
import {withFirebase} from "./Firebase";
import { withAuthUser } from './Session';
import { compose } from 'recompose';
import QuestionFile from "../models/QuestionFile";
import Quiz from "./Quiz";
import QuizReport from "./QuizReport";
import QuizTooltip from "./QuizTooltip";
import produce from "immer"


function Quizzer(props) {

	const [selectedQfile, setselectedQFile] = useState(props.selectedQfile);
	const [numQuestions, setNumQuestions] = useState(props.numQuestions);
	const [Qfiles, setQfiles] = useState(props.Qfiles);
	const [qFileAdded, setqFileAdded] = useState(false);
	const [isLoaded,setIsLoaded] = useState(false);
	const [error, setError] = useState(null);
//	const [qfileDropdown, setqfileDropdown] = useState([]);
	const [newqFile, setNewqFile] = useState(null);
	const [timeLimit, setTimeLimit] = useState(props.timeLimit);
	const [qstart, /*setqstart*/] = useState(props.qstart);
	const [showAnswers, setShowAnswers] = useState(props.showAnswers);
	const sectionVisible = props.sectionVisible;
	const dispatch = useDispatch();

	const createDropdown = ()=>{
		let qfileDrop=[];
		if (selectedQfile!==null){
			qfileDrop.push(<option key={selectedQfile.qfid} value={selectedQfile.qfid}>{selectedQfile.qFileName}</option>)
		}
		for (let qfile in Qfiles){
			if(Qfiles[qfile].qfid!==selectedQfile.qfid){
				qfileDrop.push(<option key={Qfiles[qfile].qfid} value={Qfiles[qfile].qfid} >{Qfiles[qfile].qFileName}</option>)
			}
		}
		return qfileDrop;
	}

	const loadNewQfile = async () => {
		try{
			//qFile=null, uid=null, qfid=null, questions=[], qFileName=''
			if (newqFile){
				let newQuestionFile = new QuestionFile(newqFile,props.authuser.uid,null,[],newqFile.name);
				let loaded = await newQuestionFile.indexFile();
				if (loaded){
					await props.firebase.createQFile(newQuestionFile);
					setselectedQFile(newQuestionFile);
					setqFileAdded(true);
					const nextQfilesState = produce(Qfiles, draftState =>{
						draftState[newQuestionFile.qfid] = newQuestionFile;
					});
					
					dispatch({
						type:'UPDATE_QFILES',
						Qfiles:nextQfilesState
					});
					dispatch({
						type:'UPDATE_QFILE',
						selectedQfile:newQuestionFile
					});
				}
			} else {
				throw new Error(`No Question File Specified`);
			}
		} catch (error){
			console.error(`Quizzer->loadNewQfile Error: ${error.message}, ${error.stack}`)
		}
	}

	useEffect(()=>{
		try{
			if (Qfiles===null || qFileAdded===true){
				props.firebase.getQFiles()
					.then((qfiles)=>{
						if (qfiles){
							setQfiles(qfiles);
							dispatch({
								type:'UPDATE_QFILES',
								Qfiles:qfiles
							});
							if (selectedQfile===null){
								setselectedQFile(qfiles[Object.keys(qfiles)[0]]);
								dispatch({
									type:'UPDATE_QFILE',
									selectedQfile:qfiles[Object.keys(qfiles)[0]]
								});
							}
						}		
						setIsLoaded(true);
						setqFileAdded(false);
					})
			} else if (selectedQfile===null) {
				setselectedQFile(Qfiles[Object.keys(Qfiles)[0]]);
				dispatch({
					type:'UPDATE_QFILE',
					selectedQfile:Qfiles[Object.keys(Qfiles)[0]]
				});
				setIsLoaded(true);
			} else {
				setIsLoaded(true);
			}
		} catch (e){
			setIsLoaded(true);
			setError(e);
		}
	}, [selectedQfile,qFileAdded,qstart, dispatch,props.firebase,Qfiles]);

	const onNewQfileChange = event => {
        if (event.target.files[0]){
			setNewqFile(event.target.files[0]);
        }
	};

	const setqCount = (e) => {
		setNumQuestions(parseInt(e.target.value));
		dispatch({
			type:'UPDATE_NUMQUESTIONS',
			numQuestions:parseInt(e.target.value)
		});
	}

	const onSelectQuizFileChange = async (e) => {
		let curQFile = props.Qfiles[e.target.value];
		setselectedQFile(curQFile);
		dispatch({
			type:'UPDATE_QFILE',
			selectedQfile:curQFile
		});
	}

	const saveShowAnswers = async (e) => {
		setShowAnswers(e.target.value);
		dispatch({
				type:'UPDATE_SHOWANSWERS',
				showAnswers:e.target.value
			});
	}

	const onTimeLimitChange = (e) =>{
		setTimeLimit(parseInt(e.target.value));
		dispatch({
			type:'UPDATE_TIMELIMIT',
			timeLimit:parseInt(e.target.value)
		});
	}
	
	
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

		return (
				<StyledStrapCard >
					<Card.Body>
						<Row className={sectionVisible.SETTINGS}>
							<Col>
								<Row>
									<Col><H1 className="text-left">Quiz Options</H1></Col>
								</Row>
								<Row>
									<Col className="text-right"><P><QuizTooltip tipID="1" header="Existing Question Files" tooltip="Select from the list of existing quiz files" /> Select Existing Question File: </P></Col>
									<Col className="text-left">
										<Form.Control as="select" onChange={onSelectQuizFileChange} defaultValue={(selectedQfile)?selectedQfile.qfid:''}>
											{createDropdown()}
										</Form.Control>
									</Col>
									<Col className="text-right"><QuizTooltip tipID="2" header="Upload New Question files" tooltip="Upload New Question files" /><Button onClick={loadNewQfile}>Load New Question File</Button></Col>
									<Col className="text-left">
										<Form.Control
											type="file"
											name="image"
											placeholder="Select Question File"
											onChange={onNewQfileChange}
										/>
									</Col>
								</Row>
								<Row>
									<Col className="text-right"><P><QuizTooltip tipID="3" header="# of Questions in the quiz" tooltip="Select the number of questions in the quiz" /># of Questions (Default: 10 questions, Max 100 Questions)</P></Col>
									<Col className="text-left">
										<Form.Control as="select" onChange={setqCount}>
											{<option key={0} value={numQuestions} >{numQuestions}</option>}
											<option key="5" value="5" >5</option>
											<option key="10" value="10" >10</option>
											<option key="20" value="20" >20</option>
										</Form.Control>
									</Col>
								</Row>
								<Row>
									<Col className="text-right"><P><QuizTooltip tipID="4" header="Quiz Time Limit" tooltip="Select the Time Limit to complete the quiz. If 0 is selected there is not a time limit" />Quiz Time Limit (Default: no limit, Max: 3600 seconds)</P></Col>
									<Col className="text-left">
										<Form.Control as="select" onChange={onTimeLimitChange}>
											{<option key={-1} value={timeLimit} >{timeLimit}</option>}
											<option key="0" value="0" >0</option>
											<option key="5" value="5" >5</option>
											<option key="10" value="10" >10</option>
											<option key="20" value="20" >20</option>
											<option key="60" value="60" >60</option>
											<option key="300" value="300" >5 Minutes</option>
											<option key="600" value="600" >10 Minutes</option>
											<option key="900" value="900" >15 Minutes</option>
											<option key="1800" value="1800" >30 Minutes</option>
											<option key="3600" value="3600" >60 Minutes</option>
										</Form.Control>
									</Col>
								</Row>
								<Row>
									<Col className="text-right"><P><QuizTooltip tipID="5" header="Display Correct Answer" tooltip="If set to 'SHOW' the correct answer to a missed question will be displayed." />Display Correct Answers</P></Col>
									<Col className="text-left">
										<Form.Control as="select" onChange={saveShowAnswers}>
											{<option key={0} value={showAnswers} >{showAnswers}</option>}
											<option key="1" value="SHOW">SHOW</option>
											<option key="2" value="HIDE">HIDE</option>
										</Form.Control>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row className={sectionVisible.QUIZ}>
							<Col>
								<Quiz />
							</Col>
						</Row>						
						<Row className={sectionVisible.REPORT}>
							<Col>
								<QuizReport />
							</Col>
						</Row>
					</Card.Body>
				</StyledStrapCard>
		);
	}
}

export default compose(withFirebase, withAuthUser, connect(store => ({
		showAnswers: store.quizzer.showAnswers,
		timeLimit: store.quizzer.timeLimit,
		numQuestions: store.quizzer.numQuestions,
		selectedQfile: store.quizzer.selectedQfile,
		qstart: store.quizzer.qstart,
		Qfiles: store.quizzer.Qfiles,
		sectionVisible: store.quizzer.sectionVisible
})))(Quizzer);