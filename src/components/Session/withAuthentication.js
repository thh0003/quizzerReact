import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
			authUser: null,
			userRole:null
            };
        }
        componentDidMount () {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                async (authUser) => {
					let userprofile=null;
					if(authUser){
						userprofile = await this.props.firebase.getUserProfile(authUser.uid);
						this.setState({ authUser:authUser, userRole:userprofile.role })
					} else{
						this.setState({ authUser: null, userRole:null });
					}
                },
            );
        }

        componentWillUnmount() {
            this.listener();
        } 

        render() {
            //<Component {...this.props} authUser={this.state.authUser}/>
            return (
            <AuthUserContext.Provider value={this.state}>
                <Component authUser={this.props.authUser} userRole={this.props.userRole} {...this.props} />
            </AuthUserContext.Provider>
            );
        }
    }
    return withFirebase(WithAuthentication);
};
export default withAuthentication;