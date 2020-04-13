import React, {useEffect, useState}from "react";
import { NavLink, withRouter, useHistory } from "react-router-dom";
import { withAuthUser } from './Session';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';

import {
  Card
} from "react-bootstrap";

import psDebug from "./debugService";
import blankPhoto from "../assets/blank.jpg";
import {connect, useDispatch} from "react-redux";

const ProfileDetailsInfo = (props) =>{

    const onSignOutClick = (event) => {
		props.firebase.doSignOut();
		history.push("/");
    };
  
	const history = useHistory();
	const dispatch = useDispatch();
	
	const [cuser] = useState(props.authuser);
	const [profileImg, setProfileImg] = useState((cuser.photoURL==null)?blankPhoto:cuser.photoURL);
	const [isLoaded, setIsLoaded] = useState(false);
	psDebug.consoleLogger(`ProfileDetails->render: `);
	psDebug.consoleLogger(props);

	useEffect (()=>{
		if (props.profileUpdate){
			setProfileImg((cuser.photoURL==null)?blankPhoto:cuser.photoURL);
			dispatch({
				type:'UPDATE_PROFILE',
				profileUpdate:false
			});
		}
		setIsLoaded(true);
		return function cleanup(){
			setIsLoaded(false);
		}
	},[cuser, props.profileUpdate,dispatch]);

	if (!isLoaded){
		return (
			<Card>
            <Card.Body className="text-center">LOADING....
            </Card.Body>
        </Card>
		);		
	} else {
		return (
			<Card>
				<Card.Header>
				<Card.Title tag="h5" className="text-center mb-0">
					Profile Details
				</Card.Title>
				</Card.Header>
				<Card.Body className="text-center">
				<img
					src={profileImg}
					alt={cuser.displayName}
					className="img-fluid rounded-circle mb-2"
					width="128"
					height="128"
				/>
				<Card.Title tag="h5" className="mb-0">
					{cuser.displayName}
				</Card.Title>
				<NavLink to="/Quizzer" className="sidebar-link" activeClassName="active"> Dashboard </NavLink>
				<NavLink to="/" onClick={onSignOutClick} className="sidebar-link" activeClassName="active"> Sign Out </NavLink>
				</Card.Body>
				<hr className="my-0" />
			</Card>
		);
	}
}

export default compose(withAuthUser,
	withFirebase,
	withRouter,
	connect(store=>({
		profileUpdate:store.quizzer.profileUpdate
	}))
	)(ProfileDetailsInfo);