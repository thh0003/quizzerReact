/**
 * <p>Title: QuestionFileIndexer</p>
 * <p>Description: Class to index a quiz file. Creates a vector in
QuestionIndex containing
 * the offsets to where in the quiz file questions and answer choices are
located.</p>
 * @author Corey Wineman, mods by Jim Mooney
 * @version 1.0
 */
import Question from "./Question";

class QuestionFile
{
    /**
     * Constructor
     * 
     * @param qFilename The name of the quiz file containing quiz questions and
     *                  answers
     */
    constructor(qFile=null, uid=null, qfid=null, questions=[], qFileName='') {
		this.uid=uid;
		this.qfid=qfid;
		this.qFileName = qFileName;
		this.qFile = qFile;
		this.questions = questions;
		this.rawQuestions=[];
    }

	readUploadedFileAsText = inputFile => {
		const temporaryFileReader = new FileReader();
	
		return new Promise((resolve, reject) => {
			temporaryFileReader.onerror = () => {
				temporaryFileReader.abort();
				reject(new DOMException("Problem parsing input file."));
			};

			temporaryFileReader.onload = () => {
				resolve(temporaryFileReader.result);
			};
			temporaryFileReader.readAsText(inputFile);
		});
	};
	
    /**
     * Indexes the quiz file. Places the offsets of questions and answer choices
     * into QuestionIndex objects
     * 
     * @return whether or not the quiz file was successfully indexed.
     */
    async indexFile() {
        try {
			var status=0; // 0 = default, 1 = question, 2 = answer
			var lineLen=0;
			var questionNumber=0;
			var gotCorrect = false;
			let allLines;
			
			if (this.qFile===null&&this.uid===null&&this.qfid===null){
				throw (new Error("No Questionfile Specified"));
			} else if (this.qFile!==null){
				
				try {
					this.rawQuestions = await this.readUploadedFileAsText(this.qFile);	
				} catch (error) {
					throw(error);
				}
				

				allLines = this.rawQuestions.split(/\r\n|\n/);		

	//				allLines.forEach( (line) =>{
				for (let x=0;x<allLines.length;x++){
					if (!(allLines[x].slice(0,1) === process.env.REACT_APP_COMMENT) && allLines[x].trim().length !== 0) {
						if (status === 0) {
							// expecting a question
							if (allLines[x].slice(0,2)===process.env.REACT_APP_Q_START) {
								// question start
								status = 1;
								lineLen = allLines[x].replace("\\W", "").length;  // replace all non word characters
								if (lineLen <= process.env.REACT_APP_MAX_CHARS_PER_LINE) {
									questionNumber++;
									this.questions.push(new Question(''));
								} else {
	//										status=0;
									throw (new Error(`Question ${questionNumber+1}: Line ${allLines[x]} Length (${lineLen}) is greater than Maximum Question Length: ${process.env.REACT_APP_MAX_CHARS_PER_LINE}`));
								}
							} else {
								console.error("IndexFile: unexpected input: " + allLines[x]);
								throw (new Error("IndexFile: unexpected input: " + allLines[x]));
							}
						} else if (status === 1) {

							// reading question, checking for answer start
							lineLen = allLines[x].replace("\\W", "").length;
							if (lineLen <= process.env.REACT_APP_MAX_CHARS_PER_LINE) {
								if (allLines[x].slice(0,2) === process.env.REACT_APP_A_START) {
									// question end, answer start
									status = 2;
								} else {
									// keep track of end of last part of question
									let curQuestion = this.questions[questionNumber-1].getQuestion();
									this.questions[questionNumber-1].setQuestion(curQuestion + allLines[x]);
								}
							} else {

								throw (new Error(`Question Line: ${allLines[x]}, Length ${lineLen} is greater than Maximum Question Length: ${process.env.REACT_APP_MAX_CHARS_PER_LINE}`));
							}
						} else {
							// reading answer, checking for answer end
							if (allLines[x].slice(0,2) === process.env.REACT_APP_A_END) {
								// answer end
								status = 0;
								gotCorrect=false;
							} else {
								// add answer offset
								if (gotCorrect){
									this.questions[questionNumber-1].addAnswer(allLines[x]);
								} else {
									gotCorrect = true;
									this.questions[questionNumber-1].setCorrect(parseInt(allLines[x].trim()));
								}
							}
						}
					}
				}
					
				if ( this.questions.length < 1 ) {
					return false;
				}
				return true;
			}
        } catch (e)
        {
			throw e;
        }
	}
	
    /**
     * @return a vector of QuestionIndex.
     */
    getQuestions()
    {
        return this.questions;
	}
	    /**
     * @return a vector of QuestionIndex.
     */
    getqfid()
    {
        return this.qfid;
    }
    getqFileName()
    {
        return this.qFileName;
    }

}

// Firestore data converter
const qFileConverter = {
	toFirestore: function(qfile) {
		return { 
			uid:qfile.uid,
			qFileName:qfile.qFileName,
			qfid:qfile.qfid,
			questions: this.questionsToFirestore(qfile.getQuestions()),
		}
	},
	//qFile=null, uid=null, qfid=null, questions=[], qFileName=''
	fromFirestore: function(snapshot, options){
		const data = snapshot.data(options);
		return new QuestionFile(
			null,
			data.uid,
			data.qfid,
			this.questionsFromFirestore(data.questions),
			data.qFileName
		)
	},
	questionsToFirestore: (questions) => {
		let fbquestions = {};
		for (var q=0;q<questions.length;q++){
			fbquestions[q] = {};
			fbquestions[q].question = questions[q].getQuestion();
			fbquestions[q].correctAnswer = questions[q].getCorrect();
			fbquestions[q].answers = questions[q].getAnswers();
		}
		return fbquestions;
	},
	//question, correctAnswer=-1, answers=[]
	questionsFromFirestore: (questions) => {
		let qFileQuestions = [];
		for (var q in questions){
			qFileQuestions.push(new Question(
				questions[q].question,
				questions[q].correctAnswer,
				questions[q].answers
			));
		}
		return qFileQuestions;
	}
}

export default QuestionFile;
export {qFileConverter};