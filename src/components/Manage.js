import React from "react";
import { withAuthorization } from './Session';

import {
  Col,
  Container,
  Row,
} from "react-bootstrap";

import QuizTable from "./QuizTable";
import {H1} from "./StyledHeaders";
import {TranslateTag} from "./Translator";

const Manage = () => (

<Container fluid>
	<H1 className='text-center'><TranslateTag>Manage Quizzes</TranslateTag></H1>
	<Row>
		<Col>
			<QuizTable />
		</Col>
	</Row>
</Container>
);

const condition = (provider) => {
  return provider.authUser != null;
};

export default withAuthorization(condition)(Manage);
