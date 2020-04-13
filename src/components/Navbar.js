import React, {useEffect, useState} from "react";
import { Col, Button, Image} from "react-bootstrap";
import {withRouter, useHistory} from "react-router-dom";
import {withFirebase} from "./Firebase";
import {withAuthUser} from "./Session";
import { compose } from "recompose";
import blankPhoto from "../assets/blank.jpg";
import { connect, useDispatch } from "react-redux";
import StyledNavBarRow from "./StyledNavBarRow";



function NavbarForm(props) {
	const history = useHistory();
	const dispatch = useDispatch();
	const authUser = props.authuser;
	const [username] = useState((typeof authUser.displayName!='undefined' && authUser.displayName!==null)?authUser.displayName:'');
	const [ photoURL, setPhotoURL] = useState((typeof authUser.photoURL!='undefined' && authUser.photoURL!==null)?authUser.photoURL:blankPhoto);
	const [ isLoaded, setIsLoaded] = useState(false);

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

	const showReport = (areport) =>{
		dispatch ({
			type:'UPDATE_REPORTS',
			qreport:(areport)?false:true,
			areport:(areport)?true:false
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

	return (
		<StyledNavBarRow>
			<Col>
				{(isLoaded)
				?<Image roundedCircle src={photoURL} alt={username} width="50" height="50"/>
				:null}
				{username}
			</Col >
			<Col>
				<Button size="xs" onClick={startQuiz} variant="primary">Start Quiz</Button>
				<Button size="xs" onClick={()=>{showReport(false)}} variant="primary">Quiz Report</Button>
			</Col>
			<Col>
				<Button size="xs" onClick={()=>{history.push('/Quizzer')}} value="/Quizzer" variant="primary">Dashboard</Button>
				<Button size="xs" onClick={()=>{history.push('/profile')}} value="/profile" variant="primary">Profile</Button>
				<Button size="xs" onClick={onSignOutClick} value="/" variant="primary">Sign-Out</Button>
			</Col>
		</StyledNavBarRow>
	);
}
const Navbar = compose(
    withRouter,
	withFirebase,
	withAuthUser,
	)(NavbarForm);

  export default connect(store=>({
	profileUpdate:store.quizzer.profileUpdate
}))(Navbar);