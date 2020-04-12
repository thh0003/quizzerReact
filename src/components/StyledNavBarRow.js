import React from "react";
import {Row} from "react-bootstrap";
import styled from 'styled-components'

const NavBarStrapRow = ({ className, children }) => (
	<Row className={className}>
		{children}
	</Row>
);

const StyledNavBarRow = styled(NavBarStrapRow)`
	background-color: rgba(255, 255, 255, .7); 
	text-align: center;
	vertical-align:middle
	font-size: 5px;
	font-weight: bold;
	padding:5px;
	align-items: center;
	justify-content: center;
`;
export default StyledNavBarRow;