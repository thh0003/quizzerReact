import React from 'react';
import AuthUserContext from "./context";
export const withAuthUser = Component => props => (
    <AuthUserContext.Consumer>
      {(provider) => <Component authuser={provider.authUser} userrole={provider.userRole} {...props} />}
    </AuthUserContext.Consumer>
  );
export default withAuthUser;