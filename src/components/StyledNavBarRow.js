import React from "react";
import {Row, Col} from "react-bootstrap";
import styled from 'styled-components'

const NavBarStrapRow = ({ className, children }) => (
	<Row className={className}>
		{children}
	</Row>
);

const NavBarStrapCol = ({ className, children }) => (
	<Col className={className}>
		{children}
	</Col>
);

const StyledNavBarRow = styled(NavBarStrapRow)`
	background-color: rgba(255, 255, 255, .25); 
	text-align: center;
	vertical-align:middle
	font-size: 5px;
	font-weight: bold;
	padding:5px;
	margin:5px;
	align-items: center;
	justify-content: center;
	width=100%;
`;

const StyledNavBarCol = styled(NavBarStrapCol)`
	background-color: rgba(255, 255, 255, .7); 
	text-align: right;
	vertical-align:top
	font-size: 5px;
	font-weight: bold;
	padding:5px;
	margin:5px;
	align-items: right;
	justify-content: right;
`;

const StyledSideBarCol = styled(NavBarStrapCol)`
	background-color: rgba(255, 255, 255, .25); 
	max-width:250px
	text-align: right;
	vertical-align:top
	font-size: 5px;
	font-weight: bold;
	padding:5px;
	align-items: right;
	justify-content: right;
`;


export default StyledNavBarRow;
export {StyledNavBarCol, StyledSideBarCol};