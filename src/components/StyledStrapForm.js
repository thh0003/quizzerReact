import React from "react";
import styled from 'styled-components'
import {Form} from "react-bootstrap";

const StrapForm = ({ className, children }) => (
	<Form className={className}>
		{children}
	</Form>
);

const StyledStrapForm = styled(StrapForm)`
	background-color: rgba(255, 255, 255, .7); 
	text-align: left;
	font-size: medium;
	font-weight: bold;

`;

export default StyledStrapForm;