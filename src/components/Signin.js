import React, { useState, useEffect }from "react";
import {Card, Form, Button, Row, Col} from "react-bootstrap";
import { SignupLink } from './Signup';
import { PasswordForgetLink } from './ResetPassword';
import StyledAuthStrapCard from './StyledAuthStrapCard';
import StyledStrapForm from './StyledStrapForm';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';
import { withRouter, useHistory } from 'react-router-dom';
import {P} from './StyledHeaders';
import {useDispatch} from "react-redux";
import {withTranslator, LanguageChooser} from './Translator';

const initialState = {
	lead:"Sign in to your account to continue",
	emailLabel:"Email",
	emailPlaceholder:"Enter your email",
	passwordLabel:"Password",
	passwordPlaceholder:"Enter your password",
	remember:"Remember me next time",
	buttonText:"Sign in"

};

const SigninForm = (props) => {

	const [email,setEmail] = useState('');
	const [password,setPassword] = useState('');
	const [error,setError] = useState('');
	const [isLoaded,setIsLoaded] = useState(false)
	const history = useHistory();
	const dispatch = useDispatch();
	const [componentText,setComponentText] = useState(initialState);

	useEffect (()=>{
		props.translator.getCompTranslation(initialState)
			.then ((translation)=>{
				setComponentText(translation);
				setIsLoaded(true);
			});
	},[props.translator]);

	const onSubmit = async (event) => {
		try {
			let authuser = await  props.firebase.doSignInWithEmailAndPassword(email, password)
		  	if (authuser) {
				dispatch({
					type:`UPDATE_USERROLE`,
					userRole:authuser.user.role
				});
				history.push("/Quizzer");
		  	}
			event.preventDefault();
		} catch (e){
			setError( e );
		}
	}

	const isInvalid =  password === '' || email === '';
	if (!isLoaded){
		return (
			<StyledAuthStrapCard>
				<Card.Title><h1>Loading ...</h1></Card.Title>
			</StyledAuthStrapCard>		
		);
	} else {
		return (
			<React.Fragment>
				<StyledAuthStrapCard>
					<Card.Body>
						<StyledStrapForm>
							<p className="lead">{componentText.lead}</p>
							<Form.Group>
								<Form.Label>{componentText.emailLabel}</Form.Label>
								<Form.Control
									type="email"
									name="email"
									onChange={(e)=>{setEmail(e.target.value)}}
									placeholder={componentText.emailPlaceholder}
								/>
							</Form.Group>
							<Form.Group>
								<Form.Label>{componentText.passwordLabel}</Form.Label>
								<Form.Control
								type="password"
								name="password"
								onChange={(e)=>{setPassword(e.target.value)}}
								placeholder={componentText.passwordPlaceholder}
								/>
								<small>
									<PasswordForgetLink />
								</small>
							</Form.Group>
							<div>
								<Form.Check
								type="checkbox"
								id="rememberMe"
								label={componentText.remember}
								defaultChecked
								/>
							</div>
							<div>
								<LanguageChooser />
							</div>
							<div className="text-center mt-3">
								<Button color="primary" size="lg" disabled={isInvalid} onClick={onSubmit}>
								{componentText.buttonText}
								</Button>
								<br />
							</div>
							<SignupLink />
						</StyledStrapForm>
						<Row>
							<Col><P>{error.message}, {error.stack}</P></Col>
						</Row>
					</Card.Body>
				</StyledAuthStrapCard>
			</React.Fragment>
		)
	}
}


const Signin = compose(
	withTranslator,
    withRouter,
	withFirebase)(SigninForm);

export default Signin;
