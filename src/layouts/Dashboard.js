import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {Card, Container, Row, Col} from "react-bootstrap";
import wvuCampus from "../assets/wvu-campus.jpg";
import wvuLogo from "../assets/wv-logo.png";
import StyledStrapCard from "../components/StyledStrapCard";
import { withAuthorization } from '../components/Session';
import AdminNavbar from "../components/AdminNavbar";

const Dashboard = ({ children }) => (
	<Container fluid>
		<Row>
			<Col >
				<StyledStrapCard img={wvuCampus}>
					<Card.Title><img src={wvuLogo} alt="West Virginia Unversity Logo" height="75px"/> West Virginia CS533 - Quizzer Application</Card.Title>
					<Card.Body>
						<Navbar />
						<AdminNavbar />
						{children}
						<Footer />
					</Card.Body>
				</StyledStrapCard >
			</Col>
		</Row>
	</Container>
);

const condition = (provider) => {
	return provider.authUser != null;
  };

export default withAuthorization(condition)(Dashboard);
