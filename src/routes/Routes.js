import React from "react";
import Landing from "../layouts/Landing";
import Profile from "../components/Profile";
import Home from "../components/Home";
import Quizzer from "../components/Quizzer";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ResetPassword from "../components/ResetPassword";
import Signup from "../components/Signup";
import DashboardToggle from "../layouts/DashboardToggle";
import HelpFile from "../components/HelpFile";

const Routes = () => {
  
	return (
		<Router>
			<Switch>
				<Route path="/Quizzer">
					<DashboardToggle>
						<Quizzer />
					</DashboardToggle>
				</Route>
				<Route path="/profile">
					<DashboardToggle>
						<Profile />
					</DashboardToggle>
				</Route>
				<Route path="/reset-password">
					<Landing>
						<ResetPassword />
					</Landing>
				</Route>
				<Route path="/help">
					<DashboardToggle>
						<HelpFile />
					</DashboardToggle>
				</Route>
				<Route path="/sign-up">
					<Landing>
						<Signup />
					</Landing>
				</Route>
				<Route path="/">
					<Landing>
						<Home />
					</Landing>
				</Route>
			</Switch>
		</Router>
	);
}
  
export default Routes;