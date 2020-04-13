import React, {useState, useEffect} from "react";
import { connect, useDispatch } from "react-redux";
import { withRouter, useHistory } from "react-router-dom";
import { compose } from 'recompose';

import { Image, Button, Container } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";

import { withAuthUser } from "./Session";
import StyledNavBarRow, { StyledNavBarCol } from "./StyledNavBarRow";
import blankPhoto from "../assets/blank.jpg";
import styles from "../assets/css/SideBar.module.css";
import { withFirebase } from "./Firebase";

function SidebarSub (props) {
	const history = useHistory();
	const dispatch = useDispatch();
	const authUser = props.authuser;
	const [username] = useState((typeof authUser.displayName!='undefined' && authUser.displayName!==null)?authUser.displayName:'');
	const [ photoURL, setPhotoURL] = useState((typeof authUser.photoURL!='undefined' && authUser.photoURL!==null)?authUser.photoURL:blankPhoto);
	const [ isLoaded, setIsLoaded] = useState(false);
	const { sidebar} = props;

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

	const startQuiz = () =>{
		dispatch ({
			type:'UPDATE_QSTART',
			qstart:true
		});
	}

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

	let AdminMenu = null;
	if (props.userrole==='ADMIN'){
		AdminMenu = (
				<StyledNavBarRow>
					<StyledNavBarCol className={styles.sidebarNav}>
						Administrator Actions<br />
						<Button size="xs" onClick={()=>{showReport(true)}} variant="primary">Show Admin Report</Button>
						<Button size="xs" onClick={exportAdminReport} variant="primary">Export Admin Report</Button>
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
							<Button size="xs" onClick={()=>{history.push('/profile')}} value="/profile" variant="primary">Profile</Button><br />
							<Button size="xs" onClick={startQuiz} variant="primary">Start Quiz</Button><br />
							<Button size="xs" onClick={()=>{showReport(false)}} variant="primary">Quiz Report</Button><br />
							<Button size="xs" onClick={()=>{history.push('/Quizzer')}} value="/Quizzer" variant="primary">Dashboard</Button><br />
							<Button size="xs" onClick={onSignOutClick} value="/" variant="primary">Sign-Out</Button><br />
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
  withFirebase
)(SidebarSub);

export default connect(store => ({
    sidebar: store.sidebar,
	layout: store.layout,
	profileUpdate:store.quizzer.profileUpdate
  }))(Sidebar);