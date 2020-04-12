/**
 * <p>Title: QuestionIndex</p>
 * <p>Description: A class that acts as an index of the offsets in the quiz file
 * for the question, answer choices, and correct answer. The first index in the vector of
answers
 * is the offset for the correct answer.</p>
 * @author Trevor Holmes
 * @version 1.0
 */

class Question
{
    /**
     * Constructor
     * @param qStart the beginning offset of the quiz question
     * @param qEnd the ending offset of the quiz question
     */
    constructor( question, correctAnswer=-1, answers=[] )
    {
		this.question = question;
		this.correctAnswer=correctAnswer;
		this.answers = answers;
    }

    /**
     * @return the beginning offset of the quiz question
     */
    getQuestion()
    {
        return this.question;
	}
	
	/**
     * @return the beginning offset of the quiz question
     */
    setQuestion(question)
    {
        this.question = question;
    }

    /**
     * @return A Vector containing the offsets for the answer choices to the quiz question. The first
     * element is the correct answer.
     */
    getAnswers()
    {
        return this.answers;
    }

    /**
     * Adds the offset to an answer choice to the quiz question.
     * @param answerOffset an offset to an answer choice to the quiz question
     */
    addAnswer( answer )
    {
        this.answers.push( answer );
	}
	
	 /**
     * Adds the offset to an answer choice to the quiz question.
     * @param answerOffset an offset to an answer choice to the quiz question
     */
    setCorrect( correct )
    {
        this.correctAnswer = correct;
	}
	

		 /**
     * Adds the offset to an answer choice to the quiz question.
     * @param answerOffset an offset to an answer choice to the quiz question
     */
    getCorrect( )
    {
        return this.correctAnswer;
    }
}


const questionConverter = {
	questionsToFirestore: (questions) => {
		let fbquestions = {};
		for (var q in questions){
			fbquestions[q] = {};
			fbquestions[q].QuestionNumber = questions[q].QuestionNumber;
			fbquestions[q].QuizFileQuestionNum = questions[q].QuizFileQuestionNum;
			fbquestions[q].correct = questions[q].correct;
			fbquestions[q].SubmitedAnswer = questions[q].SubmitedAnswer;
		}
		return fbquestions;
	},
	//question, correctAnswer=-1, answers=[]
	questionsFromFirestore: (questions) => {
		let qFileQuestions = {};
		for (var q in questions){
			qFileQuestions[q] = {};
			qFileQuestions[q].QuestionNumber = questions[q].QuestionNumber;
			qFileQuestions[q].QuizFileQuestionNum = questions[q].QuizFileQuestionNum;
			qFileQuestions[q].correct = questions[q].correct;
			qFileQuestions[q].SubmitedAnswer = questions[q].SubmitedAnswer;			
		}
		return qFileQuestions;
	}
}

export default Question;
export {questionConverter};
