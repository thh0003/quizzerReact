import React from "react";
import {
  Col,
  Container,
  Row,
} from "react-bootstrap";
import {H1, H3, P} from "./StyledHeaders";
import {withTranslator} from './Translator';
import {TranslateTag} from "./Translator";

const HelpFile = (props) => {
	const headerAlign={
		textAlign:"center",
	};

	const listAlign={
		textAlign:"left",
	};

	return (
		<Container fluid>
			<Row>
				<Col>
					<H1 style={headerAlign}><TranslateTag>Quizzer - Web and Progressive Web App (PWA) Quiz Application</TranslateTag></H1>
					<H3 style={headerAlign}><TranslateTag>Operation Manual</TranslateTag></H3>
					<P style={listAlign}><TranslateTag>Quizzer - Quizzer is a Web Application and PWA which will take a file with questions and run a quiz based on those questions.</TranslateTag></P>
					<ul style={listAlign}>
						<li><TranslateTag>The url for the Web Application: </TranslateTag><a href="https://quizzer.pgesoftware.com/">quizzer.pgesoftware.com</a><br /></li>
						<li><TranslateTag>Progressive Web Application: If you access the url for the application on a mobile device, your device will prompt you to add the application to your home screen.  Please allow it to do so.  Once the app is on your home screne select it and it will start.  Or you can use it in the browser.  The PWA will work online or offline.</TranslateTag></li>		
					</ul>
					<P style={listAlign}><TranslateTag>Sign-Up Process:</TranslateTag></P>
					<ol style={listAlign}>
						<li><TranslateTag>Select the "Sign Up" on the main screen</TranslateTag></li>
						<li><TranslateTag>Enter in your Name, Email Address, Password, and Confirm your password.  Then select the Signup button</TranslateTag></li>
						<li><TranslateTag>You will then be redirected to the Quizzer Dashboard</TranslateTag></li>
					</ol>
					<P style={listAlign}><TranslateTag>Sign-In Process:</TranslateTag></P>
					<ol style={listAlign}>
						<li><TranslateTag>Enter in your email and Password</TranslateTag></li>
						<li><TranslateTag>Select the "Sign In" button</TranslateTag></li>
						<li><TranslateTag>You will then be redirected to the Quizzer Dashboard</TranslateTag></li>
					</ol>
					<P style={listAlign}><TranslateTag>To Start a Quiz:</TranslateTag></P>
					<ol style={listAlign}>
						<li><TranslateTag>Select an Existing Question File (Some sample files have been provided)</TranslateTag></li>
						<li><TranslateTag>Select how many questions you would to have in the quiz</TranslateTag></li>
						<li><TranslateTag>Select if you want a time limit for the quiz</TranslateTag></li>
						<li><TranslateTag>Select if you want the correct answer for missed questions to be displayed</TranslateTag></li>
						<li><TranslateTag>Select Start Quiz from the Navigation Bar on the left.  (Note: if the navigation bar is not visible select the "Menu" toggle in the upper left corner)</TranslateTag></li>
					</ol>
					<P style={listAlign}><TranslateTag>To Upload your own Quiz:</TranslateTag></P>
					<ol style={listAlign}>
						<li><TranslateTag>A sample quiz file is available at </TranslateTag><a href="https://quizzer.pgesoftware.com/static/media/sample.q.33b4f6e7.txt">Sample Quiz File</a>.<TranslateTag>  Please follow the sample format when uploading your quiz files</TranslateTag></li>
						<li><TranslateTag>Select the "Choose File" button and select your quiz file</TranslateTag></li>
						<li><TranslateTag>Select "Load New Question File" button and your file will begin to upload</TranslateTag></li>
						<li><TranslateTag>You will see "Question File 'filename' has been added"</TranslateTag></li>
						<li><TranslateTag>You can then select the new quiz file from the "Select Existing Question" File dropdown.</TranslateTag></li>
					</ol>
					<P style={listAlign}><TranslateTag>Taking a Quiz:</TranslateTag></P>
					<ol style={listAlign}>
						<li><TranslateTag>Once the quiz Starts There is a Quiz Progress section at the top of the quiz, and the Current Question is below.</TranslateTag></li>
						<li><TranslateTag>Select your answer</TranslateTag></li>
						<li><TranslateTag>Select "Submit Answer"</TranslateTag></li>
						<li><TranslateTag>The progress will be updated and if you selected to "SHOW" the correct answer to incorrect questions it will appear.</TranslateTag></li>
						<li><TranslateTag>The Next question will appear.</TranslateTag></li>
						<li><TranslateTag>If you wish to stop the Quiz selct StopQuiz</TranslateTag></li>
						<li><TranslateTag>Once you complete the Quiz a Quiz Summary will appear.</TranslateTag></li>
						<li><TranslateTag>If you want to save your quiz results select "Save Quiz Results"</TranslateTag></li>
					</ol>
					<P style={listAlign}><TranslateTag>Viewing Your Quiz History:</TranslateTag></P>
					<ol style={listAlign}>
						<li><TranslateTag>Select "Quiz Report" from the Navigation Bar on the left. (Note: if the navigation bar is not visible select the "Menu" toggle in the upper left corner)</TranslateTag></li>
						<li><TranslateTag>To review the results for each question of the quiz select the + sign to expand the Selected Quiz.</TranslateTag></li>
						<li><TranslateTag>To close the Quiz Report select the "Close Report" button.</TranslateTag></li>
					</ol>
				</Col>
			</Row>
		</Container>
	);
}
export default withTranslator(HelpFile);
