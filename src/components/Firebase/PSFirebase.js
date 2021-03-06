import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import {qFileConverter} from '../../models/QuestionFile';
import {QuizLogConverter} from '../../models/QuizLog';
import UserProfile, {userprofileConverter} from '../../models/UserProfile'

const config = {
  apiKey: process.env.REACT_APP_FB_apiKey,
  authDomain: process.env.REACT_APP_FB_authDomain,
  databaseURL: process.env.REACT_APP_FB_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_FB_messagingSenderId,
};

class Firebase {
	constructor() {
		app.initializeApp(config);
		this.auth = app.auth();
		this.userdb = app.firestore();
		this.storage = app.storage();
	}

	getUser = () => {
		return this.auth.currentUser;
	}

	getUserProfile = async (uid) => {
		const db = this.userdb;
		let userP = await db.collection("qUsers").doc(uid).withConverter(userprofileConverter).get();
		let userPData = null;
		if (userP.exists){
			userPData = userP.data();
		}
		return userPData;
	}

	getAllUsers = async () =>{
		let returnList = []
		const db = this.userdb;
		let userList = await db.collection("qUsers").get();
		for (var user of userList.docs){
			returnList.push(await this.getUserProfile(user.id));
		}
		return returnList;
	}

	doImageUpdate = async (image) =>{
		try{
			const cuser = this.getUser();
			const userPhoto = await this.storage.ref(`/user/${cuser.uid}/images/${image.name}`).put(image);
			if (userPhoto){
				const photoURL = await this.storage.ref(`/user/${cuser.uid}/images`).child(image.name).getDownloadURL()
				await this.doUpdateUserDisplayURL(photoURL);
				return photoURL
			} else {
				throw new Error (`Error Uploading Image`);
			}
		} catch (e){
			throw e;
		}
	}

	getQFiles = async (queryType='USER') => {
		try {
			const cuser = this.getUser();
			const db = this.userdb;
			let retqfiles= {};
			let fbqfiles;
			const qfileRef = db.collection("qFiles");
			
			if(queryType==='QUIZTABLE'){
				fbqfiles = await qfileRef.where("uid","in",[cuser.uid]).get();
			} else if (queryType==='ADMIN') {
				fbqfiles = await qfileRef.get();
			} else if (queryType==='USER'){
				fbqfiles = await qfileRef.where("uid","in",[cuser.uid,'DEFAULT']).get();
			}

			if(fbqfiles.empty){
				return false;
			} else {
				for (var qfile of fbqfiles.docs){
					let fbport = await qfileRef.doc(qfile.id).withConverter(qFileConverter).get()
					let fbdata = await fbport.data();
					let user = (queryType==='ADMIN')?await this.getUserProfile(fbdata.uid):cuser;
					fbdata.user = user;
					retqfiles[qfile.id] = fbdata;
				}
				return retqfiles;
			}
		} catch(error){
			console.error(`Firebase->getQFiles Call Error: Something went wrong: ${error.message} ${error.stack}`);
			throw error;
		}
	}

	getQFile = async (qfile) => {
		try {
			if (qfile.uid===null&&qfile.qfid===null){
				throw (new Error("No Questionfile Specified"));
			} else {
						
				const qfileRef = this.userdb.collection("qFiles");
				let fbqfile = await qfileRef.doc(qfile.qfid).withConverter(qFileConverter).get();
				return fbqfile;
			}
		} catch(error){
			console.error(`Firebase->getPortfolios Call Error: Something went wrong: ${error.message} ${error.stack}`);
			throw error;
		}
	}

	deleteQuizFile = async (qfile) =>{
		try {
			if (qfile.uid===null&&qfile.qfid===null){
				throw (new Error("No Questionfile Specified"));
			} else {
				let qfid = qfile.qfid;
				let uid = qfile.uid;
				//delete all the quizzes which used the quizfile
				const quizLogRef = this.userdb.collection("qQuizLog");
				let quizLogs = await quizLogRef.where("uid","==",uid).where("qfid","==",qfid).get();
				console.log(quizLogs.docs)
				for (let qlog of quizLogs.docs){
					await quizLogRef.doc(qlog.id).delete();
				}
				
				//delete the quiz file
				const qfileRef = this.userdb.collection("qFiles");
				await qfileRef.doc(qfid).delete();
				return true;
			}
		} catch(error){
			console.error(`Firebase->deleteQuizFile Call Error: Something went wrong: ${error.message} ${error.stack}`);
			throw error;
		}
	}

	setQFile = async (qfile) => {
		try {
			if (typeof qfile==='undefined'){
				throw (new Error("No Questionfile Specified"));
			} else {
				if (qfile.qfid===null){
					return await this.createQFile(this);
				} else {
					const qFileRef = this.userdb.collection("qFiles");
					let fbqfile = await qFileRef.doc(qfile.qfid).withConverter(qFileConverter).set(qfile);
					return fbqfile;
				}
			}
		} catch(error){
			console.error(`Firebase->getPortfolios Call Error: Something went wrong: ${error.message} ${error.stack}`);
			throw error;
		}
	}

	createQFile = async (qfile) => {
		try {
			if (typeof qfile==='undefined'){
				throw (new Error("No Questionfile Specified"));
			} else {
				
				const cuser = this.getUser();
				const db = this.userdb;
				let fbqFile = await db.collection("qFiles").doc();
				qfile.qfid = fbqFile.id;
				qfile.uid = (qfile.uid===null)?cuser.uid:qfile.uid;
				await fbqFile.withConverter(qFileConverter).set(qfile);
				return qfile;
			}
		} catch(error){
			console.error(`Firebase->createQFile Call Error: Something went wrong: ${error.message} ${error.stack}`);
			throw error;
		}
	}

