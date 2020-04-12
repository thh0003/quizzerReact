import React from "react";
import { Row, Col } from "react-bootstrap";
import {P} from "./StyledHeaders";

const Footer = () => (
		<Row>
			<Col className="text-center">
				<P>&copy; {new Date().getFullYear()} -{" "}Quizzer</P>
			</Col>
		</Row>
);

export default Footer;
