import React, {useState} from "react";
import { withFirebase } from './Firebase';
import { Link, withRouter, useHistory } from 'react-router-dom';
import {useDispatch} from "react-redux";
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


const SignupForm = (props) => {

	const [username,setUsername] = useState('');
	const [email,setEmail] = useState('');
	const [password,setPassword] = useState('');
	const [confirmpassword,setConfirmPassword] = useState('');
	const [error,setError] = useState('');
	const history = useHistory();
	const dispatch = useDispatch();

	const onSubmit = (event) => {
		props.firebase
		  .doCreateUserWithEmailAndPassword(email, password)
		  .then(authUser => {
			props.firebase
			  .doUpdateUserProfile({
				displayName: username
			  })
			  .catch(error => {
				this.setState({ error });
			  });
			  
			  dispatch({
				  type:`UPDATE_USERROLE`,
				  userRole:authUser.user.role
			  });
			  setUsername('');
			  setEmail('');
			  setPassword('');
			  setConfirmPassword('');
				history.push("/Quizzer");

		  })
		  .catch(error => {
			setError( error );
		  });
		event.preventDefault();
	  }

	const isInvalid = password !== confirmpassword || password === '' || email === '' || username === '';

	return (
		<React.Fragment>
			<StyledAuthStrapCard>
				<Card.Body>
					<h1>Get started</h1>
					<StyledStrapForm>
						<Form.Group>
							<p align="center">Taking Your Quizzes!</p>
							<Form.Label>Name</Form.Label>
							<Form.Control
							type="text"
							name="username"
							onChange={(e)=>{setUsername(e.target.value)}}
							placeholder="Enter your name"
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Email</Form.Label>
							<Form.Control
							type="email"
							name="email"
							placeholder="Enter your email"
							onChange={(e)=>{setEmail(e.target.value)}}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Password</Form.Label>
							<Form.Control
							type="password"
							name="password"
							placeholder="Enter password"
							onChange={(e)=>{setPassword(e.target.value)}}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Confirm Password</Form.Label>
							<Form.Control
							type="password"
							name="confirmpassword"
							placeholder="Confirm password"
							onChange={(e)=>{setConfirmPassword(e.target.value)}}
							/>
						</Form.Group>
						<Form.Group>
								<Button color="primary" size="lg"  disabled={isInvalid} onClick={onSubmit}>
								Sign up
								</Button>
						</Form.Group>
					</StyledStrapForm>
					<Row>
						<Col><P>{error.message}, {error.stack}</P></Col>
					</Row>
				</Card.Body>
			</StyledAuthStrapCard>
		</React.Fragment>
   )
}

const SignupLink = () => (
  <p>
    Don't have an account? <Link to={"/sign-up"}>Sign Up</Link>
  </p>
);

const Signup = compose(
    withRouter,
	withFirebase)(SignupForm);

export default Signup;
export {SignupLink};