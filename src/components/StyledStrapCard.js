import React from "react";
import styled from 'styled-components'
import {Card} from "react-bootstrap";


const StrapCard = ({ className, children }) => (
	<Card className={className}>
		{children}
	</Card>
);

const StyledStrapCard = styled(StrapCard)`
	background-image: url('${props=>props.img}'); 
	background-position: top center;
	background-size: contain;
	background-repeat: repeat;
	background-color: darken($dark, 5%);
	text-align: center;
	font-size: large;
	font-weight: bold;
`;

export default StyledStrapCard;