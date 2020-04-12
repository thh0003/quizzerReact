import React from 'react';
import Routes from "./routes/Routes";
import 'bootstrap/dist/css/bootstrap.min.css';
import { withAuthentication } from './components/Session';

function App() {
	return (
		<Routes />
	  );
	}
	
export default withAuthentication(App);
