import React from "react";
import {
  Col,
  Container,
  Row,
} from "react-bootstrap";

import {H1, H3, P} from "./StyledHeaders";

const HelpFile = () => {

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
					<H1 style={headerAlign}>Quizzer - Web and Progressive Web App (PWA) Quiz Application</H1>
					<H3 style={headerAlign}>Operation Manual</H3>
					<P style={listAlign}>Quizzer - Quizzer is a Web Application and PWA which will take a file with questions and run a quiz based on those questions.</P>
					<ul style={listAlign}>
						<li>The url for the Web Application: <a href="https://quizzer.pgesoftware.com/">quizzer.pgesoftware.com</a><br /></li>
						<li>Progressive Web Application: If you access the url for the application on a mobile device, your device will prompt you to add the application to your home screen.  Please allow it to do so.  Once the app is on your home screne select it and it will start.  Or you can use it in the browser.  The PWA will work online or offline.</li>		
					</ul>
					<P style={listAlign}>Sign-Up Process:</P>
					<ol style={listAlign}>
						<li>Select the "Sign Up" on the main screen</li>
						<li>Enter in your Name, Email Address, Password, and Confirm your password.  Then select the Signup button</li>
						<li>You will then be redirected to the Quizzer Dashboard</li>
					</ol>
					<P style={listAlign}>Sign-In Process:</P>
					<ol style={listAlign}>
						<li>Enter in your email and Password</li>
						<li>Select the "Sign In" button</li>
						<li>You will then be redirected to the Quizzer Dashboard</li>
					</ol>
					<P style={listAlign}>To Start a Quiz:</P>
					<ol style={listAlign}>
						<li>Select an Existing Question File (Some sample files have been provided)</li>
						<li>Select how many questions you would to have in the quiz</li>
						<li>Select if you want a time limit for the quiz</li>
						<li>Select if you want the correct answer for missed questions to be displayed</li>
						<li>Select Start Quiz from the Navigation Bar on the left.  (Note: if the navigation bar is not visible select the "Menu" toggle in the upper left corner)</li>
					</ol>
					<P style={listAlign}>To Upload your own Quiz:</P>
					<ol style={listAlign}>
						<li>A sample quiz file is available at <a href="https://quizzer.pgesoftware.com/static/media/sample.q.33b4f6e7.txt">Sample Quiz File</a>.  Please follow the sample format when uploading your quiz files</li>
						<li>Select the "Choose File" button and select your quiz file</li>
						<li>Select "Load New Question File" button and your file will begin to upload</li>
						<li>You will see "Question File 'filename' has been added"</li>
						<li>You can then select the new quiz file from the "Select Existing Question" File dropdown.</li>
					</ol>
					<P style={listAlign}>Taking a Quiz:</P>
					<ol style={listAlign}>
						<li>Once the quiz Starts There is a Quiz Progress section at the top of the quiz, and the Current Question is below.</li>
						<li>Select your answer</li>
						<li>Select "Submit Answer"</li>
						<li>The progress will be updated and if you selected to "SHOW" the correct answer to incorrect questions it will appear.</li>
						<li>The Next question will appear.</li>
						<li>If you wish to stop the Quiz selct StopQuiz</li>
						<li>Once you complete the Quiz a Quiz Summary will appear.</li>
						<li>If you want to save your quiz results select "Save Quiz Results"</li>
					</ol>
					<P style={listAlign}>Viewing Your Quiz History:</P>
					<ol style={listAlign}>
						<li>Select "Quiz Report" from the Navigation Bar on the left. (Note: if the navigation bar is not visible select the "Menu" toggle in the upper left corner)</li>
						<li>To review the results for each question of the quiz select the + sign to expand the Selected Quiz.</li>
						<li>To close the Quiz Report select the "Close Report" button.</li>
					</ol>
				</Col>
			</Row>
		</Container>
	);
}
export default HelpFile;
