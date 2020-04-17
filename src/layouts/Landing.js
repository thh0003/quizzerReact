import React, {useState, useEffect} from "react";
import {Card, Container, Row, Col} from "react-bootstrap";
import wvuCampus from "../assets/wvu-campus.jpg";
import wvuLogo from "../assets/wv-logo.png";
import StyledStrapCard from "../components/StyledStrapCard";
import {withTranslator} from '../components/Translator';

const initialState = {
	title:"West Virginia CS533 - Quizzer Application",
};


const Landing = (props) => {
	const [componentText,setComponentText] = useState(initialState);
	const [isLoaded,setIsLoaded] = useState(false);

	useEffect (()=>{
		props.translator.getCompTranslation(initialState)
			.then ((translation)=>{
				setComponentText(translation);
				setIsLoaded(true);
			});
	},[props.translator]);

	if (!isLoaded){
		return (
			<Container fluid>
				<Card.Title><h1>Loading ...</h1></Card.Title>
			</Container>		
		);
	} else {

		return (
				<Container fluid>
					<Row>
						<Col xl="auto" lg="auto" md="auto" sm="auto" xs="auto">
							<StyledStrapCard img={wvuCampus}>
								<Card.Title><img src={wvuLogo} alt={componentText.title} height="75px"/>{componentText.title}</Card.Title>
								<Card.Body>
									{props.children}
								</Card.Body>
							</StyledStrapCard >
						</Col>
					</Row>
				</Container>
		);
	}
}
 
export default withTranslator(Landing);
