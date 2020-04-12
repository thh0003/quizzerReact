import React from "react";
import styled from 'styled-components'
import {Card} from "react-bootstrap";

const StrapCard = ({ className, children }) => (
	<Card className={className}>
		{children}
	</Card>
);

const StyledAuthStrapCard = styled(StrapCard)`
	display: flex;	
	border: 5px solid #000099;
	align-items: center;
	justify-content: center;
	padding: 35px;
`;

export default StyledAuthStrapCard;