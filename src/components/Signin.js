import React, { useState }from "react";
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

const SigninForm = (props) => {

	const [email,setEmail] = useState('');
	const [password,setPassword] = useState('');
	const [error,setError] = useState('');
	const history = useHistory();
	const dispatch = useDispatch();

	const onSubmit = (event) => {
		props.firebase
		  .doSignInWithEmailAndPassword(email, password)
		  .then((authUser) => {
			dispatch({
				type:`UPDATE_USERROLE`,
				userRole:authUser.user.role
			});
			history.push("/Quizzer");
		  })
		  .catch(error => {
			setError({ error });
		  });
		event.preventDefault();
	}

	const isInvalid =  password === '' || email === '';

	return (
		<React.Fragment>
			<StyledAuthStrapCard>
				<Card.Body>
					<h2>Welcome back!</h2>
					<StyledStrapForm>
						<p className="lead">Sign in to your account to continue</p>
						<Form.Group>
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="email"
								name="email"
								onChange={(e)=>{setEmail(e.target.value)}}
								placeholder="Enter your email"
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Password</Form.Label>
							<Form.Control
							type="password"
							name="password"
							onChange={(e)=>{setPassword(e.target.value)}}
							placeholder="Enter your password"
							/>
							<small>
								<PasswordForgetLink />
							</small>
						</Form.Group>
						<div>
							<Form.Check
							type="checkbox"
							id="rememberMe"
							label="Remember me next time"
							defaultChecked
							/>
						</div>
						<div className="text-center mt-3">
							<Button color="primary" size="lg" disabled={isInvalid} onClick={onSubmit}>
							Sign in
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


const Signin = compose(
    withRouter,
	withFirebase)(SigninForm);

export default Signin;
