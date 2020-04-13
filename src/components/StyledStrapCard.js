import React from "react";
import styled from 'styled-components'
import {Card} from "react-bootstrap";


const StrapCard = ({ className, children }) => (
	<Card className={className}>
		{children}
	</Card>
);

const StyledStrapCard = styled(StrapCard)`
	background-color: rgba(255, 255, 255, 0.50); 
	text-align: center;
	font-size: large;
	font-weight: bold;
`;

export default StyledStrapCard;