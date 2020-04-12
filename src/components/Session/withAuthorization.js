import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import AuthUserContext from './context';

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
          async (authUser) => {
			let userprofile = await this.props.firebase.getUserProfile(authUser.uid);
			let provider = {
				authUser:authUser,
				userRole:userprofile.role
			};
            if (!condition(provider)) {
              this.props.history.push('/auth/sign-in');
            }
          },
        );
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {

        return (
            <AuthUserContext.Consumer>
	            {(provider) => {
						return (
							condition(provider) ? <Component {...this.props} /> : null
						);
					}
	            }
            </AuthUserContext.Consumer>
          );
    }
}

  return compose(
    withRouter,
    withFirebase,
  )(WithAuthorization);
};
export default withAuthorization;