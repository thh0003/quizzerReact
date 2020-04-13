import React from "react";
import Footer from "../components/Footer";
import {Row, Col} from "react-bootstrap";
import wvuCampus from "../assets/wvu-campus.jpg";
import wvuLogo from "../assets/wv-logo.png";
import { withAuthorization } from '../components/Session';
import Sidebar from "../components/Sidebar";
import Wrapper from "../components/Wrapper";
import Content from "../components/Content";
import {useDispatch} from "react-redux";
import hamStyles from "../assets/css/Hamburger.module.css";
import StyledNavBarRow, { StyledNavBarCol } from "../components/StyledNavBarRow";
import { H3nb } from "../components/StyledHeaders";

const DashboardToggle = ({ children }) => {

	const dispatch = useDispatch();
	const toggleSidebar = () => {
		return {
		  type: 'SIDEBAR_VISIBILITY_TOGGLE'
		};
	}

	return  (
		<Wrapper img={wvuCampus}>
			<Sidebar />
			<Content>
				<Row xs={1}>
					<Col className="text-center">
						<span className={`${hamStyles.sidebarToggle} d-flex mr-2`} onClick={() => {dispatch(toggleSidebar());}}>
							<i className={`${hamStyles.hamburger} align-self-center`} /><span className={hamStyles.menu}>Menu</span>
						</span>
						<br />									
						<H3nb><img src={wvuLogo} alt="West Virginia Unversity Logo" height="75px"/>CS533 - Quizzer</H3nb>
					</Col>
				</Row>
				<StyledNavBarRow xs={1}>
					<StyledNavBarCol>
						{children}
					</StyledNavBarCol>
				</StyledNavBarRow>
				<StyledNavBarRow xs={1}>
					<StyledNavBarCol>
						<Footer />
					</StyledNavBarCol>
				</StyledNavBarRow>
			</Content>
		</Wrapper>
	);
}

const condition = (provider) => {
	return provider.authUser != null;
  };

export default withAuthorization(condition)(DashboardToggle);
