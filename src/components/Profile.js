import React from "react";
import { withAuthorization } from './Session';

import {
  Col,
  Container,
  Row,
} from "react-bootstrap";

import ChangePassword from "./ChangePassword";
import ImageUpload from "./ImageUpload";
import ProfileDetails from "./ProfileDetails";
import {H1} from "./StyledHeaders";

const Profile = () => (

<Container fluid>
	<H1>Profile</H1>
	<Row>
	<Col>
		<ProfileDetails />
	</Col>
	<Col>
		<ChangePassword />
		<ImageUpload />
	</Col>
	</Row>
</Container>
);

const condition = (provider) => {
  return provider.authUser != null;
};

export default withAuthorization(condition)(Profile);