	createQuizLog = async (quizlog) => {
		try {
			if (typeof quizlog==='undefined'){
				throw (new Error("No Quizlog Specified"));
			} else {
				const cuser = this.getUser();
				const db = this.userdb;
				let fbQuizLog = await db.collection("qQuizLog").doc();
				quizlog.qid = fbQuizLog.id;
				quizlog.uid = cuser.uid;
				await fbQuizLog.withConverter(QuizLogConverter).set(quizlog);
				return quizlog;
			}
		} catch(error){
			console.error(`Firebase->createQFile Call Error: Something went wrong: ${error.message} ${error.stack}`);
			throw error;
		}
	}

	deleteQuizLog = async (quizLog) =>{
		try {
			if (quizLog.uid===null&&quizLog.qid===null){
				throw (new Error("No Quiz Specified"));
			} else {
				let qid = quizLog.qid;
				//delete all the quizzes which used the quizfile
				const quizLogRef = this.userdb.collection("qQuizLog");
				await quizLogRef.doc(qid).delete();
			}
		} catch(error){
			console.error(`Firebase->deleteQuizLog Call Error: Something went wrong: ${error.message} ${error.stack}`);
			throw error;
		}
	}

	getQuizLogs = async (ureport,areport, convert=true) => {
		try {
			const cuser = this.getUser();
			const db = this.userdb;
			var retQuizLogs = {};
			var fbQuizLogs;
			const qQuizLogRef = db.collection("qQuizLog");
			if(areport){
				fbQuizLogs = await qQuizLogRef.get();
			} else {
				fbQuizLogs = await qQuizLogRef.where("uid","==",cuser.uid).get();
			}

			if(fbQuizLogs.empty){
				return false;
			} else if (convert) {
				for (let quizlog of fbQuizLogs.docs){
					let fbquizlog = await qQuizLogRef.doc(quizlog.id).withConverter(QuizLogConverter).get()
					let fbdata = await fbquizlog.data();
					retQuizLogs[quizlog.id] = fbdata;
				}
				return retQuizLogs;
			} else {
				for (let quizlog of fbQuizLogs.docs){
					let fbquizlog = await qQuizLogRef.doc(quizlog.id).get()
					let fbdata = await fbquizlog.data();
					let quizUser = await this.getUserProfile(fbdata.uid);
					fbdata.displayName = quizUser.displayName;
					let curQfile = await this.getQFile({qfid:fbdata.qfid});
					curQfile = await curQfile.data();
					for (let q in fbdata.questionLog){
						fbdata.questionLog[q].Question = curQfile.questions[fbdata.questionLog[q].QuizFileQuestionNum].question;
					}
					retQuizLogs[quizlog.id] = fbdata;
				}
				return retQuizLogs;
			}
		} catch(error){
			console.error(`Firebase->getQuizLogs Call Error: Something went wrong: ${error.message} ${error.stack}`);
			throw error;
		}
	}

	doUpdateUserDisplayURL = async (displayURL) => {
		let curUser = this.auth.currentUser;
		if (curUser){
			await curUser.updateProfile({
			displayName: curUser.displayName,
			photoURL: displayURL
			});
		}
		

	}

	doUpdateUserProfile = async (profile) => {
		let curUser = this.auth.currentUser;
		try {
			if (curUser!=null){
				if(typeof profile.displayName!=='undefined' || profile.displayName!==null){
					await this.doUpdateUserDocument (curUser.uid,profile.displayName,'USER')
				}
				await curUser.updateProfile(profile);
			} else {
				throw new Error (`No Current User`);
			}
		} catch (error){
			throw(error);
		}
	}

	doCreateUserWithEmailAndPassword = async (email, password) => {
		try {
			let authUser =  await this.auth.createUserWithEmailAndPassword(email, password);
			await this.doCreateUserDocument(authUser);
			return authUser;
		} catch (e){
			throw e;
		}
	}

	doCreateUserDocument = async (authUser) => {
		const db = this.userdb;
		db.collection("qUsers").doc(authUser.user.uid)
		.withConverter(userprofileConverter)
		.set(new UserProfile(
		  authUser.user.uid,
		  authUser.user.displayName,
		  'USER'
		))
	}

	doUpdateUserDocument = async (uid,displayName,userRole) => {
		try {
			const db = this.userdb;
			const varCheck = (typeof uid != 'undefined' || uid!=null) && (typeof displayName != 'undefined' || displayName!=null) && (typeof userRole != 'undefined' || userRole!=null)
			if (varCheck){
				db.collection("qUsers").doc(uid)
					.withConverter(userprofileConverter)
					.set(new UserProfile(
					uid,
					displayName,
					userRole
				))		
			} else {
				throw new Error (`Submitted Arguments are invalid uid: ${uid}, displayName: ${displayName}, userRole: ${userRole}`);
			}
		} catch (e){
			throw e;
		}
	}

	doSignInWithEmailAndPassword = async (email, password) => {
		let authUser = await this.auth.signInWithEmailAndPassword(email, password);
		return authUser
	}

	doSignOut = () => { 
		this.auth.signOut(); 
	}

	doPasswordReset = async (email) =>{
		 return await this.auth.sendPasswordResetEmail(email);
	}

	doPasswordUpdate = password =>
	    this.auth.currentUser.updatePassword(password);
  
	loginValid = () => {
		let curUser = this.auth.currentUser;
		let valid=true;
		if (curUser==null){
			valid=false;
		}
		return valid;
	}
}

export default Firebase;