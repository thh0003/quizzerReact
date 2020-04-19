import React, {useState, useEffect} from "react";
import { connect, useDispatch } from "react-redux";
import { withRouter, useHistory } from "react-router-dom";
import { compose } from 'recompose';

import { Image, Button, Container } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";

import { withAuthUser } from "./Session";
import StyledNavBarRow, { StyledNavBarCol } from "./StyledNavBarRow";
import {LanguageChooser, withTranslator} from "../components/Translator";
import blankPhoto from "../assets/blank.jpg";
import styles from "../assets/css/SideBar.module.css";
import { withFirebase } from "./Firebase";
const initialState = {
	adminReport:"Show Admin Report",
	exportReport:"Export Admin Report",
	profile:"Profile",
	startQuiz:"Start Quiz",
	quizHelp:"Quiz Instructions",
	quizReport:"Quiz Report",
	quizDashboard:"Dashboard",
	signOut:"Sign-Out",
	adminActions:"Administrator Actions",
	manageQuizzes:"Manage Quizzes"
};

function SidebarSub (props) {
	const history = useHistory();
	const dispatch = useDispatch();
	const authUser = props.authuser;
	const [username] = useState((typeof authUser.displayName!='undefined' && authUser.displayName!==null)?authUser.displayName:'');
	const [ photoURL, setPhotoURL] = useState((typeof authUser.photoURL!='undefined' && authUser.photoURL!==null)?authUser.photoURL:blankPhoto);
	const [ isLoaded, setIsLoaded] = useState(false);
	const { sidebar} = props;
	const [componentText,setComponentText] = useState(initialState);

	const showReport = (areport) =>{
		dispatch ({
			type:'UPDATE_REPORTS',
			qreport:(areport)?false:true,
			areport:(areport)?true:false
		});
	}
	
	const exportAdminReport = async () =>{
		let filename = 'quizLog.json';
		let jsonFile = await props.firebase.getQuizLogs(false,true,false);
		let translateList = {};
		for(let qid in jsonFile){
			for(let q in jsonFile[qid].questionLog){
				let curQuestionID = `${jsonFile[qid].qfid}_${q}`;
				if(typeof translateList[curQuestionID]==='undefined'){
					translateList[curQuestionID] = jsonFile[qid].questionLog[q].Question;
				}
			}
		}

		let translation = await props.translator.getCompTranslation(translateList);
		for(let qid in jsonFile){
			for(let q in jsonFile[qid].questionLog){
				let curQuestionID = `${jsonFile[qid].qfid}_${q}`;
				jsonFile[qid].questionLog[q].Question = translation[curQuestionID];
			}
		}
		
		var blob = new Blob([JSON.stringify(jsonFile)], { type: 'application/json;charset=utf-8;' });
		if (navigator.msSaveBlob) { // IE 10+
			navigator.msSaveBlob(blob, filename);
		} else {
			var link = document.createElement("a");
			if (link.download !== undefined) { // feature detection
				// Browsers that support HTML5 download attribute
				var url = URL.createObjectURL(blob);
				link.setAttribute("href", url);
				link.setAttribute("download", filename);
				link.style.visibility = 'hidden';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	}

	const onSignOutClick = (e) => {
		props.firebase.doSignOut();
		dispatch({
			type:'SIGNOUT'
		});
		history.push(e.target.value);
	}

	useEffect (()=>{
		props.translator.getCompTranslation(initialState)
			.then ((translation)=>{
				setComponentText(translation);
				setIsLoaded(true);
			});
	},[props.translator]);

	useEffect (()=>{
		if (props.profileUpdate){
			setPhotoURL((authUser.photoURL==null)?blankPhoto:authUser.photoURL);
			dispatch({
				type:'UPDATE_PROFILE',
				profileUpdate:false
			});
		}
		setIsLoaded(true);
		return function cleanup(){
			setIsLoaded(false);
		}
	},[authUser, props.profileUpdate,dispatch]);

	const buttonStyle ={
		width:"100%"
	}


	let AdminMenu = null;
	if (props.userrole==='ADMIN'){
		AdminMenu = (
				<StyledNavBarRow>
					<StyledNavBarCol className={styles.sidebarNav}>
						{componentText.adminActions}<br />
						<Button style={buttonStyle} size="s" onClick={()=>{showReport(true)}} variant="primary">{componentText.adminReport}</Button>
						<Button style={buttonStyle} size="s" onClick={exportAdminReport} variant="primary">{componentText.exportReport}</Button>
					</StyledNavBarCol>
				</StyledNavBarRow>
		);
	}

    return (
      <nav
        className={
			`${styles.sidebar} ` +
          (!sidebar.isOpen ? ` ${styles.toggled}` : "") +
          (sidebar.isSticky ? ` ${styles.sidebarSticky}` : "")
        }
      >
		<Container className={`${styles.sidebarContent} ${styles.sidebarBrand}`}>
			<PerfectScrollbar>
				<StyledNavBarRow >
					<StyledNavBarCol className={`media-body`}>
						{(isLoaded)
						?<Image roundedCircle src={photoURL} alt={username} width="50" height="50"/>
						:null}
						<br />
						{username}
					</StyledNavBarCol>
				</StyledNavBarRow>
				<StyledNavBarRow>
					<StyledNavBarCol className={styles.sidebarNav}>
							<Button style={buttonStyle} size="s" onClick={()=>{history.push('/profile')}} value="/profile" variant="primary">{componentText.profile}</Button><br />
							<Button style={buttonStyle} size="s" onClick={()=>{history.push('/Help')}} variant="primary">{componentText.quizHelp}</Button><br />
							<Button style={buttonStyle} size="s" onClick={()=>{history.push('/manage')}} variant="primary">{componentText.manageQuizzes}</Button><br />
							<Button style={buttonStyle} size="s" onClick={()=>{showReport(false)}} variant="primary">{componentText.quizReport}</Button><br />
							<Button style={buttonStyle} size="s" onClick={()=>{history.push('/Quizzer')}} value="/Quizzer" variant="primary">{componentText.quizDashboard}</Button><br />
							<Button style={buttonStyle} size="s" onClick={onSignOutClick} value="/" variant="primary">{componentText.signOut}</Button><br />
							<LanguageChooser />
					</StyledNavBarCol>
				</StyledNavBarRow>
				{AdminMenu}
			</PerfectScrollbar>
		</Container>
      </nav>
    );
}


const Sidebar = compose(
  withRouter,
  withAuthUser,
  withFirebase,
  withTranslator
)(SidebarSub);

export default connect(store => ({
    sidebar: store.sidebar,
	layout: store.layout,
	profileUpdate:store.quizzer.profileUpdate
  }))(Sidebar);