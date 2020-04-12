import React, { useState }from "react";
import { Link } from "react-router-dom";

import {  Button,  Card,  Form } from "react-bootstrap";
import StyledAuthStrapCard from './StyledAuthStrapCard';
import StyledStrapForm from './StyledStrapForm';
import {H1,H3,P} from './StyledHeaders';
import {withFirebase} from './Firebase';


const ResetPassword = (props) => {

	const [email,setEmail] = useState('');
	const [error,setError] = useState('');

	const isInvalid = email === '';
	const onSubmit = async (e) => {
		try {
			await props.firebase.doPasswordReset(email);
		} catch(e){
			setError(e);
			console.error(`ResetPassword Error: ${e.message}, ${e.stack}`);
		}

	};
    return (
      <React.Fragment>
        <StyledAuthStrapCard>
			<Card.Body>
				<StyledStrapForm>
					<H1 className="h2">Reset password</H1>
					<P className="lead">Enter your email to reset your password.</P>
					<Form.Group>
						<Form.Label>Email</Form.Label>
						<Form.Control
						type="email"
						name="email"
						onChange={(e)=>{setEmail(e.target.value)}}
						placeholder="Enter your email"
						/>
					</Form.Group>
					<Button color="primary" disabled={isInvalid} onClick={onSubmit} size="lg">
						Reset password
					</Button>
					<br />
					<H3 id="ERROR" className="warning">{error && <p>{error.message}</p>}</H3>
				</StyledStrapForm>
			</Card.Body>
        </StyledAuthStrapCard>
      </React.Fragment>
    );
}

const PasswordForgetLink = () => (
  <p>
    <Link to="/reset-password">Forgot Password?</Link>
  </p>
);

export default withFirebase(ResetPassword);

export {PasswordForgetLink};
