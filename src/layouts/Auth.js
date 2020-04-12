import React from "react";
import Main from "../components/Main";

const Auth = ({ children }) => <Main>{children}</Main>;

/* const Auth = ({ children }) => (
  
  <React.Fragment>
    <Main>
        <Content>{children}</Content>
        <br />
        <Footer />
    </Main>
  </React.Fragment>
);
*/
export default Auth;
