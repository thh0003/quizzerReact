import React, {useState} from "react";
import { withFirebase } from './Firebase';

import {
  Button,
  Form,
  Row,
  Col
} from "react-bootstrap";
import {H1, H3, P} from "./StyledHeaders";
import StyledStrapForm from "./StyledStrapForm";

const ChangePasswordForm = (props) =>{

	const [password, setPassword] = useState('');
	const [confirmpassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const confirmmsg = 	'Password Updated Succesfully';
	const [confirm, setConfirm] = useState(false);

	const onSubmit = event => {
		const { password } = this.state;
		props.firebase
			.doPasswordUpdate(password)
			.then(() => {
				setConfirm(true);
				setPassword('');
				setConfirmPassword('');
			})
			.catch(error => {
			setError(error);
			});
		event.preventDefault();
	};

	const isInvalid = password !== confirmpassword || password === '';    

    return (
		<StyledStrapForm>
			<Row>
				<Col className="text-center">
					<H1>Change Password</H1>
					<P>Enter your email to reset your password.</P>
				</Col>
			</Row>
			<Row>
				<Col className="text-center">
					<Form.Group>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							name="password"
							placeholder="Enter password"
							onChange={(e)=>{setPassword(e.target.value)}}
						/>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				<Col className="text-center">
					<Form.Group>
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							type="password"
							name="confirmpassword"
							placeholder="Confirm password"
							onChange={(e)=>{setConfirmPassword(e.target.value)}}
						/>
					</Form.Group>		
				</Col>
			</Row>
			<Row>
				<Col className="text-center">
					<Button color="primary" disabled={isInvalid} onClick={onSubmit} size="lg">Change Password</Button>
				</Col>
			</Row>
			<Row>
				<Col className="text-center">
					<H3 id="ERROR" className="danger">{error && <p>{error.message}</p>}</H3>
					<H3 id="CONFIRM" className="info">{confirm && <p>{confirmmsg}</p>}</H3>
				</Col>
			</Row>
		</StyledStrapForm>
    );
  
}

const ChangePassword = withFirebase(ChangePasswordForm);

export default ChangePassword;