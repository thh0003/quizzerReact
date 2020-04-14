# Quizzer
# Web and Progressive Web App (PWA) Quiz Application

### West Virginia Univeristy - CS - Software Portablility - Programming Assignment #4

##### Quizzer - Description

Quizzer is a Web Application and PWA which will take a file with questions and run a quiz based on those questions.

The url for the Web Application: https://quizzer.pgesoftware.com/

Progressive Web Application: If you access the url for the application on a mobile device, your device will prompt you to add the application to your home screen.
Please allow it to do so.  Once the app is on your home screne select it and it will start.  Or you can use it in the browser.  The PWA will work online or offline.

Sign-Up Process:
1) Select the "Sign Up" on the main screen
2) Enter in your Name, Email Address, Password, and Confirm your password.  Then select the Signup button
3) You will then be redirected to the Quizzer Dashboard

Sign-In Process:
1) Enter in your email and Password
2) Select the "Sign In" button
3) You will then be redirected to the Quizzer Dashboard

To Start a Quiz:
1) Select an Existing Question File (Some sample files have been provided)
2) Select how many questions you would to have in the quiz
3) Select if you want a time limit for the quiz
4) Select if you want the correct answer for missed questions to be displayed
5) Select Start Quiz from the Navigation Bar on the left.  (Note: if the navigation bar is not visible select the "Menu" toggle in the upper left corner)

To Upload your own Quiz:
1) A sample quiz file is available at https://quizzer.pgesoftware.com/static/media/sample.q.33b4f6e7.txt.  Please follow the sample format when uploading your quiz files
2) Select the "Choose File" button and select your quiz file
3) Select "Load New Question File" button and your file will begin to upload
4) You will see "Question File <<filename>> has been added"
5) You can then select the new quiz file from the "Select Existing Question" File dropdown.

Taking a Quiz:
1) Once the quiz Starts There is a Quiz Progress section at the top of the quiz, and the Current Question is below.
2) Select your answer
3) Select "Submit Answer"
4) The progress will be updated and if you selected to "SHOW" the correct answer to incorrect questions it will appear.
5) The Next question will appear.
6) If you wish to stop the Quiz selct StopQuiz
7) Once you complete the Quiz a Quiz Summary will appear.
8) If you want to save your quiz results select "Save Quiz Results"

Viewing Your Quiz History:
1) Select "Quiz Report" from the Navigation Bar on the left. (Note: if the navigation bar is not visible select the "Menu" toggle in the upper left corner)
2) To review the results for each question of the quiz select the + sign to expand the Selected Quiz.
3) To close the Quiz Report select the "Close Report" button.

Administrator Section: Currently there are 2 additional functions for Administrators
1) Show all of the users quiz history
   A) Select "Show Admin Report" from the Navigation Bar (Note: if the navigation bar is not visible select the "Menu" toggle in the upper left corner)
   B) To review the results for each question of the quiz select the + sign to expand the Selected Quiz.
   C) To close the Quiz Report select the "Close Report" button.
2) Export the quiz history to a JSON file
   A) Select "Export Admin Report" from the Navigation Bar (Note: if the navigation bar is not visible select the "Menu" toggle in the upper left corner)
   B) A JSON representation of the quizes will be generated
   C) Depending on your settings it will download automatically with the file name "quizLog.json" or prompt you to choose a location and name to save it.

#### Sample Quiz File Format
* SAMPLE QUIZ QUESTIONS
* Jim Mooney
* CS 533
* Fall 2011

* This is a question file for the quiz program.
* Any line that begins with an asterisk should be ignored.
* Totally blank lines should also be ignored.

* The file consists of a sequence of questions.
* Each question has the following form:
*
*	1. A line beginning with "@Q".
*	2. Up to ten lines giving the text of the question.
*	3. A line beginning with "@A"
*	4. A line consisting of the integer value for the correct answer
*	5. Up to ten lines giving answer choices, one line each.
*	6. A line beginning with "@E".
*
* The question file has the form of a sequence of variable-length
* text lines, Each containing 75 characters or fewer.  The character
* code and the detailed form of the file (line terminators, etc.) are
* those conventional for the system on which it is installed.
*
* The following example file contains two questions.  The first has
* four possible answers; the correct answer is the second.  The second
* has six possible answers; the correct answer is the fourth.

@QUESTIONS
How many class days are there in this entire term?
@ANSWERS
2
forty-one
twenty-nine
seems like hundreds
who's counting?
@END

@QUESTION

This is a long question which rambles on with no apparent end in sight.
It has two purposes.  The first is to catch those of you who have not
provided enough buffer space for a very long question.  The second is to
ask you to figure out how many letters there are (not counting spaces or
punctuation marks) in this entire paragraph.

@ANSWERS
4
509
266
1066
263
None of the above
All of the above
@END
* Remember: blank lines and comments are ignored throughout!

* END OF FILE