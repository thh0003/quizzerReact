import React, {useState, useEffect} from "react";
import { withFirebase } from './Firebase';
import { Link, withRouter, useHistory } from 'react-router-dom';
import { compose } from 'recompose';	
import {
  Button,
  Card,
  Form,
  Row,
  Col
} from "react-bootstrap";
import StyledAuthStrapCard from './StyledAuthStrapCard';
import StyledStrapForm from './StyledStrapForm';
import { P } from './StyledHeaders';
import {withTranslator} from './Translator';

const initialState = {
	heading:"Get started",
	heading2:"Taking Your Quizzes!",
	nameLabel:"Name",
	namePlaceholder:"Enter your name",
	emailLabel:"Email",
	emailPlaceholder:"Enter your email",
	passwordLabel:"Password",
	passwordPlaceholder:"Enter your password",
	confirmLabel:"Confirm Password",
	confirmPlaceholder:"Confirm your password",
	buttonSignup:"Sign up"

};

const SignupForm = (props) => {

	const [username,setUsername] = useState('');
	const [email,setEmail] = useState('');
	const [password,setPassword] = useState('');
	const [confirmpassword,setConfirmPassword] = useState('');
	const [error,setError] = useState('');
	const history = useHistory();
	const [componentText,setComponentText] = useState(initialState);
	const [isLoaded,setIsLoaded] = useState(false);

	useEffect (()=>{
		props.translator.getCompTranslation(initialState)
			.then ((translation)=>{
				setComponentText(translation);
				setIsLoaded(true);
			});
	},[props.translator]);

	const onSubmit = async (event) => {
		try {
			let authuser = await props.firebase.doCreateUserWithEmailAndPassword(email, password);
			if (authuser){
				await props.firebase.doUpdateUserProfile({displayName: username});
				setUsername('');
				setEmail('');
				setPassword('');
				setConfirmPassword('');
				history.push("/Quizzer");
			}
			event.preventDefault();
		} catch (error){
			setError( error );
		};
	}

	const isInvalid = password !== confirmpassword || password === '' || email === '' || username === '';
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
						<h1>{componentText.heading}</h1>
						<StyledStrapForm>
							<Form.Group>
								<p align="center">{componentText.heading2}</p>
								<Form.Label>{componentText.nameLabel}</Form.Label>
								<Form.Control
								type="text"
								name="username"
								onChange={(e)=>{setUsername(e.target.value)}}
								placeholder={componentText.namePlaceholder}
								/>
							</Form.Group>
							<Form.Group>
								<Form.Label>{componentText.emailLabel}</Form.Label>
								<Form.Control
								type="email"
								name="email"
								placeholder={componentText.emailPlaceholder}
								onChange={(e)=>{setEmail(e.target.value)}}
								/>
							</Form.Group>
							<Form.Group>
								<Form.Label>{componentText.passwordLabel}</Form.Label>
								<Form.Control
								type="password"
								name="password"
								placeholder={componentText.passwordPlaceholder}
								onChange={(e)=>{setPassword(e.target.value)}}
								/>
							</Form.Group>
							<Form.Group>
								<Form.Label>{componentText.confirmLabel}</Form.Label>
								<Form.Control
								type="password"
								name="confirmpassword"
								placeholder={componentText.confirmPlaceholder}
								onChange={(e)=>{setConfirmPassword(e.target.value)}}
								/>
							</Form.Group>
							<Form.Group>
									<Button color="primary" size="lg"  disabled={isInvalid} onClick={onSubmit}>
									{componentText.buttonSignup}
									</Button>
							</Form.Group>
						</StyledStrapForm>
						<Row>
							<Col><P>{error.message}, {error.stack}</P></Col>
						</Row>
					</Card.Body>
				</StyledAuthStrapCard>
			</React.Fragment>
		);
	}
}

const SignupLink = () => (
  <p>
    Don't have an account? <Link to={"/sign-up"}>Sign Up</Link>
  </p>
);

const Signup = compose(
    withRouter,
	withFirebase,
	withTranslator)(SignupForm);

export default Signup;
export {SignupLink};