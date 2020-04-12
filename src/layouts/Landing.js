import React from "react";
import {Card, Container, Row, Col} from "react-bootstrap";
import wvuCampus from "../assets/wvu-campus.jpg";
import wvuLogo from "../assets/wv-logo.png";
import StyledStrapCard from "../components/StyledStrapCard";

const Landing = ({ children }) => {
	return (
			<Container fluid>
				<Row>
					<Col xl="auto" lg="auto" md="auto" sm="auto" xs="auto">
						<StyledStrapCard img={wvuCampus}>
							<Card.Title><img src={wvuLogo} alt="West Virginia Unversity Logo" height="75px"/> West Virginia CS533 - Quizzer Application</Card.Title>
							<Card.Body>
								{children}
							</Card.Body>
						</StyledStrapCard >
					</Col>
				</Row>
			</Container>
	);}
 
export default Landing;
