const initialState = {
	showAnswers: false,
	timeLimit: 0,
	numQuestions: 10,
	selectedQfile:null,
	qstart:false,
	Qfiles:null,
	sectionVisible:{SETTINGS:'visible',QUIZ:'collapse',REPORT:'collapse'},
	quiz:null,
	Question:null,
	SubmitedAnswer:0,
	lastCorrectAnswer:null,
	qreport:false,
	areport:false,
	profileUpdate:false,
	timesUp:false,
	language:{
		displayLanguage: 'ENGLISH',
		languageId:'en'
	},
	langChange:true
  };


const resetState = {
	showAnswers: false,
	timeLimit: 0,
	qstart:false,
	sectionVisible:{SETTINGS:'visible',QUIZ:'collapse',REPORT:'collapse'},
	quiz:null,
	Question:null,
	SubmitedAnswer:0,
	lastCorrectAnswer:null,
	qreport:false,
	areport:false,
	timesUp:false,
	language:{
		displayLanguage: 'ENGLISH',
		languageId:'en'
	},
	langChange:true
};

//showAnswers={showAnswers} timeLimit={timeLimit} numQuestions={numQuestions} selectedQfile={selectedQfile} qstart={qstart}
export default function(state = initialState, action) {
	switch (action.type) {
		case 'UPDATE_SHOWANSWERS':
			//factor = HTML Tag id, value = whole html HTML Tag
			return {
				...state,
				showAnswers: action.showAnswers
		};
		case 'UPDATE_CORRECT_ANSWER':
			//factor = HTML Tag id, value = whole html HTML Tag
			return {
				...state,
				lastCorrectAnswer: action.lastCorrectAnswer
		};
		case 'UPDATE_TIMELIMIT':
			//factor = HTML Tag id, value = whole html HTML Tag
			return {
				...state,
				timeLimit: action.timeLimit
		};
		case 'UPDATE_NUMQUESTIONS':
			//factor = HTML Tag id, value = whole html HTML Tag
			return {
				...state,
				numQuestions: action.numQuestions
		};                  

		case 'UPDATE_QFILE':
			//factor = HTML Tag id, value = whole html HTML Tag
			return {
				...state,
				selectedQfile: action.selectedQfile
		};
		case 'UPDATE_QSTART':
			//factor = HTML Tag id, value = whole html HTML Tag
			return {
				...state,
				qstart: action.qstart,
				sectionVisible:(action.qstart===true)?{SETTINGS:'collapse',QUIZ:'visible',REPORT:'collapse'}:{SETTINGS:'visible',QUIZ:'collapse',REPORT:'collapse'}
		};
		case 'UPDATE_REPORTS':
			//factor = HTML Tag id, value = whole html HTML Tag
			return {
				...state,
				qreport: action.qreport,
				areport: action.areport,
				sectionVisible:(state.qstart===true)?{SETTINGS:'collapse',QUIZ:'visible',REPORT:'collapse'}:((action.qreport===true||action.areport===true)?{...state.sectionVisible, REPORT:'visible'}:{...state.sectionVisible, REPORT:'collapse'})
			};
		case 'UPDATE_QFILES':
			//factor = HTML Tag id, value = whole html HTML Tag
			return {
				...state,
				Qfiles: action.Qfiles
			};
		case 'UPDATE_QUIZ':
			//factor = HTML Tag id, value = whole html HTML Tag
			return {
				...state,
				quiz: action.quiz
		};
		
		case 'UPDATE_QUESTION':
			//factor = HTML Tag id, value = whole html HTML Tag
			return {
				...state,
				Question: action.Question
		};
		case 'UPDATE_ANSWER':
			//factor = HTML Tag id, value = whole html HTML Tag
			return {
				...state,
				SubmitedAnswer: action.SubmitedAnswer
		};
		case 'QUIZ_RESET':
			//factor = HTML Tag id, value = whole html HTML Tag
			return {
				...resetState,
				numQuestions:state.numQuestions,
				Qfiles:state.Qfiles,
				selectedQfile:state.selectedQfile,
				timeLimit:state.timeLimit,
				showAnswers:state.showAnswers
			};

		case 'SIGNOUT':
			//factor = HTML Tag id, value = whole html HTML Tag
			return {
				...initialState
			};			
		case 'UPDATE_PROFILE':
			//factor = HTML Tag id, value = whole html HTML Tag
			return {
				...state,
				profileUpdate:action.profileUpdate
		};			
		case 'UPDATE_TIMESUP':
			//factor = HTML Tag id, value = whole html HTML Tag
			return {
				...state,
				timesUp:action.timesUp
		};			
		case 'UPDATE_LANGUAGE':
			//factor = HTML Tag id, value = whole html HTML Tag
			return {
				...state,
				language:action.language,
				langChange:action.langChange
		};			
		default:
			return state;
	}
}