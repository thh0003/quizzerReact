class UserProfile {
    constructor (
        uid,
		role='STUDENT'			// STUDENT, TEACHER, ADMIN
        ) {
        this.uid = uid;
        this.role = role;
    }
	setRole = (role) => this.role = role;
	getRole = () => this.role;
}

// Firestore data converter
const userprofileConverter = {
	toFirestore: function(userprofile) {
		return {
			uid:userprofile.uid,
			role:userprofile.role,
		}
	},
	fromFirestore: function(snapshot, options){
		const data = snapshot.data(options);
		return new UserProfile(
			data.uid,
			data.role
		)
	}
}

export default UserProfile;
export {userprofileConverter};