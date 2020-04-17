import React, {useState, useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import { Form,Row, Col, Button, Card, Nav } from "react-bootstrap";
import { H1,P } from "./StyledHeaders";
import StyledStrapCard from "./StyledStrapCard";
import {withFirebase} from "./Firebase";
import { withAuthUser } from './Session';
import { compose } from 'recompose';
import QuestionFile from "../models/QuestionFile";
import Quiz from "./Quiz";
import QuizReport from "./QuizReport";
import QuizTooltip from "./QuizTooltip";
import produce from "immer";
import sampleQuiz from "../Qfiles/sample.q.txt";
import {withTranslator} from './Translator';

const initialState = {	
	loading:" Loading ...",
	header:"Quiz Options",
	selectQuiz:" Select Existing Question File",
	selectQuizTT:"Select from the list of existing quiz files",
	uploadQuiz:"Load New Question File",
	uploadQuizTT:"Upload New Question files",
	sampleQuizLink:"Sample Quiz File",
	numQuestTT:"# of Questions in the quiz",
	numQuest:"# of Questions (Default: 10 questions, Max 100 Questions)",
	quizTimeLimit:"Quiz Time Limit (Default: no limit, Max: 3600 seconds)",
	quizTimeLimitTT:"Select the Time Limit to complete the quiz. If 0 is selected there is not a time limit",
	quizTimeLimitTTHeader:"Quiz Time Limit",
	quizAnswers:"Display Correct Answers",
	quizAnswersTT:"If set to 'SHOW' the correct answer to a missed question will be displayed.",
	quizAnswersTTHeader:"Display Correct Answer",
	show:"SHOW",
	hide:"HIDE"
};

function Quizzer(props) {

	const [selectedQfile, setselectedQFile] = useState(props.selectedQfile);
	const [numQuestions, setNumQuestions] = useState(props.numQuestions);
	const [Qfiles, setQfiles] = useState(props.Qfiles);
	const [qFileAdded, setqFileAdded] = useState(false);
	const [isLoaded,setIsLoaded] = useState(false);
	const [error, setError] = useState(null);
	const [loadError, setLoadError] = useState(null);
	const [loadQfile, setLoadQfile] = useState(false);
	const [confirmMsg, setConfirmMsg] = useState(false);
	const [newqFile, setNewqFile] = useState(null);
	const [timeLimit, setTimeLimit] = useState(props.timeLimit);
	const [qstart, /*setqstart*/] = useState(props.qstart);
	const [showAnswers, setShowAnswers] = useState(props.showAnswers);
	const sectionVisible = props.sectionVisible;
	const [componentText,setComponentText] = useState(initialState);
	const [isTransLoaded,setIsTransLoaded] = useState(false);

	const dispatch = useDispatch();

	useEffect (()=>{
		let translateList = initialState;
		translateList.showAnswers = showAnswers;
		props.translator.getCompTranslation(translateList)
			.then ((translation)=>{
				setComponentText(translation);
				setIsTransLoaded(true);
			});
	},[props.translator,showAnswers]);


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

	useEffect (()=>{

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
						setLoadQfile(false);
						setNewqFile(null);
						dispatch({
							type:'UPDATE_QFILES',
							Qfiles:nextQfilesState
						});
						dispatch({
							type:'UPDATE_QFILE',
							selectedQfile:newQuestionFile
						});
						setConfirmMsg(`Question File ${newqFile.name} has been added`);
					}
				} else {
					throw (new Error(`No Question File Specified`));
				}
			} catch (error){
				setLoadError(error);
				setConfirmMsg(false);
				setNewqFile(null);
				setLoadQfile(false);
			}
		}

		if(loadQfile){
			loadNewQfile();
		}

	},[dispatch,props.firebase,Qfiles,loadQfile,newqFile,props.authuser.uid]);

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
	const sampleLink={
		fontSize:10,
		margin:0,
		padding:0
	}
	let displayLoadError=null;
	if (loadError){
		displayLoadError = (
			<Row>
				<Col>
					<P>Error: {loadError.message}</P>
				</Col>
			</Row>

		);
	}
	let displayConfirmMsg=null;
	if (confirmMsg){
		displayConfirmMsg=(
			<Row>
				<Col>
					<P>System Message: {confirmMsg}</P>
				</Col>
			</Row>			
		);
	}
	
	if (error) {
		return (
			<StyledStrapCard>
				<Card.Title><H1>Error: {error.message}</H1></Card.Title>
			</StyledStrapCard>
			);
	} else if (!isLoaded || !isTransLoaded){
		return (
			<StyledStrapCard>
				<Card.Title><H1>{componentText.loading}</H1></Card.Title>
			</StyledStrapCard>		
		);
	} else {

		return (
				<StyledStrapCard >
					<Card.Body>
						<Row className={sectionVisible.SETTINGS}>
							<Col>
								<Row>
									<Col><H1 className="text-left">{componentText.header}</H1></Col>
								</Row>
								<Row xs={2}>
									<Col className="text-right"><P><QuizTooltip tipID="1" header={componentText.selectQuizTT} tooltip={componentText.selectQuizTT} /> {componentText.selectQuiz}:</P></Col>
									<Col className="text-left">
										<Form.Control as="select" key={(loadQfile)?'SelectQfileTrue':'SelectQfileFalse'} onChange={onSelectQuizFileChange} defaultValue={(selectedQfile)?selectedQfile.qfid:''}>
											{createDropdown()}
										</Form.Control>
									</Col>
									<Col className="text-right">
										<QuizTooltip tipID="2" header={componentText.uploadQuizTT} tooltip={componentText.uploadQuizTT} /><Button onClick={()=>{ setLoadQfile(true) }}>{componentText.uploadQuiz}</Button>
									</Col>
									<Col className="text-left">
										<Form.Control
											type="file"
											name="image"
											key={(loadQfile)?'loadQfileTrue':'loadQfileFalse'}
											placeholder="Select Question File"
											onChange={onNewQfileChange}
										/>
										<Nav.Link style={sampleLink} href={sampleQuiz}>{componentText.sampleQuizLink}</Nav.Link>
									</Col>
								</Row>
								<Row>
									<Col className="text-right"><P><QuizTooltip tipID="3" header={componentText.numQuestTT} tooltip={componentText.numQuestTT} />{componentText.numQuest}</P></Col>
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
									<Col className="text-right"><P><QuizTooltip tipID="4" header={componentText.quizTimeLimitTTHeader} tooltip={componentText.quizTimeLimitTT} />{componentText.quizTimeLimit}</P></Col>
									<Col className="text-left">
										<Form.Control as="select" key={(timeLimit>0)?'TimeLimitEngage':'TimeLimitStop'} onChange={onTimeLimitChange}>
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
									<Col className="text-right"><P><QuizTooltip tipID="5" header={componentText.quizAnswersTTHeader} tooltip={componentText.quizAnswersTT} />{componentText.quizAnswers}</P></Col>
									<Col className="text-left">
										<Form.Control as="select" onChange={saveShowAnswers}>
											{<option key={0} value={showAnswers} >{showAnswers}</option>}
											<option key="1" value="SHOW">{componentText.show}</option>
											<option key="2" value="HIDE">{componentText.hide}</option>
										</Form.Control>
									</Col>
								</Row>
								{displayConfirmMsg}
								{displayLoadError}
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

export default compose(withFirebase, withAuthUser, withTranslator, connect(store => ({
		showAnswers: store.quizzer.showAnswers,
		timeLimit: store.quizzer.timeLimit,
		numQuestions: store.quizzer.numQuestions,
		selectedQfile: store.quizzer.selectedQfile,
		qstart: store.quizzer.qstart,
		Qfiles: store.quizzer.Qfiles,
		sectionVisible: store.quizzer.sectionVisible
})))(Quizzer);