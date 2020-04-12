import {questionConverter} from "./Question";

class QuizLog {
    constructor (
        qid=-1,
		uid=-1,
		publicview=false,
		os,
		qCount, 
		asked,
		correct,
		duration,
		start_ts,
		qfid,
		questionLog={}
       ) {
        this.qid = qid; //quiz id
		this.uid = uid; //user id
		this.publicview = publicview; 
		this.os = os; // operating system the software ran on
		this.qCount=qCount //Total Questions specified to be in quiz
		this.asked = asked; // questions asked
		this.correct = correct; // questions correct
		this.duration = duration; //time to take the quiz
		this.start_ts = start_ts; //timestamp when the quiz was started
		this.qfid = qfid; // quiz file id
		this.questionLog=questionLog; //Question File Number, Response, Correct Response
		this.quizQuestionOrder=[];
		
	}
	
	setqid = (qid) => this.qid = qid;
	setuid = (uid) => this.uid = uid;
	setpublicview = (publicview) => this.publicview = publicview;
	setos = (os) => this.os = os;
	setasked = (asked) => this.asked = asked;
	setcorrect = (correct) => this.correct = correct;
	setos = (os) => this.os = os;
	setduration = (duration) => this.duration = duration;
	setstart_ts = (start_ts) => this.start_ts = start_ts;
	setqfid = (qfid) => this.qfid = qfid;
	setqcount = (qCount) => this.qCount=qCount;
	getqcount = () => this.qCount;
	getqid = () => this.qid;
	getuid = () => this.uid;
	getpublicview = () => this.publicview;
	getos = () => this.os;
	getasked = () => this.asked;
	getcorrect = () => this.correct;
	getduration = () => this.duration;
	getstart_ts = () => this.start_ts;
	getqfid = () => this.qfid;

	shuffle = async (numPossibleQuestions) => {
		let quizQuestionOrder = [];
		let quizTempOrder = {};
		let quizQuestionsCount = this.qCount;
		var i =0; 
		let tempQuest=0;
		while (i<quizQuestionsCount) {
			tempQuest=Math.floor(Math.random() * numPossibleQuestions);
			if (typeof quizTempOrder[tempQuest]==='undefined'){
				quizTempOrder[tempQuest] = true;
				quizQuestionOrder.push(tempQuest);
				i++;
			}
		}
		return quizQuestionOrder;
	}

	getQuestion = () => {
		let curQuestionID = this.quizQuestionOrder.shift();
		let curQuestion=null
		let curQuestions = this.qfid.getQuestions();
		if (typeof curQuestionID !== 'undefined'){
			this.asked++;
			curQuestion = curQuestions[curQuestionID];
			let qlogIndex = Object.keys(this.questionLog).length+1;

			this.questionLog[qlogIndex] = {
				QuestionNumber:qlogIndex,
				QuizFileQuestionNum:curQuestionID,
				correct:curQuestion.getCorrect(),
			};
		} else {
			throw new Error ('All questions have been asked.');
		}
		return curQuestion;
	}

	quizInit = async () => {
		let quizQuestions = this.qfid.getQuestions();
		let numQuestions = Object.keys(quizQuestions).length;
		this.quizQuestionOrder = await this.shuffle(numQuestions);
		return true;
	}
	logQuestion = (id,qnum,answer,correctanswer) =>{
		this.questionLog[id] = {id,qnum,answer,correctanswer};
	}
	getQuestionLog = () => { return this.questionLog;}
}

const QuizLogConverter = {
	toFirestore: function(quizlog) {
		let tofs = {
			qid:quizlog.qid, //quiz id
			uid:quizlog.uid, //user id
			publicview:quizlog.publicview, 
			os:quizlog.os, // operating system the software ran on
			asked:quizlog.asked, // questions asked
			correct:quizlog.correct, // questions correct
			duration:quizlog.duration, //time to take the quiz
			start_ts:quizlog.start_ts, //timestamp when the quiz was started
			qfid:quizlog.qfid.qfid, // quiz file id
			qCount:quizlog.qCount, // total Questions
			questionLog:questionConverter.questionsToFirestore(quizlog.questionLog)
		};
		return tofs;
	},
	fromFirestore: function(snapshot, options){
		const data = snapshot.data(options);
		return new QuizLog(
			data.qid,
			data.uid,
			data.publicview,
			data.os,
			(data.qCount)?data.qCount:0,
			data.asked,
			data.correct,
			data.duration,
			data.start_ts,
			data.qfid,
			questionConverter.questionsFromFirestore(data.questionLog)
		)
	}
}

export default QuizLog;
export {QuizLogConverter};