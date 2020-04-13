class UserProfile {
    constructor (
		uid,
		displayName='',
		role='STUDENT'			// USER, STUDENT, TEACHER, ADMIN
        ) {
		this.uid = uid;
		this.displayName = displayName;
        this.role = role;
    }
	setRole = (role) => this.role = role;
	getRole = () => this.role;
	setdisplayName = (displayName) => this.displayName = displayName;
	getdisplayName = () => this.displayName;
}

// Firestore data converter
const userprofileConverter = {
	toFirestore: function(userprofile) {
		return {
			uid:userprofile.uid,
			displayName:userprofile.displayName,
			role:userprofile.role,
		}
	},
	fromFirestore: function(snapshot, options){
		const data = snapshot.data(options);
		return new UserProfile(
			data.uid,
			data.displayName,
			data.role
		)
	}
}

export default UserProfile;
export {userprofileConverter};