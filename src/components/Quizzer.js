import React, {useState, useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import { Form,Row, Col, Button, Card, Nav, Spinner } from "react-bootstrap";
import { H1,P } from "./StyledHeaders";
import StyledStrapCard from "./StyledStrapCard";
import {withFirebase} from "./Firebase";
import { withAuthUser } from './Session';
import { compose } from 'recompose';
import QuestionFile from "../models/QuestionFile";
//import Quiz from "./Quiz";
import QuizReport from "./QuizReport";
import QuizTooltip from "./QuizTooltip";
import sampleQuiz from "../Qfiles/sample.q.txt";
import {withTranslator} from './Translator';
import { withRouter, useHistory } from "react-router-dom";

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
	hide:"HIDE",
	uploadHeader:"Upload New Quiz File",
	uploadQuizPlaceholder:"Quiz Name",
	startQuiz:"Start Quiz"
};

function Quizzer(props) {

	const [selectedQfile, setselectedQFile] = useState(props.selectedQfile);
	const [numQuestions, setNumQuestions] = useState(props.numQuestions);
	const [Qfiles, setQfiles] = useState(props.Qfiles);
	const [timeLimit, setTimeLimit] = useState(props.timeLimit);
	const [showAnswers, setShowAnswers] = useState(props.showAnswers);

	const [qFileAdded, setqFileAdded] = useState(false);
	const [isLoaded,setIsLoaded] = useState(false);
	const [error, setError] = useState(null);
	const [loadError, setLoadError] = useState(null);
	const [loadQfile, setLoadQfile] = useState(false);
	const [confirmMsg, setConfirmMsg] = useState(false);
	const [newqFile, setNewqFile] = useState(null);
	const sectionVisible = props.sectionVisible;
	const [componentText,setComponentText] = useState(initialState);
	const [isTransLoaded,setIsTransLoaded] = useState(false);
	const [uploadName, setUploadName] = useState('');

	const dispatch = useDispatch();
	const history = useHistory();

	const addNewQFile = async () => {
		try{
			if (newqFile){
				let newQuestionFile = await new QuestionFile(newqFile,props.authuser.uid,null,[],uploadName);
				let loaded = await newQuestionFile.indexFile();
				if (loaded){
					await props.firebase.createQFile(newQuestionFile);
					setqFileAdded(true);
					setIsLoaded(false);
					dispatch({
						type:'UPDATE_QFILE',
						selectedQfile:newQuestionFile
					});
					setNewqFile(null);
					setLoadQfile(prevQfile=>{return (prevQfile)?false:true});
					setConfirmMsg(`Question File ${newqFile.name} has been added`);
				}
			} else {
				throw (new Error(`No Question File Specified`));
			}
		} catch (error){
			console.error(`loadNewQfile: Error: ${error.message}, Stack: ${error.stack}`)
			setLoadError(error);
			setConfirmMsg(false);
			setNewqFile(null);
			setLoadQfile(prevQfile=>{return (prevQfile)?false:true});
		}
	}

	const onNewQfileChange = event => {
        if (event.target.files[0]){
			setNewqFile(event.target.files[0]);
        }
	};

	const setqCount = (e) => {
		dispatch({
			type:'UPDATE_NUMQUESTIONS',
			numQuestions:parseInt(e.target.value)
		});
	}

	const onSelectQuizFileChange = async (e) => {
		let curQFile = props.Qfiles[e.target.value];
		dispatch({
			type:'UPDATE_QFILE',
			selectedQfile:curQFile
		});
	}

	const saveShowAnswers = async (e) => {
		dispatch({
				type:'UPDATE_SHOWANSWERS',
				showAnswers:e.target.checked
			});
	}

	const onTimeLimitChange = (e) =>{
		dispatch({
			type:'UPDATE_TIMELIMIT',
			timeLimit:parseInt(e.target.value)
		});
	}

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
	};

	const startQuiz = () =>{
		dispatch ({
			type:'UPDATE_QSTART',
			qstart:true
		});

		history.push('/Quiz');
	}



	useEffect(()=>{setselectedQFile(props.selectedQfile);},[props.selectedQfile]);
	useEffect(()=>{setNumQuestions(props.numQuestions);},[props.numQuestions]);
	useEffect(()=>{

		const loadQFiles = async ()=>{
			try {
				return await props.firebase.getQFiles();
			} catch (error) {
				setError(error);
			}
		}
		
		if (Qfiles===null || qFileAdded){
			loadQFiles()
			.then((nextQfiles)=>{
				dispatch({
					type:'UPDATE_QFILES',
					Qfiles:nextQfiles
				});
					
				dispatch({
					type:'UPDATE_QFILE',
					selectedQfile:nextQfiles[Object.keys(nextQfiles)[0]]
				});
				setIsLoaded(true);
				setQfiles(nextQfiles);
				setqFileAdded(false);
			});
		} else {
			setIsLoaded(true);
		}
	},[Qfiles,qFileAdded,dispatch,props.firebase]);

	useEffect(()=>{setTimeLimit(props.timeLimit);},[props.timeLimit]);
	useEffect(()=>{setShowAnswers(props.showAnswers);},[props.showAnswers]);
	useEffect (()=>{
		let translateList = initialState;
		translateList.showAnswers = showAnswers;
		props.translator.getCompTranslation(translateList)
			.then ((translation)=>{
				setComponentText(translation);
				setIsTransLoaded(true);
			});
	},[props.translator,showAnswers]);


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
				<Card.Title><H1>Error {error.message} Occurred</H1></Card.Title>
			</StyledStrapCard>
			);
	} else if (!isLoaded || !isTransLoaded){
		return (
			<StyledStrapCard>
				<Card.Title><Spinner animation="border" /></Card.Title>
			</StyledStrapCard>		
		);
	} else {
		const isInvalid = uploadName === '';
		return (
				<StyledStrapCard >
					<Card.Body>
						<Row className={sectionVisible.SETTINGS}>
							<Col>
								<Row>
									<Col><H1 className="text-left" lang={props.translator.getLangProp()}>{componentText.header}</H1></Col>
								</Row>
								<Row xs={2}>
									<Col className="text-right"><P lang={props.translator.getLangProp()}><QuizTooltip lang={props.translator.getLangProp()} tipID="1" header={componentText.selectQuizTT} tooltip={componentText.selectQuizTT} /> {componentText.selectQuiz}:</P></Col>
									<Col className="text-left">
										<Form.Control as="select" /*key={(loadQfile)?'SelectQfileTrue':'SelectQfileFalse'} */ onChange={onSelectQuizFileChange} defaultValue={(selectedQfile)?selectedQfile.qfid:''}>
											{createDropdown()}
										</Form.Control>
									</Col>
								</Row>
								<Row>
									<Col className="text-right"><P lang={props.translator.getLangProp()}><QuizTooltip tipID="3" lang={props.translator.getLangProp()} header={componentText.numQuestTT} tooltip={componentText.numQuestTT} />{componentText.numQuest}</P></Col>
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
									<Col className="text-right"><P lang={props.translator.getLangProp()}><QuizTooltip tipID="4" lang={props.translator.getLangProp()} header={componentText.quizTimeLimitTTHeader} tooltip={componentText.quizTimeLimitTT} />{componentText.quizTimeLimit}</P></Col>
									<Col className="text-left">
										<Form.Control as="select" /*key={(timeLimit>0)?'TimeLimitEngage':'TimeLimitStop'}*/ onChange={onTimeLimitChange}>
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
									<Col className="text-right"><P lang={props.translator.getLangProp()}><QuizTooltip lang={props.translator.getLangProp()} tipID="5" header={componentText.quizAnswersTTHeader} tooltip={componentText.quizAnswersTT} />{componentText.quizAnswers}</P></Col>
									<Col className="text-left">
										<Form.Check lang={props.translator.getLangProp()}
											type="switch"
											id="showAnswers"
											label=""
											onChange={saveShowAnswers}
											checked={showAnswers}
										/>
									</Col>
								</Row>
								<Row>
									<Col>
										<Button /* style={buttonStyle}*/ size="s" onClick={startQuiz} variant="primary">{componentText.startQuiz}</Button>
									</Col>
								</Row>
								<Row>
									<Col><H1 className="text-left" lang={props.translator.getLangProp()}>{componentText.uploadHeader}</H1></Col>
								</Row>
								<Row>
									<Col className="text-right">
										<QuizTooltip tipID="2" lang={props.translator.getLangProp()} header={componentText.uploadQuizTT} tooltip={componentText.uploadQuizTT} /><Button disabled={isInvalid} onClick={()=>{ addNewQFile() /* setLoadQfile(true) */ }}>{componentText.uploadQuiz}</Button>
									</Col>
									<Col>
										<Form.Group>
											<Form.Control
											type="text"
											name="uploadName"
											onChange={(e)=>{setUploadName(e.target.value)}}
											placeholder={componentText.uploadQuizPlaceholder}
											/>
										</Form.Group>
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
								{displayConfirmMsg}
								{displayLoadError}
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

export default compose(withFirebase, withAuthUser, withTranslator, withRouter, connect(store => ({
		showAnswers: store.quizzer.showAnswers,
		timeLimit: store.quizzer.timeLimit,
		numQuestions: store.quizzer.numQuestions,
		selectedQfile: store.quizzer.selectedQfile,
		Qfiles: store.quizzer.Qfiles,
		sectionVisible: store.quizzer.sectionVisible
})))(Quizzer);